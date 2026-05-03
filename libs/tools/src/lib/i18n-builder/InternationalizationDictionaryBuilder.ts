/**
 * @section Tools - Internationalization Dictionary Weaver Orchestrator
 * @description Orquestador soberano del pipeline de compilación lingüística.
 * Coordina el flujo de Inicialización, Extracción y Persistencia de diccionarios.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & Zenith Clean Paths.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con el motor 
 * de resolución 'bundler' y estabilización del Grafo Core.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/** 
 * 🛡️ RESOLUCIÓN ZENITH: Rutas Limpias (Clean Paths).
 * Se purga el rastro .js. El orquestador de build (SWC/Bundler) 
 * gestiona la resolución nativa de TypeScript.
 */
import { WEAVER_CONFIGURATION } from './constants/WeaverConfiguration';
import { InitializeWeaverInfrastructure } from './atomic/InitializeWeaverInfrastructure';
import { ScanAndExtractLinguisticSilos } from './atomic/ScanAndExtractLinguisticSilos';
import { PersistDictionariesAndAuditReport } from './atomic/PersistDictionariesAndAuditReport';

/**
 * Ejecuta el pipeline integral de consolidación de diccionarios multilingües.
 * ⚡ PERFORMANCE: Implementa rastro de ejecución forense para auditoría de build.
 * 
 * @returns {Promise<void>} Operación resuelta cuando el rastro lingüístico está en disco.
 */
export const BuildInternationalizationDictionaries = async (): Promise<void> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    WEAVER_CONFIGURATION.WEAVER_ENGINE_IDENTIFIER_LITERAL,
    'DICTIONARY_CONSOLIDATION_PIPELINE',
    correlationIdentifier,
    async () => {

      // FASE 1: Preparación (Aduana de Infraestructura)
      await InitializeWeaverInfrastructure();

      // FASE 2: Extracción (Navegación Recursiva de Silos)
      const { aggregatedLinguisticDictionaries, forensicAuditTrail } =
        await ScanAndExtractLinguisticSilos(correlationIdentifier);

      // FASE 3: Volcado y Reporte (Persistencia y Auditoría)
      await PersistDictionariesAndAuditReport(
        aggregatedLinguisticDictionaries,
        forensicAuditTrail,
        correlationIdentifier
      );

      /**
       * 🛡️ REPORTE FINAL: Consolidación de métricas para el Neural Sentinel.
       * Alineación con contextMetadataSnapshot (Estándar V17.0).
       */
      void EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: WEAVER_CONFIGURATION.WEAVER_ENGINE_IDENTIFIER_LITERAL,
        operationCode: 'WEAVER_PIPELINE_NOMINAL',
        correlationIdentifier,
        message: 'Construcción de diccionarios finalizada con precisión industrial.',
        contextMetadataSnapshot: {
          processedSilosQuantity: forensicAuditTrail.length,
          timestampISO: new Date().toISOString()
        }
      });
    }
  );
};