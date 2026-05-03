/**
 * @section PMF Engine Logic - Sync Metrics Atom
 * @description Átomo de lógica pura encargado de tabular la soberanía operativa
 * de un enjambre de procesos. Genera métricas de éxito y fallo para el Neural Sentinel.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & High Performance.
 */

/**
 * ADN de los resultados de sincronización.
 */
export interface ISyncMetricsResult {
  readonly processedRecordsQuantity: number;
  readonly successfulRecordsQuantity: number;
  readonly failedRecordsQuantity: number;
  readonly successRatePercentage: number; // Nueva métrica de impacto
}

/**
 * Calcula el balance de éxito/fallo de una colección de resultados.
 * ⚡ OPTIMIZACIÓN: Algoritmo de paso único (O(n)) sin asignación de arrays intermedios.
 * 
 * @param resultsCollection - Lista de rastros de ejecución (T o rastro nulo).
 * @returns {ISyncMetricsResult} Consolidado métrico de la operación.
 */
export const CalculateSyncMetrics = <T>(
  resultsCollection: readonly (T | null | undefined)[]
): ISyncMetricsResult => {
  const processedRecordsQuantity = resultsCollection.length;
  
  // 1. CÁLCULO DE ÉXITO (Soberanía de paso único)
  let successfulRecordsQuantity = 0;

  for (let i = 0; i < processedRecordsQuantity; i++) {
    const item = resultsCollection[i];
    if (item !== null && item !== undefined) {
      successfulRecordsQuantity++;
    }
  }

  const failedRecordsQuantity = processedRecordsQuantity - successfulRecordsQuantity;
  
  // 2. INFERENCIA DE IMPACTO
  const successRatePercentage = processedRecordsQuantity > 0 
    ? (successfulRecordsQuantity / processedRecordsQuantity) * 100 
    : 0;

  return {
    processedRecordsQuantity,
    successfulRecordsQuantity,
    failedRecordsQuantity,
    successRatePercentage: Number(successRatePercentage.toFixed(2))
  };
};