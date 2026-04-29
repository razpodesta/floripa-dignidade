/**
 * @section Impact Analytics - Bayesian Metrics Aggregator (Orchestrator)
 * @description Orquestador superior encargado de transformar el universo de datos
 * de reputación en indicadores de aceptación popular de grado forense.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & Modular Boundary Fix.
 * SANEADO Zenith: Resolución de error TS2345 y alineación de contratos atómicos.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Zod Schemas & Internal Contracts) */
import { PopularAcceptanceIndicatorSchema } from '../schemas/PopularAcceptanceIndicator.schema';
import type { IPopularAcceptanceIndicator } from '../schemas/PopularAcceptanceIndicator.schema';
import type { IEvaluationInput } from '../schemas/EvaluationInput.schema';

/* 2. Enjambre Atómico de Precisión Matemática */
import { AccumulatePulseMetrics } from './atomic/AccumulatePulseMetrics';
import { CalculateCommunityConsensus } from './atomic/CalculateCommunityConsensus';
import { CalculateStatisticalConfidence } from './atomic/CalculateStatisticalConfidence';
import { CalculateWeightedBayesianScore } from './atomic/CalculateWeightedBayesianScore';

/** Identificador técnico del motor para el Neural Sentinel. */
const IMPACT_ORCHESTRATOR_IDENTIFIER = 'IMPACT_ANALYTICS_CORE_ENGINE';

/**
 * Procesa integralmente un conjunto de evaluaciones ciudadanas para generar el
 * "Termómetro de Verdad" institucional.
 *
 * @param evaluatedEntityIdentifierLiteral - UUID de la entidad (Noticia/Gasto/Denuncia).
 * @param evaluationPulsesCollection - Datos de entrada agnósticos.
 * @returns {Promise<IPopularAcceptanceIndicator>} Indicador validado, auditado e inmutable.
 */
export const AggregateBayesianImpactMetrics = async (
  evaluatedEntityIdentifierLiteral: string,
  evaluationPulsesCollection: IEvaluationInput[],
): Promise<IPopularAcceptanceIndicator> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    IMPACT_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_STATISTICAL_AGGREGATION_PIPELINE',
    correlationIdentifier,
    async () => {
      try {
        /**
         * @constant CONFIDENCE_THRESHOLD_CONSTANT - Mínimo de peso para fiabilidad 1.0.
         * @constant SYSTEM_GLOBAL_MEAN_SCORE - Neutro (0.5).
         */
        const CONFIDENCE_THRESHOLD_CONSTANT = 10;
        const SYSTEM_GLOBAL_MEAN_SCORE = 0.5;

        // FASE 1: REDUCCIÓN DE DATOS (Saneado: Ahora consume IEvaluationInput)
        const {
          weightedTrustScoreSumAccumulator,
          totalTrustWeightAccumulator,
          distributionMetadata,
        } = AccumulatePulseMetrics(evaluationPulsesCollection);

        // FASE 2: CÁLCULO BAYESIANO PONDERADO
        const calculatedWeightedTrustScore = CalculateWeightedBayesianScore({
          currentEntityWeightedSum: weightedTrustScoreSumAccumulator,
          currentEntityTotalWeight: totalTrustWeightAccumulator,
          globalSystemMeanScore: SYSTEM_GLOBAL_MEAN_SCORE,
          confidenceThresholdConstant: CONFIDENCE_THRESHOLD_CONSTANT,
        });

        // FASE 3: ENSAMBLAJE DE INDICADOR SOBERANO
        const popularAcceptanceIndicatorSnapshot: IPopularAcceptanceIndicator = {
          indicatorIdentifier: crypto.randomUUID() as IPopularAcceptanceIndicator['indicatorIdentifier'],
          targetEntityIdentifier: evaluatedEntityIdentifierLiteral,
          weightedTrustScoreNumeric: calculatedWeightedTrustScore,
          statisticalConfidenceLevelNumeric: CalculateStatisticalConfidence(
            totalTrustWeightAccumulator,
            CONFIDENCE_THRESHOLD_CONSTANT,
          ),
          totalParticipantQuantity: evaluationPulsesCollection.length,
          authorityLevelDistributionMetadata: {
            ...distributionMetadata,
            technicalAuditorsQuantity: 0,
          },
          currentAcceptanceTrend: 'STABLE_CONSENSUS',
          communityConsensusIndexNumeric: CalculateCommunityConsensus(calculatedWeightedTrustScore),
          lastAggregationTimestampISO: new Date().toISOString(),
        };

        // FASE 4: ADUANA DE ADN (Validación Final)
        const validationResult = PopularAcceptanceIndicatorSchema.safeParse(
          popularAcceptanceIndicatorSnapshot,
        );

        if (!validationResult.success) {
          throw new Error('IMPACT_INDICATOR_ADN_CORRUPTION');
        }

        // FASE 5: REPORTE DE SALUD SRE
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: IMPACT_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'IMPACT_INDICATOR_GENERATED',
          correlationIdentifier,
          message: 'Análisis de impacto bayesiano finalizado exitosamente.',
          contextMetadata: {
            entityId: evaluatedEntityIdentifierLiteral,
            trustScore: calculatedWeightedTrustScore,
          },
        });

        return validationResult.data;
      } catch (caughtError: unknown) {
        const errorDescriptionLiteral =
          caughtError instanceof Error ? caughtError.message : String(caughtError);

        throw new InternalSystemException('FALLO_EN_PROCESAMIENTO_ESTADISTICO_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          evaluatedEntityIdentifierLiteral,
          correlationIdentifier,
        });
      }
    },
  );
};
