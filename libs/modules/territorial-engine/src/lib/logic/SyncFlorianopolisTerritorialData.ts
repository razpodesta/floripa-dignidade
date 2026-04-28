/**
 * @section Territorial Logic - Florianópolis Synchronization Orchestrator
 * @description Orquestador superior encargado de la actualización de la base
 * maestra de territorios. Coordina el flujo: Fetch (IBGE) -> Map (Normalización)
 * -> Persist (Cloud Storage).
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & Forensic Traceability.
 * Vision: Automated Geographic Accuracy for Social Impact.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. Átomos de Ejecución (Functional Swarm) */
import { FetchIbgeDistricts } from './atomic/FetchIbgeDistricts';
import { MapIbgeToTerritorialEntity } from './atomic/MapIbgeToTerritorialEntity';
import { PersistTerritorialEntitiesToCloud } from './atomic/PersistTerritorialEntitiesToCloud';

/** Identificador técnico del orquestador para el Neural Sentinel. */
const TERRITORIAL_SYNC_ORCHESTRATOR_IDENTIFIER = 'TERRITORIAL_SYNC_ORCHESTRATOR';

/**
 * Ejecuta el ciclo completo de sincronización territorial de la capital.
 *
 * @returns {Promise<void>} Operación resuelta tras el volcado exitoso en la nube.
 */
export const SyncFlorianopolisTerritorialData = async (): Promise<void> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    TERRITORIAL_SYNC_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_FULL_TERRITORIAL_SYNC_PIPELINE',
    correlationIdentifier,
    async () => {
      try {
        // FASE 1: CAPTURA (Extracción desde el IBGE)
        const rawIbgeDistrictsCollection = await FetchIbgeDistricts(correlationIdentifier);

        // FASE 2: NORMALIZACIÓN (Mapeo al ADN Soberano)
        /**
         * Aplicamos el mapeo atómico sobre cada registro gubernamental
         * para garantizar que nuestra base de datos sea pura.
         */
        const normalizedTerritorialEntitiesCollection = rawIbgeDistrictsCollection.map(
          (districtItem) => MapIbgeToTerritorialEntity(districtItem)
        );

        // FASE 3: PERSISTENCIA (Volcado en Supabase/Postgres)
        await PersistTerritorialEntitiesToCloud(
          normalizedTerritorialEntitiesCollection,
          correlationIdentifier
        );

        // FASE 4: REPORTE DE CIERRE NOMINAL
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: TERRITORIAL_SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'TERRITORIAL_SYNC_COMPLETED',
          correlationIdentifier,
          message: 'TERRITORIAL.LOGS.SYNC_NOMINAL',
          contextMetadata: {
            totalDistrictsSynchronizedQuantity: normalizedTerritorialEntitiesCollection.length,
            targetMunicipalityLiteral: 'FLORIANÓPOLIS'
          }
        });

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        /**
         * @section Gestión de Colapso de Pipeline
         * Se emite señal de CRITICAL para activar protocolos de sanación en SRE.
         */
        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: TERRITORIAL_SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'TERRITORIAL_SYNC_PIPELINE_COLAPSE',
          correlationIdentifier,
          message: 'Fallo catastrófico en la sincronización territorial.',
          contextMetadata: { errorDescriptionLiteral }
        });

        throw new InternalSystemException('COLAPSO_EN_PIPELINE_DE_SINCRONIZACION_TERRITORIAL', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
