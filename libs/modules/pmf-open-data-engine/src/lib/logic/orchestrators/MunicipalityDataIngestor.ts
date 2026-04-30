/**
 * @section PMF Engine Logic - Municipality Data Ingestor (Orchestrator)
 * @description Orquestador superior encargado de la ingesta masiva de datos.
 * Implementa una estrategia de procesamiento concurrente con aislamiento de fallos,
 * transformando señales gubernamentales en registros soberanos firmados.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Implementación de concurrencia, triaje de errores y métricas de fidelidad.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN de Protocolo y Soberanía (Verbatim Module Syntax) */
import { EPublicaApiResponseSchema } from '../../schemas/protocol/EPublicaExpense.schema';
import type { IEPublicaApiResponse } from '../../schemas/protocol/EPublicaExpense.schema';

/* 2. Enjambre Atómico y Centinelas */
import { ProcessExpenditureRecord } from '../atomic/mappers/ProcessExpenditureRecord';
import { SovereignPersistenceSentry } from './SovereignPersistenceSentry';

/** Identificador técnico del motor de ingesta para el Neural Sentinel. */
const DATA_INGESTOR_IDENTIFIER = 'MUNICIPALITY_DATA_INGESTOR_ENGINE';

/**
 * @interface IIngestionResult
 * @description Contrato de salida con métricas de éxito y fallo de la operación.
 */
export interface IIngestionResult {
  readonly totalProcessedQuantity: number;
  readonly successfulIngestionQuantity: number;
  readonly failedIngestionQuantity: number;
}

/**
 * Ejecuta el procesamiento de un paquete de datos, garantizando la resiliencia del lote.
 *
 * @param unvalidatedDataPayloadSnapshot - El objeto JSON crudo (Protocolo E-Pública).
 * @param municipalitySlugLiteral - Identificador de la ciudad (ej: 'florianopolis').
 * @param correlationIdentifier - Identificador de trazabilidad forense.
 * @returns {Promise<IIngestionResult>} Resumen de ejecución auditado.
 */
export const IngestMunicipalityData = async (
  unvalidatedDataPayloadSnapshot: unknown,
  municipalitySlugLiteral: string,
  correlationIdentifier: string = GenerateCorrelationIdentifier(),
): Promise<IIngestionResult> => {
  return await TraceExecutionTime(
    DATA_INGESTOR_IDENTIFIER,
    'EXECUTE_CONCURRENT_INGESTION_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 1. ADUANA DE ADN (Validación Estructural del Lote)
        const validationResult = EPublicaApiResponseSchema.safeParse(unvalidatedDataPayloadSnapshot);

        if (!validationResult.success) {
          throw new Error('EXTERNAL_DATA_BATCH_CORRUPTION');
        }

        const validatedPayload: IEPublicaApiResponse = validationResult.data;
        const recordsCollection = validatedPayload.registros;

        /**
         * 2. PROCESAMIENTO EN ENJAMBRE (Concurrent Swarm Processing)
         * Utilizamos Promise.all para procesar los registros en paralelo.
         * Cada registro se envuelve en un try/catch para asegurar la continuidad.
         */
        const executionPromisesCollection = recordsCollection.map(async (rawRecord) => {
          try {
            // FASE A: Transformación Atómica (Inferencia Geográfica + Hash + Balance)
            const sovereignExpenditure = await ProcessExpenditureRecord(
              rawRecord,
              municipalitySlugLiteral,
              correlationIdentifier,
            );

            // FASE B: Persistencia Inteligente (Detección de Mutación)
            await SovereignPersistenceSentry(sovereignExpenditure, correlationIdentifier);

            return { isSuccess: true };
          } catch (caughtRecordError: unknown) {
            // REPORTE DE FALLO INDIVIDUAL (No detiene el lote)
            void EmitTelemetrySignal({
              severityLevel: 'ERROR',
              moduleIdentifier: DATA_INGESTOR_IDENTIFIER,
              operationCode: 'INDIVIDUAL_RECORD_INGESTION_FAULT',
              correlationIdentifier,
              message: 'Fallo en un registro específico; continuando con el enjambre.',
              contextMetadata: {
                error: caughtRecordError instanceof Error ? caughtRecordError.message : 'Unknown',
              },
            });
            return { isSuccess: false };
          }
        });

        const resultsCollection = await Promise.all(executionPromisesCollection);

        // 3. CONSOLIDACIÓN DE MÉTRICAS
        const successfulIngestionQuantity = resultsCollection.filter((result) => result.isSuccess).length;
        const failedIngestionQuantity = resultsCollection.length - successfulIngestionQuantity;

        // 4. REPORTE DE FINALIZACIÓN NOMINAL
        void EmitTelemetrySignal({
          severityLevel: failedIngestionQuantity > 0 ? 'WARNING' : 'INFO',
          moduleIdentifier: DATA_INGESTOR_IDENTIFIER,
          operationCode: 'BATCH_INGESTION_FINISHED',
          correlationIdentifier,
          message: 'Ingesta de datos finalizada con reporte de fidelidad.',
          contextMetadata: {
            successfulIngestionQuantity,
            failedIngestionQuantity,
            sourceMunicipality: municipalitySlugLiteral,
          },
        });

        return {
          totalProcessedQuantity: recordsCollection.length,
          successfulIngestionQuantity,
          failedIngestionQuantity,
        };
      } catch (caughtError: unknown) {
        // 5. GESTIÓN DE COLAPSO DE ADUANA (Fallo de todo el lote)
        const errorDescriptionLiteral =
          caughtError instanceof Error ? caughtError.message : String(caughtError);

        throw new InternalSystemException('FALLO_CATASTROFICO_EN_MOTOR_DE_INGESTA', {
          originalError: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    },
  );
};
