/**
 * @section Impact Analytics - Comprehensive Report Orchestrator
 * @description Motor superior que ensambla la analítica bayesiana global y
 * el desglose territorial. Actúa como la "Mente" del búnker estadístico.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Integración total de átomos funcionales. Responsabilidad Única.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN del Dominio */
import { TerritorialImpactReportSchema } from '../schemas/TerritorialImpactReport.schema';
import type { ITerritorialImpactReport } from '../schemas/TerritorialImpactReport.schema';
import type { IPopularAcceptanceIndicator } from '../schemas/PopularAcceptanceIndicator.schema';

/* 2. ADN de Reputación (Entrada de Datos) */
import type { IPublicEvaluationPulse } from '@floripa-dignidade/reputation-engine';

/* 3. Enjambre de Átomos Matemáticos y Geográficos */
import { AggregateBayesianImpactMetrics } from './AggregateBayesianImpactMetrics';
import { AggregateTerritorialSentiment } from './atomic/AggregateTerritorialSentiment';

/** Identificador técnico del orquestador. */
const IMPACT_ORCHESTRATOR_IDENTIFIER = 'IMPACT_ANALYTICS_REPORT_ENGINE';

/**
 * Genera un reporte de impacto multidimensional basado en pulsos civiles.
 *
 * @param targetEntityIdentifier - UUID de la entidad bajo auditoría.
 * @param evaluationPulsesCollection - Universo de datos capturado por el Reputation Engine.
 * @returns {Promise<{ globalIndicator: IPopularAcceptanceIndicator, territorialReport: ITerritorialImpactReport }>}
 */
export const GenerateImpactAnalyticsReport = async (
  targetEntityIdentifier: string,
  evaluationPulsesCollection: IPublicEvaluationPulse[]
): Promise<{
  readonly globalIndicator: IPopularAcceptanceIndicator;
  readonly territorialReport: ITerritorialImpactReport;
}> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    IMPACT_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_FULL_ANALYTICS_PIPELINE',
    correlationIdentifier,
    async () => {
      try {

        /**
         * FASE 1: Análisis Bayesiano Global (Reputación Ponderada)
         * Determina el score oficial neutralizando el ruido de bots.
         */
        const globalIndicator = await AggregateBayesianImpactMetrics(
          targetEntityIdentifier,
          evaluationPulsesCollection
        );

        /**
         * FASE 2: Desglose Territorial (Geolocalización del Sentimiento)
         * Agrupa y pondera los datos por distritos de Florianópolis.
         */
        const rawTerritorialClusters = await AggregateTerritorialSentiment(
          evaluationPulsesCollection,
          correlationIdentifier
        );

        // FASE 3: Validación de ADN del Reporte Territorial
        const territorialReport = TerritorialImpactReportSchema.parse({
          targetEntityIdentifier,
          territorialClustersCollection: rawTerritorialClusters,
          generationTimestampISO: new Date().toISOString()
        });

        return { globalIndicator, territorialReport };

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw new InternalSystemException('FALLO_CRITICO_EN_GENERACION_DE_REPORTE_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          targetEntityIdentifier,
          correlationIdentifier
        });
      }
    }
  );
};
