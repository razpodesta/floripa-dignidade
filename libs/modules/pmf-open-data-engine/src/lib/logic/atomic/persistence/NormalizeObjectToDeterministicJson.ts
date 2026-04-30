/**
 * @section PMF Engine Logic - Deterministic Serialization Atom
 * @description Átomo de lógica pura que transforma un objeto en una cadena JSON
 * con las llaves ordenadas alfabéticamente. Vital para la generación de
 * firmas criptográficas consistentes (Determinismo).
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Pure Logic.
 */

/**
 * Serializa un objeto de forma determinista.
 *
 * @param sourceCollection - Diccionario de datos a normalizar.
 * @returns {string} Cadena JSON normalizada.
 */
export const NormalizeObjectToDeterministicJson = (
  sourceCollection: Record<string, unknown>
): string => {
  /**
   * @section Algoritmo de Ordenamiento Alfabético
   * Extraemos las llaves, las ordenamos y reconstruimos el objeto para que
   * JSON.stringify siempre produzca el mismo rastro binario.
   */
  const sortedKeysCollection = Object.keys(sourceCollection).sort();

  return JSON.stringify(sourceCollection, sortedKeysCollection);
};
