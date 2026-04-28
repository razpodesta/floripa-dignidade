/**
 * @section Messaging DNA - Linguistic Integrity Schema
 * @description Contrato soberano para los diccionarios del búnker de mensajería.
 * Garantiza que todos los estados del buzón, notificaciones y errores técnicos
 * posean una traducción validada para la interfaz del ciudadano y SRE.
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @name MessagingEngineI18nSchema
 * @description Aduana de validación para las almas lingüísticas del dominio de comunicación.
 */
export const MessagingEngineI18nSchema = z.object({
  
  /** Textos para la interfaz visual del ciudadano (UI) */
  interface: z.object({
    emptyInboxTitleLiteral: z.string().describe('Título cuando no hay mensajes o notificaciones.'),
    emptyInboxDescriptionLiteral: z.string().describe('Explicación amigable del estado vacío.'),
    markAllAsReadActionLiteral: z.string().describe('Etiqueta para el botón de marcar todo como leído.'),
    unreadMessagesCountLiteral: z.string().describe('Texto para el contador de notificaciones pendientes.'),
    replyActionLiteral: z.string().describe('Etiqueta para responder un mensaje directo.')
  }),

  /** Mensajes para trazabilidad forense y auditoría (SRE) */
  logs: z.object({
    NOTIFICATION_BROADCAST_SUCCESS: z.string().describe('Confirmación de envío masivo de alerta.'),
    DIRECT_MESSAGE_DISPATCHED: z.string().describe('Confirmación de envío de mensaje privado.'),
    THREAD_ARCHIVED_NOMINAL: z.string().describe('Confirmación de eliminación lógica de un hilo.')
  }),

  /** Errores técnicos y de validación (Client-facing) */
  errors: z.object({
    MAXIMUM_ATTACHMENTS_EXCEEDED: z.string().describe('Error cuando se suben demasiadas evidencias.'),
    MESSAGE_EXCEEDS_MAXIMUM_LENGTH: z.string().describe('Error por mensaje demasiado largo.'),
    UNAUTHORIZED_THREAD_ACCESS: z.string().describe('Error por intento de lectura de buzón ajeno.'),
    MESSAGE_ADN_CORRUPTED: z.string().describe('Fallo estructural en el payload de envío.')
  })

}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IMessagingEngineI18n = z.infer<typeof MessagingEngineI18nSchema>;