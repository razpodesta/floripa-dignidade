/**
 * @section Impact Analytics - Bayesian Metrics Aggregator
 * @description Orquestador encargado de transformar una colección de pulsos de
 * reputación en indicadores de aceptación popular de grado forense.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Atomización de pesos y consenso. Responsabilidad Única.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import { PopularAcceptanceIndicatorSchema } from '../schemas/PopularAcceptanceIndicator.schema';
import type { IPopularAcceptanceIndicator } from '../schemas/PopularAcceptanceIndicator.schema';

/* 2. ADN de Reputación (Input Contract) */
import type { IPublicEvaluationPulse } from '@floripa-dignidade/reputation-engine';

/* 3. Enjambre de Átomos Matemáticos */
import { CalculateWeightedBayesianScore } from './atomic/CalculateWeightedBayesianScore';
import { MapEvaluationAuthorityWeight } from './atomic/MapEvaluationAuthorityWeight';
import { CalculateCommunityConsensus } from './atomic/CalculateCommunityConsensus';

/** Identificador técnico para el Neural Sentinel. */
const ANALYTICS_ENGINE_IDENTIFIER_LITERAL = 'IMPACT_ANALYTICS_ORCHESTRATOR';

/**
 * Procesa un conjunto de evaluaciones ciudadanas para generar métricas de impacto.
 *
 * @param evaluatedEntityIdentifierLiteral - UUID de la entidad bajo auditoría.
 * @param evaluationPulsesCollection - Universo de datos capturado por el Reputation Engine.
 * @returns {Promise<IPopularAcceptanceIndicator>} Indicador validado y consolidado.
 */
export const AggregateBayesianImpactMetrics = async (
  evaluatedEntityIdentifierLiteral: string,
  evaluationPulsesCollection: IPublicEvaluationPulse[]
): Promise<IPopularAcceptanceIndicator> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    ANALYTICS_ENGINE_IDENTIFIER_LITERAL,
    'EXECUTE_STATISTICAL_AGGREGATION_PIPELINE',
    correlationIdentifier,
    async () => {
      try {
        // --- 1. PROCESAMIENTO DE PESOS Y DISTRIBUCIÓN ---
        let weightedTrustScoreSumAccumulator = 0;
        let totalTrustWeightAccumulator = 0;

        const authorityDistributionMetadata = {
          verifiedCitizensQuantity: 0,
          anonymousInteractionsQuantity: 0,
          technicalAuditorsQuantity: 0,
        };

        /**
         * Reducción de Muestra (OEDP Optimization):
         * Delegamos la lógica de peso al átomo clasificador para evitar
         * inconsistencias conceptuales con el búnker de identidad.
         */
        evaluationPulsesCollection.forEach((pulse) => {
          const currentInteractionWeightNumeric = MapEvaluationAuthorityWeight(
            pulse.evaluatorIdentityIdentifier
          );

          weightedTrustScoreSumAccumulator += (pulse.quantitativeTrustScoreNumeric * currentInteractionWeightNumeric);
          totalTrustWeightAccumulator += currentInteractionWeightNumeric;

          if (!pulse.evaluatorIdentityIdentifier) {
            authorityDistributionMetadata.anonymousInteractionsQuantity++;
          } else {
            authorityDistributionMetadata.verifiedCitizensQuantity++;
          }
        });

        // --- 2. CÁLCULO DE SCORE BAYESIANO (Fórmula Pura) ---
        /**
         * @constant CONFIDENCE_THRESHOLD_CONSTANT
         * Mínimo de peso requerido para una fiabilidad del 100%.
         */
        const CONFIDENCE_THRESHOLD_CONSTANT = 10;
        const SYSTEM_GLOBAL_MEAN_SCORE = 0.5;

        const calculatedWeightedTrustScore = CalculateWeightedBayesianScore({
          currentEntityWeightedSum: weightedTrustScoreSumAccumulator,
          currentEntityTotalWeight: totalTrustWeightAccumulator,
          globalSystemMeanScore: SYSTEM_GLOBAL_MEAN_SCORE,
          confidenceThresholdConstant: CONFIDENCE_THRESHOLD_CONSTANT,
        });

        // --- 3. CONSTRUCCIÓN DE INDICADOR SRE ---
        const popularAcceptanceIndicatorSnapshot = {
          indicatorIdentifier: crypto.randomUUID(),
          targetEntityIdentifier: evaluatedEntityIdentifierLiteral,
          weightedTrustScoreNumeric: calculatedWeightedTrustScore,
          statisticalConfidenceLevelNumeric: Math.min(totalTrustWeightAccumulator / CONFIDENCE_THRESHOLD_CONSTANT, 1),
          totalParticipantQuantity: evaluationPulsesCollection.length,
          authorityLevelDistributionMetadata: authorityDistributionMetadata,
          currentAcceptanceTrend: 'STABLE_CONSENSUS', // TODO: Integrar HistoricalTrendsAnalyzer.ts
          communityConsensusIndexNumeric: CalculateCommunityConsensus(calculatedWeightedTrustScore),
          lastAggregationTimestampISO: new Date().toISOString(),
        };

        // 4. ADUANA DE ADN (Validación Final)
        return PopularAcceptanceIndicatorSchema.parse(popularAcceptanceIndicatorSnapshot);

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw new InternalSystemException('FALLO_EN_PROCESAMIENTO_ESTADISTICO_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          evaluatedEntityIdentifierLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
