import { GlobalBaseException } from './GlobalBaseException.js';

/**
 * Excepción de Fallo Interno del Sistema.
 * Representa errores críticos de nivel de servidor (500) donde la lógica
 * ha fallado de forma inesperada. Esta excepción activa alertas de alta
 * prioridad en el Health Analysis Engine.
 */
export class InternalSystemException extends GlobalBaseException {
  /**
   * Crea una instancia de error de sistema con severidad crítica.
   *
   * @param {string} message - Descripción técnica de la anomalía detectada.
   * @param {Record<string, unknown>} contextMetadata - Datos del entorno para debugging forense.
   */
  public constructor(message: string, contextMetadata: Record<string, unknown> = {}) {
    super(message, 'INTERNAL_SYSTEM_FAILURE', 500, contextMetadata);
  }
}
