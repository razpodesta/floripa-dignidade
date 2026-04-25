/**
 * @section WhatsApp DNA - Linguistic Integrity Schema
 * @description Define el contrato soberano para las almas lingüísticas del búnker
 * de WhatsApp. Garantiza consistencia en logs semánticos y respuestas automáticas.
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @name WhatsAppCommunicationI18nSchema
 * @description Aduana de validación para los diccionarios de comunicación.
 */
export const WhatsAppCommunicationI18nSchema = z.object({
  logs: z.object({
    TRIAGE_SEQUENCE_STARTED: z.string()
      .describe('Señal emitida al recibir un paquete de datos de Meta.'),

    CLASSIFYING_SIGNAL_TYPE: z.string()
      .describe('Mensaje de trazabilidad durante la identificación del medio (Text/Image/etc).'),

    UNKNOWN_SIGNAL_TYPE_IGNORED: z.string()
      .describe('Alerta cuando se recibe un evento no soportado por la ONG.'),
  }),
  errors: z.object({
    CORRUPT_WEBHOOK_PAYLOAD: z.string()
      .describe('Error semántico cuando el JSON de Meta no cumple el esquema.'),
  })
}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IWhatsAppCommunicationI18n = z.infer<typeof WhatsAppCommunicationI18nSchema>;
