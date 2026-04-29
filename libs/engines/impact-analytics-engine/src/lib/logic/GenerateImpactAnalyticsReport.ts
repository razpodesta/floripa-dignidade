/**
 * @section Impact Analytics - Comprehensive Report Orchestrator
 * @description Motor superior encargado de ensamblar la analítica bayesiana global
 * y el desglose territorial (Mapa de Calor).
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Desacoplamiento total de 'reputation-engine' y resolución de TS6059/TS6307.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural del Dominio (Interfaces Internas) */
import type { ITerritorialImpactReport } from '../schemas/TerritorialImpactReport.schema';
import type { IPopularAcceptanceIndicator } from '../schemas/PopularAcceptanceIndicator.schema';
import type { IEvaluationInput } from '../schemas/EvaluationInput.schema';

/* 2. Enjambre Atómico de Inteligencia */
import { AggregateBayesianImpactMetrics } from './AggregateBayesianImpactMetrics';
import { AggregateTerritorialSentiment } from './atomic/AggregateTerritorialSentiment';
import { ValidateTerritorialReportADN } from './atomic/ValidateTerritorialReportADN';

/** Identificador técnico del orquestador para el Neural Sentinel. */
const IMPACT_REPORT_ORCHESTRATOR_IDENTIFIER = 'IMPACT_ANALYTICS_REPORT_ENGINE';

/**
 * Genera un reporte de impacto multidimensional basado en entradas de evaluación.
 *
 * @param targetEntityIdentifier - UUID de la entidad bajo auditoría.
 * @param evaluationInputsCollection - Colección agnóstica de entradas (Independiente de módulos).
 * @returns {Promise<{ globalIndicator: IPopularAcceptanceIndicator, territorialReport: ITerritorialImpactReport }>}
 */
export const GenerateImpactAnalyticsReport = async (
  targetEntityIdentifier: string,
  evaluationInputsCollection: IEvaluationInput[]
): Promise<{
  readonly globalIndicator: IPopularAcceptanceIndicator;
  readonly territorialReport: ITerritorialImpactReport;
}> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    IMPACT_REPORT_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_FULL_ANALYTICS_REPORT_PIPELINE',
    correlationIdentifier,
    async () => {
      try {
        // FASE 1: ANÁLISIS BAYESIANO GLOBAL
        const globalIndicator = await AggregateBayesianImpactMetrics(
          targetEntityIdentifier,
          evaluationInputsCollection
        );

        // FASE 2: DESGLOSE TERRITORIAL (Geographic Clustering)
        const rawTerritorialClusters = await AggregateTerritorialSentiment(
          evaluationInputsCollection,
          correlationIdentifier
        );

        // FASE 3: CONSOLIDACIÓN Y ADUANA DE ADN
        const territorialReport = ValidateTerritorialReportADN({
          targetEntityIdentifier,
          territorialClustersCollection: rawTerritorialClusters,
          generationTimestampISO: new Date().toISOString()
        });

        return { globalIndicator, territorialReport };

      } catch (caughtExecutionError: unknown) {
        const errorDescriptionLiteral = caughtExecutionError instanceof Error
          ? caughtExecutionError.message
          : String(caughtExecutionError);

        throw new InternalSystemException('FALLO_CRITICO_EN_GENERACION_DE_REPORTE_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          evaluatedEntityId: targetEntityIdentifier,
          correlationIdentifier
        });
      }
    }
  );
};
