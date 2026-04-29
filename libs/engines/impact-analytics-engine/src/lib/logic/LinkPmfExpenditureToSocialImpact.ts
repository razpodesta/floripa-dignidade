/**
 * @section Impact Analytics - Expenditure to Social Impact Linker
 * @description Orquestador de cruzamiento encargado de vincular la ejecución
 * presupuestaria con los indicadores de impacto. Implementa la Auditoría de Eficiencia Social.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & Boundary Fix.
 * SANEADO Zenith: Desacoplamiento de 'pmf-open-data-engine' y reducción de complejidad.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Internal Logic Contracts) */
import { SocialEfficiencyReportSchema } from '../schemas/SocialEfficiencyReport.schema';
import type { IExpenditureInput } from '../schemas/ExpenditureInput.schema';
import type { ISocialEfficiencyReport } from '../schemas/SocialEfficiencyReport.schema';
import type { ITerritorialImpactReport } from '../schemas/TerritorialImpactReport.schema';

/* 2. Enjambre Atómico de Inteligencia (Responsabilidad Única) */
import { CalculateSocialEfficiencyRatio } from './atomic/CalculateSocialEfficiencyRatio';
import { DetectSpendingAnomaly } from './atomic/DetectSpendingAnomaly';

/** Identificador técnico para el Neural Sentinel. */
const CROSS_LINKER_IDENTIFIER = 'SOCIAL_EFFICIENCY_CROSS_LINKER';

/**
 * Cruza un registro de gasto con el mapa de impacto territorial.
 *
 * @param expenditure - Gasto (Agnóstico a la fuente de datos).
 * @param globalImpactReport - Reporte de impacto generado por el motor.
 * @returns {Promise<ISocialEfficiencyReport>} Reporte de eficiencia validado e inmutable.
 */
export const LinkPmfExpenditureToSocialImpact = async (
  expenditure: IExpenditureInput,
  globalImpactReport: ITerritorialImpactReport,
): Promise<ISocialEfficiencyReport> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    CROSS_LINKER_IDENTIFIER,
    'EXECUTE_SOCIAL_CORRELATION_CROSSING_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        // FASE 1: BÚSQUEDA DE AFINIDAD TERRITORIAL
        const matchingTerritoryCluster = globalImpactReport.territorialClustersCollection.find(
          (cluster) => cluster.territoryIdentifierLiteral === expenditure.targetTerritoryIdentifier,
        );

        const communityTrustScoreNumeric =
          matchingTerritoryCluster?.aggregatedTrustScoreNumeric ?? 0.5;

        // FASE 2: INTELIGENCIA ATÓMICA (Cálculos Puros)
        const efficiencyIndexNumeric = CalculateSocialEfficiencyRatio(
          expenditure.totalExecutedAmountNumeric,
          communityTrustScoreNumeric,
        );

        const isAnomalyDetectedBoolean = DetectSpendingAnomaly(
          expenditure.totalExecutedAmountNumeric,
          communityTrustScoreNumeric,
        );

        // FASE 3: CONSTRUCCIÓN DEL SNAPSHOT FORENSE
        const socialEfficiencySnapshot: ISocialEfficiencyReport = {
          expenditureIdentifier: expenditure.expenditureIdentifier,
          territorialContext: {
            ibgeIdentifier: expenditure.targetTerritoryIdentifier,
            territoryNameLiteral:
              matchingTerritoryCluster?.territoryIdentifierLiteral ?? 'GLOBAL_FLORIPA',
          },
          analysisMetrics: {
            executedAmountNumeric: expenditure.totalExecutedAmountNumeric,
            communityTrustScoreNumeric: communityTrustScoreNumeric,
            efficiencyIndexNumeric,
          },
          anomalyAlertBoolean: isAnomalyDetectedBoolean,
          generationTimestampISO: new Date().toISOString(),
        };

        // 4. ADUANA DE ADN (Validación Final)
        const validationResult = SocialEfficiencyReportSchema.safeParse(socialEfficiencySnapshot);

        if (!validationResult.success) {
          throw new Error('SOCIAL_EFFICIENCY_ADN_CORRUPTION');
        }

        // 5. REPORTE DE SALUD SRE
        void EmitTelemetrySignal({
          severityLevel: isAnomalyDetectedBoolean ? 'WARNING' : 'INFO',
          moduleIdentifier: CROSS_LINKER_IDENTIFIER,
          operationCode: 'SOCIAL_EFFICIENCY_CROSS_LINK_NOMINAL',
          correlationIdentifier,
          message: 'Cruce de eficiencia social completado exitosamente.',
          contextMetadata: {
            efficiencyIndex: efficiencyIndexNumeric,
            isAnomaly: isAnomalyDetectedBoolean,
          },
        });

        return validationResult.data;
      } catch (caughtError: unknown) {
        const errorDescriptionLiteral =
          caughtError instanceof Error ? caughtError.message : String(caughtError);

        throw new InternalSystemException('FALLO_EN_CRUZAMIENTO_DE_DATOS_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          expenditureIdentifierLiteral: expenditure.expenditureIdentifier,
          correlationIdentifier,
        });
      }
    },
  );
};
