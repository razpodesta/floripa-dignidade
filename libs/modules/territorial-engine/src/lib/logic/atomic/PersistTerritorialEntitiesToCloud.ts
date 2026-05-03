/**
 * @section Territorial Logic - Cloud Persistence Orchestrator
 * @description Orquestador encargado de volcar las entidades normalizadas hacia
 * el Ledger Soberano. Coordina la validación de entorno y el rastro forense.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Sincronización PascalCase y Atomización SRP.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { EmitTelemetrySignal, TraceExecutionTime } from '@floripa-dignidade/telemetry';
import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { GlobalBaseException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural */
import type { ITerritorialEntity } from '../../schemas/TerritorialEntity.schema';

/* 2. Enjambre Atómico Local (Internal Swarm) */
import { MapTerritoryToCloudLedger } from './MapTerritoryToCloudLedger';
import { ExecuteTerritorialUpsertAction } from './ExecuteTerritorialUpsertAction';

/** Identificador técnico del aparato para el Neural Sentinel. */
const PERSISTENCE_ENGINE_IDENTIFIER = 'TERRITORIAL_PERSISTENCE_ENGINE';

/**
 * Persiste una colección de entidades territoriales en la infraestructura Cloud-Sovereign.
 *
 * @param territorialEntitiesCollection - Lista de entidades purificadas.
 * @param correlationIdentifier - ID de trazabilidad forense.
 */
export const PersistTerritorialEntitiesToCloud = async (
  territorialEntitiesCollection: ITerritorialEntity[],
  correlationIdentifier: string
): Promise<void> => {

  // 1. CAPTURA DE SOBERANÍA DE HARDWARE (Aduana de Entorno)
  const {
    SUPABASE_URL: cloudUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    PERSISTENCE_ENGINE_IDENTIFIER,
    'UPSERT_TERRITORIAL_DATA_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        // 2. TRANSFORMACIÓN DE ADN (Delegación Atómica)
        const cloudPersistencePayloadCollection = territorialEntitiesCollection.map(
          MapTerritoryToCloudLedger
        );

        // 3. DESPACHO FÍSICO A LA NUBE (Delegación Atómica)
        await ExecuteTerritorialUpsertAction(
          cloudUrlLiteral,
          cloudSecurityKeySecret,
          cloudPersistencePayloadCollection
        );

        // 4. REPORTE DE ÉXITO OPERACIONAL (SRE Visibility)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: PERSISTENCE_ENGINE_IDENTIFIER,
          operationCode: 'TERRITORIAL_SYNC_NOMINAL',
          correlationIdentifier,
          message: 'TERRITORIAL.LOGS.SYNC_NOMINAL',
          contextMetadataSnapshot: {
            synchronizedRecordsQuantity: territorialEntitiesCollection.length
          }
        });

      } catch (caughtError: unknown) {
        /**
         * @section Gestión de Resiliencia
         * Propagamos excepciones niveladas o alertamos de colapso de I/O.
         */
        if (caughtError instanceof GlobalBaseException) throw caughtError;

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: PERSISTENCE_ENGINE_IDENTIFIER,
          operationCode: 'TERRITORIAL_CLOUD_FAULT',
          correlationIdentifier,
          message: 'Fallo catastrófico al persistir registros territoriales.',
          contextMetadataSnapshot: {
            errorDescriptionLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError)
          }
        });

        throw caughtError;
      }
    }
  );
};
