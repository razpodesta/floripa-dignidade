/**
 * @section Newsletter Module - Package Entry Point
 * @description Centraliza las capacidades de gestión de suscripciones, validación
 * de identidad (Double Opt-In) y orquestación de comunicaciones institucionales
 * integradas con persistencia en la nube (Supabase).
 *
 * Protocolo OEDP-V15.0 - Single Source Resolution & Cloud Native.
 * Saneamiento: Registro de átomos de activación y persistencia Zenith.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @version 1.1.0
 * Identificador de versión para telemetría y auditoría de dependencias.
 */
export const MODULE_NEWSLETTER_VERSION = '1.1.0';

/**
 * @section ADN Estructural
 * Exportación de esquemas de validación Zod para contratos de datos.
 */
export * from './lib/schemas/NewsletterSubscription.schema';
export * from './lib/schemas/NewsletterSubscriptionRequest.schema';

/**
 * @section Lógica de Negocio (Aparatos Atómicos)
 * Orquestadores funcionales para el ciclo de vida del ciudadano suscriptor.
 */

/** Orquestador de entrada: Valida, persiste y dispara el correo de confirmación. */
export { ProcessNewsletterSubscriptionRequest } from './lib/logic/atomic/ProcessNewsletterSubscriptionRequest';

/** Orquestador de éxito: Valida el token contra la nube y activa la suscripción. */
export { ActivateCloudSubscription } from './lib/logic/atomic/ActivateCloudSubscription';

/**
 * Aparato de validación lógica de tokens (Legacy Support).
 * Se recomienda migrar a 'ActivateCloudSubscription' para flujos Cloud-Native.
 */
export { ConfirmNewsletterSubscription } from './lib/logic/atomic/ConfirmNewsletterSubscription';

/**
 * @section Almas Lingüísticas (i18n)
 * El esquema del diccionario es exportado para que el 'i18n-builder' pueda
 * validar la integridad de los JSONs durante el pre-build.
 */
export * from './lib/i18n/NewsletterI18n.schema';
