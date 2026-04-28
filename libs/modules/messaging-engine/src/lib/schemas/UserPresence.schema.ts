/**
 * @section Messaging DNA - User Presence & Platform Schema
 * @description Define el estado de disponibilidad y el rastro de dispositivos 
 * del ciudadano. Es el contrato base para el ruteo inteligente de notificaciones.
 *
 * Protocolo OEDP-V16.0 - Sovereign Identity & Privacy by Design.
 * Vision: Multi-channel availability awareness.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * Catálogo de Estados de Disponibilidad.
 */
export const AvailabilityStatusSchema = z.enum([
  'ONLINE',            // Usuario interactuando con la interfaz.
  'AWAY',              // Sesión abierta pero sin actividad detectada.
  'DO_NOT_DISTURB',    // Notificaciones Push bloqueadas por el usuario.
  'OFFLINE'            // Desconectado de la red.
]).describe('Estado ontológico de disponibilidad en tiempo real.');

/**
 * Identificador de Plataforma Activa.
 */
export const DevicePlatformSchema = z.enum([
  'WEB_DESKTOP',
  'PWA_MOBILE_ANDROID',
  'PWA_MOBILE_APPLE',
  'NATIVE_TABLET'
]).describe('Hardware desde el cual se originó la última señal de vida.');

/**
 * @name UserPresenceSchema
 * @description ADN de presencia. Se sincroniza vía Heartbeat asíncrono.
 */
export const UserPresenceSchema = z.object({
  /** Referencia a la identidad soberana. */
  citizenIdentifier: z.string().uuid(),

  currentAvailabilityStatus: AvailabilityStatusSchema
    .default('OFFLINE'),

  /** Mensaje de estado definido por el usuario (ej: "En el comité de barrio"). */
  customStatusMessageLiteral: z.string().max(60).optional(),

  lastActivePlatformLiteral: DevicePlatformSchema.optional(),

  /** 
   * Token de Notificación Push.
   * Almacena el ID único del Service Worker o FCM para entrega en segundo plano.
   */
  activePushSubscriptionTokenSecret: z.string().optional()
    .describe('Token criptográfico para el despacho de alertas al dispositivo físico.'),

  /** 
   * Configuración de Privacidad.
   * Permite al ciudadano ocultar su estado 'Last Seen'.
   */
  isPresencePubliclyVisibleBoolean: z.boolean().default(true),

  /** Marca temporal de la última señal de vida (ISO 8601). */
  lastHeartbeatTimestampISO: z.string().datetime(),

}).readonly();

export type IUserPresence = z.infer<typeof UserPresenceSchema>;
export type TAvailabilityStatus = z.infer<typeof AvailabilityStatusSchema>;