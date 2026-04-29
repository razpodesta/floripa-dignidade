/**
 * @section PMF Engine Logic - Municipality Data Ingestor
 * @description Orquestador superior encargado de la ingesta de datos. Proporciona
 * una interfaz unificada para procesar datos provenientes de la API o de cargas
 * manuales de archivos JSON. Coordina la transformación y delega la persistencia
 * al Centinela de Soberanía para la detección de mutaciones y duplicados.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & Source Independence.
 * Vision: Resilient Civic Data Sovereignty.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN de Protocolo y Soberanía */
import type { IEPublicaApiResponse } from '../../schemas/protocol/EPublicaExpense.schema';
import { EPublicaApiResponseSchema } from '../../schemas/protocol/EPublicaExpense.schema';

/* 2. Enjambre Atómico y Centinelas */
import { ProcessExpenditureRecord } from '../atomic/mappers/ProcessExpenditureRecord';
import { SovereignPersistenceSentry } from './SovereignPersistenceSentry';

/** Identificador técnico del motor de ingesta. */
const DATA_INGESTOR_IDENTIFIER = 'MUNICIPALITY_DATA_INGESTOR_ENGINE';

/**
 * Ejecuta el procesamiento de un paquete de datos, sea manual o automático.
 *
 * @param rawPayloadSnapshot - El objeto JSON crudo (Protocolo E-Pública).
 * @param municipalitySlugLiteral - Identificador de la ciudad (ej: 'florianopolis').
 * @param correlationIdentifier - Identificador de trazabilidad forense.
 */
export const IngestMunicipalityData = async (
  rawPayloadSnapshot: unknown,
  municipalitySlugLiteral: string,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<{ readonly processedCountQuantity: number }> => {

  return await TraceExecutionTime(
    DATA_INGESTOR_IDENTIFIER,
    'EXECUTE_HYBRID_INGESTION_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 1. ADUANA DE ADN (Validación de la fuente, sea API o Archivo)
        const validationResult = EPublicaApiResponseSchema.safeParse(rawPayloadSnapshot);

        if (!validationResult.success) {
          throw new Error('EXTERNAL_DATA_ADN_CORRUPTION');
        }

        const validatedPayload: IEPublicaApiResponse = validationResult.data;

        /**
         * 2. PROCESAMIENTO EN LOTE (Batch Processing)
         * Recorremos los registros, los normalizamos y los pasamos por el Centinela.
         */
        const recordsToProcessCollection = validatedPayload.registros;

        for (const rawRecord of recordsToProcessCollection) {
          // FASE A: Transformación Atómica (Mapper + Hasher + Territorial)
          const sovereignExpenditure = await ProcessExpenditureRecord(
            rawRecord,
            municipalitySlugLiteral,
            correlationIdentifier
          );

          // FASE B: Persistencia Inteligente (Sentry detecta si hay cambios)
          await SovereignPersistenceSentry(sovereignExpenditure, correlationIdentifier);
        }

        // 3. REPORTE DE ÉXITO DE INGESTA
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: DATA_INGESTOR_IDENTIFIER,
          operationCode: 'DATA_INGESTION_COMPLETED',
          correlationIdentifier,
          message: 'Paquete de datos gubernamentales procesado y sincronizado.',
          contextMetadata: {
            processedQuantity: recordsToProcessCollection.length,
            sourceMunicipality: municipalitySlugLiteral
          }
        });

        return { processedCountQuantity: recordsToProcessCollection.length };

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw new InternalSystemException('FALLO_EN_MOTOR_DE_INGESTA_SRE', {
          originalError: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
