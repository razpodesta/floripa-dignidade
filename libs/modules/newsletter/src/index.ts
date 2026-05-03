/**
 * @section Newsletter Module - Sovereign Package Entry Point (Barrel)
 * @description Único punto de exportación autorizado para el búnker de Newsletter.
 * Orquestra la visibilidad de esquemas, lógica de activación Double Opt-In
 * e infraestructura de internacionalización lingüística.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & Verbatim Module Syntax.
 * SANEADO Zenith: Exportación nominal de IActivationResult (Fix TS2305).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

/**
 * @version 1.1.1
 * Estatus: Nivelación Zenith completada. Grafo de visibilidad sanado para
 * consumidores externos.
 */
export const MODULE_NEWSLETTER_VERSION = '1.1.1';

/**
 * @section Capa 1: ADN Estructural (Schemas & Types)
 * @description Exportación de contratos inmutables para la validación de suscripciones.
 */
export * from './lib/schemas/NewsletterSubscription.schema';
export * from './lib/schemas/NewsletterSubscriptionRequest.schema';

/**
 * 🛡️ SANEADO Zenith: Exportación de ADN de Resultado (Fix TS2305).
 * Permite que las aplicaciones finales (Portal Ciudadano) puedan tipar
 * correctamente sus lógicas de redirección basadas en el éxito de activación.
 */
export type { IActivationResult } from './lib/logic/atomic/ActivateCloudSubscription';

/**
 * @section Capa 2: Almas Lingüísticas (Internationalization)
 * @description Esquemas de traducción para auditoría de diccionarios JSON.
 */
export * from './lib/i18n/NewsletterI18n.schema';

/**
 * @section Capa 3: Motores de Lógica y Orquestación (Atomic Swarm)
 * @description Funciones puras y orquestadores para el ciclo de vida del ciudadano.
 */

/** Orquestador de entrada: Valida, persiste y dispara el flujo de verificación. */
export { ProcessNewsletterSubscriptionRequest } from './lib/logic/atomic/ProcessNewsletterSubscriptionRequest';

/** Orquestador de éxito: Transiciona el estado en la nube y activa la soberanía. */
export { ActivateCloudSubscription } from './lib/logic/atomic/ActivateCloudSubscription';

/**
 * Aparato de validación lógica de tokens (Compatibilidad).
 * Se recomienda el uso de 'ActivateCloudSubscription' para operaciones Cloud-Sovereign.
 */
export { ConfirmNewsletterSubscription } from './lib/logic/atomic/ConfirmNewsletterSubscription';
