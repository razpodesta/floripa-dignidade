/**
 * @section Observatory Logic - Metrics Calculator Atom
 * @description Función pura encargada de procesar la colección de gastos para
 * generar los indicadores del dashboard.
 */

import type { IPublicExpenditure } from '@floripa-dignidade/pmf-open-data-engine';

interface IObservatoryMetricsResult {
  readonly totalAuditedAmountNumeric: number;
  readonly anomalyCountQuantity: number;
}

export const CalculateObservatoryMetrics = (
  expenditureCollection: IPublicExpenditure[]
): IObservatoryMetricsResult => {
  return {
    totalAuditedAmountNumeric: expenditureCollection.reduce(
      (accumulator, item) => accumulator + item.totalExecutedAmountNumeric,
      0
    ),
    /**
     * @section Inferencia de Anomalías
     * Se considera anomalía cualquier score de IA superior a 0.7
     */
    anomalyCountQuantity: expenditureCollection.filter(
      (item) => item.auditMetadata.lastAnomalyScoreNumeric > 0.7
    ).length
  };
};
