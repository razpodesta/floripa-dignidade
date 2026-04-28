/**
 * @section Shared UI - Package Entry Point
 * @description Centraliza y orquesta la exposición de utilidades técnicas, 
 * tokens de diseño, primitivos atómicos, ensambles complejos y la 
 * infraestructura de estado global para todo el ecosistema.
 *
 * Protocolo OEDP-V16.0 - Single Source Resolution & Universal Integration.
 * SANEADO Zenith: Inyección del búnker de Estado Soberano y Resiliencia de Sesión.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @version 1.5.0
 * Evolución: Implementación de la Capa de Persistencia y Gestión de Memoria Volátil.
 */
export const GLOBAL_SHARED_UI_VERSION = '1.5.0';

/**
 * @section Capa 1: Infraestructura y Utilidades Transversales
 * @description Herramientas de bajo nivel para la fusión de estilos y 
 * gobernanza de seguridad en cabeceras HTTP.
 */
export { GlobalStyleClassMerger } from './lib/utility/GlobalStyleMerger';
export { GLOBAL_SECURITY_HEADERS_COLLECTION } from './lib/utility/GlobalSecurityHeaders';
export type { ISecurityHeader } from './lib/utility/GlobalSecurityHeaders';

/**
 * 🛡️ NUEVO: Búnker de Estado Global (Persistencia & Resiliencia)
 * @description Gestión de memoria enjambre (Zustand). Controla la UI volátil, 
 * la identidad bayesiana y la sincronización SRE (Offline/Online).
 */
export * from './lib/utility/state-store';

/**
 * @section Capa 2: Sistema de Diseño (Visual DNA)
 * @description Tokens inmutables y contratos cromáticos que rigen la 
 * identidad visual de la ONG Floripa Dignidade.
 */
export * from './lib/design-system/schemas/DesignSystem.schema';
export { GlobalThemeConfiguration } from './lib/design-system/index';

/**
 * @section Capa 3: Componentes Atómicos (UI Primitives)
 * @description Ladrillos visuales básicos con responsabilidad única, 
 * accesibilidad ISO/IEC 40500 y telemetría integrada.
 */
export * from './lib/ui-primitives/schemas/UiPrimitives.schema';
export * from './lib/ui-primitives/schemas/GlobalSearchWidget.schema';
export * from './lib/ui-primitives/schemas/NewsletterSubscriptionForm.schema';
export * from './lib/ui-primitives/i18n/NewsletterSubscriptionFormI18n.schema';

export { GlobalActionButton } from './lib/ui-primitives/GlobalActionButton';
export { GlobalBrandLogo } from './lib/ui-primitives/GlobalBrandLogo';
export { GlobalSearchWidget } from './lib/ui-primitives/GlobalSearchWidget';
export { NewsletterSubscriptionForm } from './lib/ui-primitives/NewsletterSubscriptionForm';

/**
 * @section Capa 4: Orquestadores de Interfaz (Composite UI)
 * @description Ensambles complejos de alta jerarquía (Organismos) que 
 * coordinan múltiples primitivos y lógica de negocio local.
 */
export * from './lib/composite-ui/schemas/CompositeUi.schema';
export * from './lib/composite-ui/schemas/MainNavigationHeader.schema';
export * from './lib/composite-ui/i18n/MainNavigationHeaderI18n.schema';
export { GlobalMainNavigationHeader } from './lib/composite-ui/MainNavigationHeader';