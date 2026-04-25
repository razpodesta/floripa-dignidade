/**
 * @section Telemetry DNA - Linguistic Integrity Schema
 * @description Define el contrato soberano para los diccionarios de telemetría.
 * Garantiza que cada señal emitida por el sistema nervioso central posea
 * una representación textual válida para auditoría y logs semánticos.
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @name TelemetryI18nSchema
 * @description Aduana de validación para las almas lingüísticas del búnker de telemetría.
 * Implementa inmutabilidad absoluta mediante .readonly().
 */
export const TelemetryI18nSchema = z.object({
  /**
   * Colección de señales de flujo de ejecución.
   */
  signals: z.object({
    START_PROCESS: z.string()
      .describe('Mensaje técnico emitido al inicio de una operación atómica.'),

    END_PROCESS: z.string()
      .describe('Mensaje de confirmación tras la finalización exitosa de un proceso.'),

    LATENCY_REPORT: z.string()
      .describe('Texto descriptivo que acompaña al reporte de microsegundos de ejecución.'),
  }),
}).readonly();

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 * Interfaz inmutable inferida del esquema soberano para uso en el enjambre.
 */
export type ITelemetryI18n = z.infer<typeof TelemetryI18nSchema>;
