/**
 * @section Newsletter DNA - Subscription Schema
 * @description Contrato soberano para la suscripción de ciudadanos al boletín.
 * Protocolo OEDP-V13.0 - Privacy & Data Integrity.
 */

import { z } from 'zod';

export const NewsletterSubscriptionSchema = z.object({
  /** Dirección de correo electrónico purificada. */
  electronicMailAddressLiteral: z.string()
    .email({ message: 'INVALID_EMAIL_FORMAT' })
    .transform((value) => value.toLowerCase().trim())
    .describe('Correo electrónico oficial del ciudadano.'),

  /** Identificador del idioma para segmentación de envíos. */
  preferredLinguisticLocaleIdentifier: z.enum(['pt-BR', 'es-ES', 'en-US'])
    .default('pt-BR'),

  /** Validación de consentimiento (LGPD Compliance). */
  hasGivenPrivacyConsentBoolean: z.literal(true, {
    errorMap: () => ({ message: 'CONSENT_REQUIRED' })
  }).describe('Indica si el ciudadano aceptó los términos de privacidad.'),

  /** Metadatos de procedencia para el Neural Sentinel. */
  acquisitionSourceIdentifier: z.string().default('PORTAL_FOOTER'),

}).readonly();

export type INewsletterSubscription = z.infer<typeof NewsletterSubscriptionSchema>;
