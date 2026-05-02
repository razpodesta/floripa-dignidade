/**
 * @section PMF Engine Logic - E-Pública Raw Data Orchestrator
 * @description Orquestador encargado de la obtención integral de datos abiertos.
 * Coordina la construcción de URI, ejecución de red y validación de ADN Zod.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & SRE Resilience.
 * SANEADO Zenith: Sincronización PascalCase (Fix TS2724) y Atomización SRP.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { MapHttpErrorToException } from '@floripa-dignidade/exceptions';

/* 1. ADN de Protocolo (Aduana de Red) */
import { EPublicaApiResponseSchema } from '../../../schemas/protocol/EPublicaExpense.schema';
import type { IEPublicaApiResponse } from '../../../schemas/protocol/EPublicaExpense.schema';

/* 2. Enjambre Atómico Local (Swiss-Watch Swarm) */
import { BuildEPublicaRequestUrl } from './BuildEPublicaRequestUrl';
import { ExecuteEPublicaNetworkRequest } from './ExecuteEPublicaNetworkRequest';

/**
 * @interface IEPublicaFetchParameters
 * @description Contrato inmutable para la parametrización de la consulta externa.
 */
export interface IEPublicaFetchParameters {
  readonly municipalitySlugLiteral: string;
  readonly initialPeriodMonthYearLiteral: string; // ISO Naming
  readonly finalPeriodMonthYearLiteral: string;   // ISO Naming
  readonly managementUnitTechnicalIdentifier?: number;
  readonly startingRecordIndexQuantity?: number;
  readonly recordQuantityLimitQuantity?: number;
}

/** Identificador técnico del aparato para el Neural Sentinel. */
const NETWORK_ORCHESTRATOR_IDENTIFIER = 'EPUBLICA_RAW_DATA_ORCHESTRATOR';

/**
 * Ejecuta el pipeline de adquisición de datos gubernamentales.
 *
 * @param fetchParametersSnapshot - Configuración de filtrado y paginación.
 * @param correlationIdentifier - ID de trazabilidad forense del hilo superior.
 * @returns {Promise<IEPublicaApiResponse>} Respuesta validada y purificada.
 */
export const FetchRawEPublicaData = async (
  fetchParametersSnapshot: IEPublicaFetchParameters,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<IEPublicaApiResponse> => {

  return await TraceExecutionTime(
    NETWORK_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_EXTERNAL_DATA_PIPELINE',
    correlationIdentifier,
    async () => {

      // 1. CONSTRUCCIÓN DE URI (Delegación Atómica)
      const targetRequestUrlLiteral = BuildEPublicaRequestUrl(fetchParametersSnapshot);

      try {
        // 2. EJECUCIÓN DE RED (Delegación Atómica)
        const networkResponse = await ExecuteEPublicaNetworkRequest(
          targetRequestUrlLiteral,
          correlationIdentifier
        );

        const rawJsonPayloadSnapshot = await networkResponse.json();

        // 3. ADUANA DE ADN (Safe Parsing)
        const validationResult = EPublicaApiResponseSchema.safeParse(rawJsonPayloadSnapshot);

        if (!validationResult.success) {
          void EmitTelemetrySignal({
            severityLevel: 'CRITICAL',
            moduleIdentifier: NETWORK_ORCHESTRATOR_IDENTIFIER,
            operationCode: 'EPUBLICA_CONTRACT_VIOLATION',
            correlationIdentifier,
            message: 'PMF_ENGINE.ERRORS.PROTOCOL_CONTRACT_VIOLATION',
            contextMetadataSnapshot: {
              issuesCollection: validationResult.error.flatten(),
              municipalityLiteral: fetchParametersSnapshot.municipalitySlugLiteral
            }
          });

          throw MapHttpErrorToException(502, 'PMF_ENGINE.ERRORS.PROTOCOL_CONTRACT_VIOLATION');
        }

        // 4. REPORTE DE ÉXITO SRE (Visibility)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: NETWORK_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'EXTERNAL_DATA_SYNC_NOMINAL',
          correlationIdentifier,
          message: 'PMF_ENGINE.LOGS.SYNC_SUCCESS',
          contextMetadataSnapshot: {
            recordCountQuantity: validationResult.data.totalRegistros,
            municipalityLiteral: fetchParametersSnapshot.municipalitySlugLiteral
          }
        });

        return validationResult.data;

      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE COLAPSO (Resilience Layer)

        /** Evitamos la re-envoltura si el error ya es una excepción nivelada */
        if (caughtError instanceof Error && caughtError.name.includes('Exception')) {
           throw caughtError;
        }

        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw MapHttpErrorToException(500, 'PMF_ENGINE.ERRORS.NETWORK_CONNECTION_FAULT', {
          originalErrorLiteral: errorDescriptionLiteral,
          targetRequestUrlLiteral
        });
      }
    }
  );
};
