/**
 * @section PMF Engine Logic - E-Pública Raw Data Fetcher
 * @description Átomo de red encargado de la consulta física a la API de E-Pública.
 * Implementa vigilancia SRE mediante telemetría de latencia, gestión de timeouts
 * para el Edge Runtime y validación estricta del contrato de red gubernamental.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Functional Atomicity.
 * Vision: Resilient Civic Data Acquisition.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { mapHttpErrorToException } from '@floripa-dignidade/exceptions';

/* 1. ADN de Protocolo (Aduana de Red) */
import { EPublicaApiResponseSchema } from '../../../schemas/protocol/EPublicaExpense.schema';
import type { IEPublicaApiResponse } from '../../../schemas/protocol/EPublicaExpense.schema';

/**
 * @interface IEPublicaFetchParameters
 * @description Contrato inmutable para la parametrización de la consulta externa.
 */
export interface IEPublicaFetchParameters {
  readonly municipalitySlugLiteral: string; // ej: 'florianopolis'
  readonly initialPeriodLiteral: string;     // formato: 'mm/aaaa'
  readonly finalPeriodLiteral: string;       // formato: 'mm/aaaa'
  readonly managementUnitIdentifier?: number;
  readonly startingRecordIndex?: number;
  readonly recordQuantityLimit?: number;
}

/** Identificador técnico del aparato para el Neural Sentinel. */
const NETWORK_FETCHER_IDENTIFIER = 'EPUBLICA_RAW_NETWORK_FETCHER';

/**
 * Ejecuta una petición GET asíncrona hacia el portal de transparencia solicitado.
 *
 * @param parameters - Configuración de filtrado y paginación.
 * @param correlationIdentifier - ID de trazabilidad forense del hilo superior.
 * @returns {Promise<IEPublicaApiResponse>} Respuesta validada y purificada por Zod.
 * @throws {InternalSystemException} Si la conexión falla o el ADN es corrupto.
 */
export const FetchRawEPublicaData = async (
  parameters: IEPublicaFetchParameters,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<IEPublicaApiResponse> => {

  return await TraceExecutionTime(
    NETWORK_FETCHER_IDENTIFIER,
    'EXECUTE_EXTERNAL_API_REQUEST',
    correlationIdentifier,
    async () => {
      // 1. CONSTRUCCIÓN DE IDENTIDAD DE RED (URL Building)
      const baseApiUrlLiteral = `https://transparencia.e-publica.net/epublica-portal/rest/${parameters.municipalitySlugLiteral}/api/v1/despesa`;

      const queryParameters = new URLSearchParams({
        periodo_inicial: parameters.initialPeriodLiteral,
        periodo_final: parameters.finalPeriodLiteral,
        ...(parameters.managementUnitIdentifier !== undefined && { codigo_unidade: parameters.managementUnitIdentifier.toString() }),
        ...(parameters.startingRecordIndex !== undefined && { inicio_registro: parameters.startingRecordIndex.toString() }),
        ...(parameters.recordQuantityLimit !== undefined && { cantidad_registro: parameters.recordQuantityLimit.toString() }),
      });

      const finalRequestUrlLiteral = `${baseApiUrlLiteral}?${queryParameters.toString()}`;

      try {
        // 2. EJECUCIÓN FÍSICA (Fetch Standard con AbortSignal)
        const networkResponse = await fetch(finalRequestUrlLiteral, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Floripa-Dignidade-Auditor-Engine/1.0',
            'X-Correlation-ID': correlationIdentifier
          },
          /** SRE: Tiempo máximo de espera de 20 segundos para evitar bloqueos en el Edge */
          signal: AbortSignal.timeout(20000)
        });

        // 3. GESTIÓN DE FALLOS DE PROTOCOLO (HTTP Guard)
        if (!networkResponse.ok) {
          throw mapHttpErrorToException(networkResponse.status, 'PMF_ENGINE.ERRORS.NETWORK_CONNECTION_FAULT', {
            targetUrl: finalRequestUrlLiteral,
            statusText: networkResponse.statusText
          });
        }

        const rawJsonPayload = await networkResponse.json();

        // 4. ADUANA DE ADN (Safe Parsing contra el Esquema de Protocolo)
        const validationResult = EPublicaApiResponseSchema.safeParse(rawJsonPayload);

        if (!validationResult.success) {
          void EmitTelemetrySignal({
            severityLevel: 'CRITICAL',
            moduleIdentifier: NETWORK_FETCHER_IDENTIFIER,
            operationCode: 'EPUBLICA_CONTRACT_VIOLATION',
            correlationIdentifier,
            message: 'PMF_ENGINE.ERRORS.PROTOCOL_CONTRACT_VIOLATION',
            contextMetadata: {
              issues: validationResult.error.flatten(),
              municipality: parameters.municipalitySlugLiteral
            }
          });

          throw mapHttpErrorToException(502, 'PMF_ENGINE.ERRORS.PROTOCOL_CONTRACT_VIOLATION');
        }

        // 5. REPORTE DE ÉXITO SRE
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: NETWORK_FETCHER_IDENTIFIER,
          operationCode: 'EXTERNAL_DATA_RETRIEVED_NOMINAL',
          correlationIdentifier,
          message: 'PMF_ENGINE.LOGS.SYNC_SUCCESS',
          contextMetadata: {
            recordCount: validationResult.data.totalRegistros,
            municipality: parameters.municipalitySlugLiteral
          }
        });

        return validationResult.data;

      } catch (caughtError: unknown) {
        // 6. RESILIENCIA FORENSE (Catch-all)
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw mapHttpErrorToException(500, 'PMF_ENGINE.ERRORS.NETWORK_CONNECTION_FAULT', {
          originalError: errorDescriptionLiteral,
          targetUrl: finalRequestUrlLiteral
        });
      }
    }
  );
};
