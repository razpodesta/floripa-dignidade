/**
 * @section Territorial Logic - Cloud Persistence Synchronizer
 * @description Átomo encargado de volcar las entidades territoriales normalizadas
 * hacia la base de datos soberana (Supabase). Implementa historización de extracción.
 *
 * Protocolo OEDP-V16.0 - Cloud Sovereign & Database Integrity.
 */

import { EmitTelemetrySignal, TraceExecutionTime } from '@floripa-dignidade/telemetry';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import type { ITerritorialEntity } from '../../schemas/TerritorialEntity.schema';

/**
 * Persiste una colección de entidades territoriales en la infraestructura propia.
 *
 * @param entitiesCollection - Lista de entidades normalizadas.
 * @param correlationIdentifier - Identificador de trazabilidad.
 */
export const PersistTerritorialEntitiesToCloud = async (
  entitiesCollection: ITerritorialEntity[],
  correlationIdentifier: string
): Promise<void> => {
  const {
    SUPABASE_URL: supabaseUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: supabaseSecurityKeySecret
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    'TERRITORIAL_PERSISTENCE_ENGINE',
    'UPSERT_TERRITORIAL_DATA_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        /**
         * @section Lógica de Sincronización (PostgREST Upsert)
         * Mapeamos nuestras entidades al formato de tabla de Supabase.
         * 'on_conflict' garantiza que no dupliquemos distritos.
         */
        const databasePayloadCollection = entitiesCollection.map(entity => ({
          ibge_id: entity.territorialTechnicalIdentifier,
          name_literal: entity.officialTerritoryNameLiteral,
          hierarchy_level: entity.administrativeHierarchyLevel,
          last_sync_at: entity.lastSovereignSyncTimestampISO,
          metadata_snapshot: entity.geographicCentroidMetadata
        }));

        const databaseResponse = await fetch(`${supabaseUrlLiteral}/rest/v1/territorial_master_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseSecurityKeySecret,
            'Authorization': `Bearer ${supabaseSecurityKeySecret}`,
            'Prefer': 'resolution=merge-duplicates' // Lógica de actualización si existe el ID.
          },
          body: JSON.stringify(databasePayloadCollection)
        });

        if (!databaseResponse.ok) {
          throw new Error(`DATABASE_POSTGREST_ERROR_${databaseResponse.status}`);
        }

        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: 'TERRITORIAL_PERSISTENCE',
          operationCode: 'CLOUD_SYNC_SUCCESSFUL',
          correlationIdentifier,
          message: 'TERRITORIAL.LOGS.SYNC_NOMINAL',
          contextMetadata: {
            recordsAffectedQuantity: entitiesCollection.length
          }
        });

      } catch (caughtError: unknown) {
        throw new InternalSystemException('FALLO_EN_PERSISTENCIA_TERRITORIAL_NUBE', {
          errorTraceLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError),
          correlationIdentifier
        });
      }
    }
  );
};
