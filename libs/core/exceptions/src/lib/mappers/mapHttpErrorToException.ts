/**
 * @section Exception Mappers - Protocol ISO Standard
 * @description Transforma estados HTTP en excepciones semánticas tipadas.
 *
 * Protocolo OEDP-V14.0 - Functional Atomicity.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import type { GlobalBaseException } from '../codes/GlobalBaseException';
import { InternalSystemException } from '../codes/InternalSystemException';
import { ValidationException } from '../codes/ValidationException';

/**
 * Convierte un código de estado HTTP y un mensaje en una instancia de excepción.
 *
 * @param httpStatusCode - Código de estado de la respuesta.
 * @param exceptionMessage - Descripción de la anomalía.
 * @param forensicContextSnapshot - Datos adicionales para auditoría.
 * @returns Instancia especializada derivada de GlobalBaseException.
 */
export const mapHttpErrorToException = (
  httpStatusCode: number,
  exceptionMessage: string,
  forensicContextSnapshot: Record<string, unknown> = {}
): GlobalBaseException => {
  if (httpStatusCode >= 400 && httpStatusCode < 500) {
    return new ValidationException(exceptionMessage, forensicContextSnapshot);
  }

  return new InternalSystemException(exceptionMessage, forensicContextSnapshot);
};
