/**
 * @section Exception Engine - Specialized Infrastructure Exceptions
 * @description Excepción de Fallo Interno del Sistema (Nivel Servidor / HTTP 500).
 * Actúa como la señal de máxima prioridad operativa, activando automáticamente
 * los protocolos de intervención en el Health Analysis Engine.
 *
 * Protocolo OEDP-V13.0 - High Severity Infrastructure Signal & Explicit Accessibility.
 * Saneamiento: Alineación con el estándar de visibilidad de miembros de clase.
 *
 * @author Raz  Podestá - MetaShark Tech
 */

import { GlobalBaseException } from './GlobalBaseException';

/**
 * @class InternalSystemException
 * @extends {GlobalBaseException}
 * @description Representa errores críticos imprevistos donde la infraestructura
 * o la lógica central han colapsado.
 */
export class InternalSystemException extends GlobalBaseException {
  /**
   * Inicializa una instancia de error de sistema con severidad de colapso técnica.
   *
   * @param messageLiteral - Descripción técnica detallada de la anomalía detectada.
   * @param forensicContextSnapshot - Colección de variables para la reconstrucción del fallo.
   */
  public constructor(
    messageLiteral: string,
    forensicContextSnapshot: Record<string, unknown> = {}
  ) {
    /**
     * @constant INTERNAL_SYSTEM_FAILURE - Código semántico inmutable (ISO Standard).
     * @constant 500 - Status code de error interno del servidor (PII Protection Level).
     */
    super(
      messageLiteral,
      'INTERNAL_SYSTEM_FAILURE',
      500,
      forensicContextSnapshot
    );
  }
}
