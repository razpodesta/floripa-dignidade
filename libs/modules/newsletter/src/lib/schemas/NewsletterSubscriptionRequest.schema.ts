/**
 * @section Newsletter DNA - Subscription Request Schema
 * @description Define la estructura para la solicitud inicial de suscripción.
 * Soporta múltiples canales de comunicación y validación de identidad.
 *
 * Protocolo OEDP-V13.0 - Identity Sovereignty.
 */

import { z } from 'zod';

/** Canales de comunicación soportados para el proceso de Double Opt-In. */
export const SubscriptionVerificationChannelSchema = z.enum([
  'ELECTRONIC_MAIL',
  'WHATSAPP_MESSAGE',
  'SHORT_MESSAGE_SERVICE' // SMS
]).describe('Canal físico por el cual se enviará el código de confirmación.');

export type ISubscriptionVerificationChannel = z.infer<typeof SubscriptionVerificationChannelSchema>;

/**
 * @name NewsletterSubscriptionRequestSchema
 * @description Aduana de ADN para la solicitud de entrada al ecosistema de noticias.
 */
export const NewsletterSubscriptionRequestSchema = z.object({
  /**
   * Identificador de Comunicación.
   * Puede ser un email o un teléfono en formato E.164.
   */
  communicationIdentifierLiteral: z.string()
    .min(5)
    .describe('Email o número telefónico del ciudadano.'),

  verificationChannelPreference: SubscriptionVerificationChannelSchema,

  preferredLinguisticLocaleIdentifier: z.enum(['pt-BR', 'es-ES', 'en-US'])
    .default('pt-BR'),

  hasGivenPrivacyConsentBoolean: z.literal(true, {
    errorMap: () => ({ message: 'PRIVACY_CONSENT_MANDATORY' })
  }),

}).readonly();

export type INewsletterSubscriptionRequest = z.infer<typeof NewsletterSubscriptionRequestSchema>;
