/**
 * @section PMF Engine Logic - Municipality Expenditure Orchestrator
 * @description Cerebro de flujo encargado de coordinar la sincronización integral
 * del gasto público. Implementa procesamiento concurrente con resiliencia atómica
 * y cumplimiento estricto de tipos opcionales.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Resolución de TS2379 (exactOptionalPropertyTypes) y Atomización SRP.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { MapHttpErrorToException } from '@floripa-dignidade/exceptions';

/* 1. ADN del Dominio y Contratos (Verbatim Module Syntax) */
import type { IPublicExpenditure } from '../../schemas/sovereign/PublicExpenditure.schema';

/* 2. Enjambre Atómico Local (Swiss-Watch Swarm) */
import { FetchRawEPublicaData } from '../atomic/fetchers/FetchRawEPublicaData';
import { ProcessExpenditureRecord } from '../atomic/mappers/ProcessExpenditureRecord';
import { CalculateSyncMetrics } from '../atomic/mappers/CalculateSyncMetrics';

/**
 * @interface ISyncExpenditureParameters
 * @description Contrato inmutable para la parametrización de la auditoría masiva.
 */
export interface ISyncExpenditureParameters {
  /** Identificador de la ciudad (ej: 'florianopolis'). */
  readonly municipalitySlugLiteral: string;

  /** Rango temporal de la auditoría. */
  readonly periodRange: {
    /** Formato: 'mm/aaaa'. */
    readonly initialMonthYearLiteral: string;
    /** Formato: 'mm/aaaa'. */
    readonly finalMonthYearLiteral: string;
  };

  /** Código técnico de la unidad presupuestaria (Opcional). */
  readonly managementUnitTechnicalIdentifier?: number | undefined;
}

/** Identificador técnico del orquestador para el Neural Sentinel. */
const SYNC_ORCHESTRATOR_IDENTIFIER = 'PMF_EXPENDITURE_SYNC_ORCHESTRATOR';

/**
 * Ejecuta la sincronización integral de datos abiertos gubernamentales.
 *
 * @param parametersSnapshot - Criterios de búsqueda y filtrado institucional.
 * @returns {Promise<IPublicExpenditure[]>} Colección de gastos purificados y firmados.
 */
export const SyncMunicipalityExpenditure = async (
  parametersSnapshot: ISyncExpenditureParameters,
): Promise<IPublicExpenditure[]> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    SYNC_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_FULL_MUNICIPALITY_SYNC_PIPELINE',
    correlationIdentifier,
    async () => {
      try {
        // 1. REPORTE DE INICIO (SRE Visibility)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'SYNC_PROCESS_STARTED',
          correlationIdentifier,
          message: 'PMF_ENGINE.LOGS.SYNC_STARTED',
          contextMetadataSnapshot: { ...parametersSnapshot },
        });

        // 2. EXTRACCIÓN DE DATOS CRUDOS (I/O de Red - Stateless)
        /**
         * 🛡️ SANEADO Zenith: Resolución de TS2379.
         * Usamos desestructuración y spread condicional para evitar pasar 'undefined'
         * explícitamente a las propiedades opcionales del fetcher.
         */
        const rawGovernmentPayloadSnapshot = await FetchRawEPublicaData({
          municipalitySlugLiteral: parametersSnapshot.municipalitySlugLiteral,
          initialPeriodMonthYearLiteral: parametersSnapshot.periodRange.initialMonthYearLiteral,
          finalPeriodMonthYearLiteral: parametersSnapshot.periodRange.finalMonthYearLiteral,
          ...(parametersSnapshot.managementUnitTechnicalIdentifier !== undefined && {
            managementUnitTechnicalIdentifier: parametersSnapshot.managementUnitTechnicalIdentifier
          }),
        }, correlationIdentifier);

        /**
         * 3. PROCESAMIENTO EN ENJAMBRE (Concurrent Mapping)
         * Se envuelve cada ejecución en un bloque de resiliencia para que fallos
         * individuales no detengan el lote (Fault Tolerance).
         */
        const processSwarmPromisesCollection = rawGovernmentPayloadSnapshot.registros.map(
          async (governmentRecordSnapshot) => {
            try {
              return await ProcessExpenditureRecord(
                governmentRecordSnapshot,
                parametersSnapshot.municipalitySlugLiteral,
                correlationIdentifier,
              );
            } catch (_ignoredRecordFault: unknown) {
              return null; // Marcado para el contador de métricas.
            }
          }
        );

        const normalizedResultsCollection = await Promise.all(processSwarmPromisesCollection);

        // 4. CÁLCULO DE MÉTRICAS (Delegación Atómica)
        const metricsSnapshot = CalculateSyncMetrics(normalizedResultsCollection);

        // 5. REPORTE DE CIERRE NOMINAL (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: metricsSnapshot.failedRecordsQuantity > 0 ? 'WARNING' : 'INFO',
          moduleIdentifier: SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'SYNC_PROCESS_COMPLETED',
          correlationIdentifier,
          message: 'PMF_ENGINE.LOGS.SYNC_SUCCESS',
          contextMetadataSnapshot: {
            ...metricsSnapshot,
            municipalityLiteral: parametersSnapshot.municipalitySlugLiteral,
          },
        });

        /** Retornamos solo los registros que superaron las aduanas de ADN. */
        return normalizedResultsCollection.filter((item): item is IPublicExpenditure => item !== null);

      } catch (caughtError: unknown) {
        // 6. GESTIÓN FORENSE DE COLAPSO
        if (caughtError instanceof Error && caughtError.name.includes('Exception')) {
          throw caughtError;
        }

        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'SYNC_PIPELINE_CRITICAL_FAULT',
          correlationIdentifier,
          message: 'Fallo catastrófico en el orquestador de datos abiertos.',
          contextMetadataSnapshot: { errorTraceLiteral: errorDescriptionLiteral },
        });

        throw MapHttpErrorToException(500, 'PMF_ENGINE.ERRORS.PROTOCOL_CONTRACT_VIOLATION', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    },
  );
};
