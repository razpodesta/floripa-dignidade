/**
 * @section Tools - Internationalization Dictionary Weaver Orchestrator
 * @description Orquestador soberano del pipeline de compilación lingüística.
 * Delega la ejecución a los átomos funcionales, garantizando latencia mínima
 * y una trazabilidad perfecta.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence.
 * SANEADO Zenith: Atomización implacable y eliminación del God Script.
 *
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/* 1. Infraestructura Atómica */
import { WEAVER_CONFIGURATION } from './constants/WeaverConfiguration';
import { InitializeWeaverInfrastructure } from './atomic/InitializeWeaverInfrastructure';
import { ScanAndExtractLinguisticSilos } from './atomic/ScanAndExtractLinguisticSilos';
import { PersistDictionariesAndAuditReport } from './atomic/PersistDictionariesAndAuditReport';

/**
 * Ejecuta el pipeline de consolidación de diccionarios multilingües.
 *
 * @returns {Promise<void>} Operación resuelta cuando todos los archivos están en disco.
 */
export const BuildInternationalizationDictionaries = async (): Promise<void> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    WEAVER_CONFIGURATION.WEAVER_ENGINE_IDENTIFIER_LITERAL,
    'DICTIONARY_CONSOLIDATION_PIPELINE',
    correlationIdentifier,
    async () => {

      // FASE 1: Preparación (I/O)
      await InitializeWeaverInfrastructure();

      // FASE 2: Extracción (Tree Traversal)
      const { aggregatedLinguisticDictionaries, forensicAuditTrail } =
        await ScanAndExtractLinguisticSilos(correlationIdentifier);

      // FASE 3: Volcado y Reporte (Persistence)
      await PersistDictionariesAndAuditReport(
        aggregatedLinguisticDictionaries,
        forensicAuditTrail,
        correlationIdentifier
      );

      // FASE 4: Confirmación Nominal
      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: WEAVER_CONFIGURATION.WEAVER_ENGINE_IDENTIFIER_LITERAL,
        operationCode: 'WEAVER_PIPELINE_COMPLETED',
        correlationIdentifier,
        message: 'Construcción de diccionarios finalizada con precisión industrial.',
        contextMetadata: {
          totalSilosProcessedQuantity: forensicAuditTrail.length
        }
      });
    }
  );
};
