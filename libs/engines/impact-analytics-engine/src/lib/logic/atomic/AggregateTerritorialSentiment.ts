/**
 * @section Impact Analytics - Territorial Sentiment Aggregator
 * @description Átomo de lógica encargado de agrupar y ponderar los pulsos de
 * reputación por contexto territorial. Implementa el triaje de datos para
 * la futura integración con los maestros del IBGE.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Pure Logic.
 * SANEADO Zenith: Erradicación de TS6133 (Código Muerto) y atomización de pesos.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { EmitTelemetrySignal, TraceExecutionTime } from '@floripa-dignidade/telemetry';

/* 1. ADN de Reputación (Entrada) */
import type { IPublicEvaluationPulse } from '@floripa-dignidade/reputation-engine';

/**
 * @interface ITerritorialClusterResult
 * @description Representación estadística de un clúster geográfico.
 */
export interface ITerritorialClusterResult {
  readonly territoryIdentifierLiteral: string;
  readonly aggregatedTrustScoreNumeric: number;
  readonly totalInteractionQuantity: number;
  readonly communityConsensusIndexNumeric: number;
}

/**
 * Agrupa una colección de pulsos de evaluación según su origen territorial.
 *
 * @param evaluationPulsesCollection - Lista de juicios de valor capturados.
 * @param correlationIdentifier - Identificador de trazabilidad del hilo superior.
 * @returns {Promise<ITerritorialClusterResult[]>} Colección de métricas por zona.
 */
export const AggregateTerritorialSentiment = async (
  evaluationPulsesCollection: IPublicEvaluationPulse[],
  correlationIdentifier: string
): Promise<ITerritorialClusterResult[]> => {

  return await TraceExecutionTime(
    'TERRITORIAL_SENTIMENT_AGGREGATOR',
    'EXECUTE_GEOGRAPHIC_CLUSTERING',
    correlationIdentifier,
    async () => {

      /**
       * @section Mapa de Acumulación Geográfica
       * Clave: Nombre del territorio normalizado.
       */
      const territorialMap = new Map<string, {
        weightedSum: number;
        weightCount: number;
        interactionCount: number;
      }>();

      evaluationPulsesCollection.forEach((evaluationPulse) => {
        /**
         * @future_integration
         * Aquí se invocará a 'territorial-engine.NormalizeTerritory'
         * para validar contra los códigos IBGE oficiales.
         */
        const territoryKeyLiteral = (evaluationPulse.territorialContextLiteral || 'FLORIANOPOLIS_GLOBAL')
          .trim()
          .toUpperCase();

        const currentCluster = territorialMap.get(territoryKeyLiteral) || {
          weightedSum: 0,
          weightCount: 0,
          interactionCount: 0
        };

        // Ponderación: Ciudadanos Verificados = 1.0, Anónimos = 0.1
        const interactionWeightNumeric = evaluationPulse.evaluatorIdentityIdentifier ? 1.0 : 0.1;

        currentCluster.weightedSum += (evaluationPulse.quantitativeTrustScoreNumeric * interactionWeightNumeric);
        currentCluster.weightCount += interactionWeightNumeric;
        currentCluster.interactionCount += 1;

        territorialMap.set(territoryKeyLiteral, currentCluster);
      });

      const territorialResultsCollection: ITerritorialClusterResult[] = [];

      territorialMap.forEach((clusterData, territoryIdentifier) => {
        const aggregatedTrustScore = clusterData.weightCount > 0
          ? clusterData.weightedSum / clusterData.weightCount
          : 0.5;

        territorialResultsCollection.push({
          territoryIdentifierLiteral: territoryIdentifier,
          aggregatedTrustScoreNumeric: aggregatedTrustScore,
          totalInteractionQuantity: clusterData.interactionCount,
          communityConsensusIndexNumeric: 1 - (Math.abs(aggregatedTrustScore - 0.5) * 2)
        });
      });

      // REPORTE DE ÉXITO SRE (Uso de 'void' para promesas de telemetría)
      void EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: 'TERRITORIAL_AGGREGATOR',
        operationCode: 'GEOGRAPHIC_AGGREGATION_NOMINAL',
        correlationIdentifier,
        message: 'IMPACT_ANALYTICS.LOGS.TERRITORIAL_SUCCESS',
        contextMetadata: {
          detectedTerritoriesQuantity: territorialResultsCollection.length
        }
      });

      return territorialResultsCollection;
    }
  );
};
