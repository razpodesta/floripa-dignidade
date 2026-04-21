import { GlobalBaseException } from './GlobalBaseException.js';

/**
 * Excepción de Fallo de Validación.
 * Se dispara cuando los datos de entrada no cumplen con los contratos de ADN (Zod).
 * Corresponde a un error de cliente (400) e indica que el payload es semánticamente incorrecto.
 */
export class ValidationException extends GlobalBaseException {
  /**
   * Inicializa un error de validación con el código de estado correspondiente.
   *
   * @param {string} message - Descripción del fallo de integridad o contrato detectado.
   * @param {Record<string, unknown>} contextMetadata - Snapshot de los campos que fallaron.
   */
  public constructor(message: string, contextMetadata: Record<string, unknown> = {}) {
    super(message, 'VALIDATION_FAILED', 400, contextMetadata);
  }
}
