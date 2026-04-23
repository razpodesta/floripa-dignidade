import { GlobalBaseException } from '../codes/GlobalBaseException';
import { InternalSystemException } from '../codes/InternalSystemException';
import { ValidationException } from '../codes/ValidationException';

/**
 * @section Exception Mappers - Protocolo OEDP-V13.0
 * @description Orquestador de Frontera Atómica para la conversión de errores de red.
 */

/**
 * Transforma códigos de estado HTTP crudos en excepciones soberanas del ecosistema.
 * Actúa como una aduana de errores entre las respuestas de red y la lógica interna,
 * garantizando que cada fallo preserve su ADN (Runtime Context Snapshot) para la
 * auditoría forense del Neural Sentinel.
 *
 * @param {number} httpStatusCode - Código de estado HTTP nativo recibido.
 * @param {string} exceptionMessage - Descripción semántica de la anomalía detectada.
 * @param {Record<string, unknown>} forensicContextSnapshot - Estado de la memoria al fallar.
 * @returns {GlobalBaseException} Instancia especializada (Validation o InternalSystem).
 */
export const mapHttpErrorToException = (
  httpStatusCode: number,
  exceptionMessage: string,
  forensicContextSnapshot: Record<string, unknown> = {},
): GlobalBaseException => {
  /**
   * Rango 4xx: Errores semánticos, de identidad o integridad de datos.
   * Se mapean a ValidationException para indicar una falla en el lado del cliente
   * o en el contrato de la solicitud.
   */
  if (httpStatusCode >= 400 && httpStatusCode < 500) {
    return new ValidationException(exceptionMessage, forensicContextSnapshot);
  }

  /**
   * Rango 5xx o estados atípicos: Colapso de infraestructura o lógica de servidor.
   * Se mapean a InternalSystemException para activar protocolos de recuperación
   * de alta prioridad en el Health Analysis Engine.
   */
  return new InternalSystemException(exceptionMessage, forensicContextSnapshot);
};
