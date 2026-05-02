/**
 * @section Telemetry Logic - Runtime Environment Detector
 * @description Átomo encargado de identificar si la ejecución ocurre en el
 * servidor (Node.js/Edge) o en el cliente (Browser).
 * 🛡️ SANEADO Zenith: Evita el error TS2304 al no referenciar 'window' directamente.
 *
 * Protocolo OEDP-V17.0 - Isomorphic Integrity & Pure Logic.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * Evalúa el contexto global para determinar el tipo de runtime.
 * Utiliza 'globalThis' como puente soberano para evitar colisiones de tipos.
 *
 * @returns {boolean} Verdadero si el entorno es Servidor (Node/Edge/Deno).
 */
export const DetermineServerRuntime = (): boolean => {
  /**
   * En entornos de servidor, 'window' no existe en el objeto global de JS.
   * Al consultar vía globalThis, TypeScript no lanza excepciones de referencia.
   */
  const isWindowAbsentBoolean = typeof globalThis !== 'undefined' && !('window' in globalThis);

  return isWindowAbsentBoolean;
};
