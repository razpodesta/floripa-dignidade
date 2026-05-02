/**
 * @section PMF Engine Logic - Sync Metrics Atom
 * @description Átomo de lógica pura encargado de tabular los resultados
 * de una operación de enjambre.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity.
 */

export interface ISyncMetricsResult {
  readonly processedRecordsQuantity: number;
  readonly successfulRecordsQuantity: number;
  readonly failedRecordsQuantity: number;
}

/**
 * Calcula el balance de éxito/fallo de un lote de promesas resueltas.
 *
 * @param resultsCollection - Lista de resultados del procesamiento individual.
 * @returns {ISyncMetricsResult} Objeto de métricas consolidado.
 */
export const CalculateSyncMetrics = (
  resultsCollection: readonly (any | null)[]
): ISyncMetricsResult => {
  const successfulRecordsQuantity = resultsCollection.filter(item => item !== null).length;

  return {
    processedRecordsQuantity: resultsCollection.length,
    successfulRecordsQuantity,
    failedRecordsQuantity: resultsCollection.length - successfulRecordsQuantity
  };
};
