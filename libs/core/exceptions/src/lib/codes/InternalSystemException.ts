import { GlobalBaseException } from './GlobalBaseException';

/**
 * @section Exception Engine - Specialized Exceptions
 * @description Excepción de Fallo Interno del Sistema (Nivel Servidor / 500).
 * Protocolo OEDP-V13.0 - High Severity Infrastructure Signal.
 */

/**
 * Representa errores críticos imprevistos donde la infraestructura o la lógica central
 * han colapsado. Esta excepción posee la máxima prioridad operativa y activa
 * automáticamente directivas de intervención en el Health Analysis Engine.
 *
 * @extends {GlobalBaseException}
 */
export class InternalSystemException extends GlobalBaseException {
  /**
   * Inicializa una instancia de error de sistema con severidad de colapso (HTTP 500).
   *
   * @param {string} message - Descripción técnica detallada de la anomalía detectada.
   * @param {Record<string, unknown>} contextMetadata - Snapshot forense del entorno al momento del fallo.
   */
  public constructor(message: string, contextMetadata: Record<string, unknown> = {}) {
    /**
     * @constant INTERNAL_SYSTEM_FAILURE - Código semántico inmutable.
     * @constant 500 - Status code de error interno del servidor.
     */
    super(message, 'INTERNAL_SYSTEM_FAILURE', 500, contextMetadata);
  }
}
