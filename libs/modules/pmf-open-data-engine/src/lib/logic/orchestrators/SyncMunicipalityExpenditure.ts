/**
 * @section PMF Engine Logic - Municipality Expenditure Orchestrator
 * @description Cerebro de flujo encargado de coordinar la sincronización integral
 * del gasto público. Orquesta el enjambre de átomos para transformar la base
 * de datos de la municipalidad en inteligencia civil inmutable.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Atomización de segundo nivel y Resolución de TS6059/TS6307.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN del Dominio (Soberanía) */
import type { IPublicExpenditure } from '../../schemas/sovereign/PublicExpenditure.schema';

/* 2. Enjambre Atómico (Internal Swarm) */
import { FetchRawEPublicaData } from '../atomic/fetchers/FetchRawEPublicaData';
import { ProcessExpenditureRecord } from '../atomic/mappers/ProcessExpenditureRecord';

/**
 * @interface ISyncExpenditureParameters
 * @description Contrato de entrada para la ejecución de la auditoría masiva.
 */
export interface ISyncExpenditureParameters {
  readonly municipalitySlugLiteral: string;
  readonly periodRange: {
    readonly initial: string; // mm/aaaa
    readonly final: string;   // mm/aaaa
  };
  readonly managementUnitIdentifier?: number;
}

/** Identificador técnico del orquestador para el Neural Sentinel. */
const SYNC_ORCHESTRATOR_IDENTIFIER = 'PMF_EXPENDITURE_SYNC_ORCHESTRATOR';

/**
 * Ejecuta el ciclo de vida completo de sincronización, auditoría y homogenización.
 * Implementa procesamiento concurrente de registros para maximizar performance en el Edge.
 *
 * @param parameters - Criterios de búsqueda y filtrado presupuestario.
 * @returns {Promise<IPublicExpenditure[]>} Colección de gastos purificados y firmados.
 */
export const SyncMunicipalityExpenditure = async (
  parameters: ISyncExpenditureParameters
): Promise<IPublicExpenditure[]> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    SYNC_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_FULL_MUNICIPALITY_SYNC_PIPELINE',
    correlationIdentifier,
    async () => {
      try {
        // 1. REPORTE DE INICIO (Audit Trail)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'SYNC_PROCESS_STARTED',
          correlationIdentifier,
          message: 'PMF_ENGINE.LOGS.SYNC_STARTED',
          contextMetadata: { ...parameters }
        });

        // 2. EXTRACCIÓN (I/O de Red - Stateless)
        const rawGovernmentPayload = await FetchRawEPublicaData({
          municipalitySlugLiteral: parameters.municipalitySlugLiteral,
          initialPeriodLiteral: parameters.periodRange.initial,
          finalPeriodLiteral: parameters.periodRange.final,
          managementUnitIdentifier: parameters.managementUnitIdentifier
        }, correlationIdentifier);

        /**
         * 3. PROCESAMIENTO EN ENJAMBRE (Batch Mapping)
         * Delegamos la responsabilidad de transformación al átomo 'ProcessExpenditureRecord'.
         * SANEADO: Ejecución concurrente mediante Promise.all.
         */
        const normalizedExpenditureCollection = await Promise.all(
          rawGovernmentPayload.registros.map((governmentRecord) =>
            ProcessExpenditureRecord(
              governmentRecord,
              parameters.municipalitySlugLiteral,
              correlationIdentifier
            )
          )
        );

        // 4. REPORTE DE FINALIZACIÓN NOMINAL (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'SYNC_PROCESS_COMPLETED',
          correlationIdentifier,
          message: 'PMF_ENGINE.LOGS.SYNC_SUCCESS',
          contextMetadata: {
            processedRecordsQuantity: normalizedExpenditureCollection.length,
            municipalityLiteral: parameters.municipalitySlugLiteral
          }
        });

        return normalizedExpenditureCollection;

      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE COLAPSO (Resilience Layer)
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: SYNC_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'SYNC_PIPELINE_CRITICAL_FAULT',
          correlationIdentifier,
          message: 'Fallo catastrófico en el pipeline de auditoría de datos abiertos.',
          contextMetadata: { errorTraceLiteral: errorDescriptionLiteral }
        });

        throw new InternalSystemException('FALLO_EN_ORQUESTACION_DE_DATOS_ABIERTOS_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
