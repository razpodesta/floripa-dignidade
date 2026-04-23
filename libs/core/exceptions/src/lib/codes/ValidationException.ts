import { GlobalBaseException } from './GlobalBaseException';

/**
 * @section Exception Engine - Specialized Exceptions
 * @description Excepción de Fallo de Integridad de Datos (Nivel Cliente / 400).
 * Protocolo OEDP-V13.0 - Data Sovereignty Enforcement.
 */

/**
 * Se dispara cuando los datos de entrada o payloads de comunicación no cumplen con
 * los contratos de ADN (Zod Schemas) establecidos en la frontera de un aparato.
 *
 * Indica que la solicitud es semánticamente incorrecta y previene la propagación
 * de datos corruptos hacia la lógica de negocio o persistencia.
 *
 * @extends {GlobalBaseException}
 */
export class ValidationException extends GlobalBaseException {
  /**
   * Inicializa un error de validación con estatus de solicitud incorrecta (HTTP 400).
   *
   * @param {string} message - Descripción del fallo de integridad o contrato detectado.
   * @param {Record<string, unknown>} contextMetadata - Snapshot de los campos o reglas que fallaron.
   */
  public constructor(message: string, contextMetadata: Record<string, unknown> = {}) {
    /**
     * @constant VALIDATION_FAILED - Código semántico inmutable para fallos de esquema.
     * @constant 400 - Status code de solicitud incorrecta (Bad Request).
     */
    super(message, 'VALIDATION_FAILED', 400, contextMetadata);
  }
}
