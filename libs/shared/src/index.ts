/**
 * @section Shared UI - Package Entry Point
 * @description Centraliza la exportación de utilidades, tokens de diseño,
 * primitivos atómicos y orquestadores de interfaz para todo el ecosistema.
 *
 * Protocolo OEDP-V15.0 - Single Source Resolution & Build Readiness.
 * Saneamiento: Integración de Newsletter Form y Artefactos de Seguridad Universal.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @version 1.4.0
 * Evolución: Inclusión de capacidades de conversión social y blindaje de frontera.
 */
export const GLOBAL_SHARED_UI_VERSION = '1.4.0';

/**
 * @section Infraestructura y Utilidades
 * Herramientas transversales para la gestión de estilos y seguridad.
 */
export { GlobalStyleClassMerger } from './lib/utility/GlobalStyleMerger';
export { GLOBAL_SECURITY_HEADERS_COLLECTION } from './lib/utility/GlobalSecurityHeaders';
export type { ISecurityHeader } from './lib/utility/GlobalSecurityHeaders';

/**
 * @section Sistema de Diseño (DNA Cromático)
 * Tokens inmutables y configuración de temas.
 */
export * from './lib/design-system/schemas/DesignSystem.schema';
export { GlobalThemeConfiguration } from './lib/design-system/index';

/**
 * @section Componentes Atómicos (UI Primitives)
 * Ladrillos visuales con responsabilidad única y accesibilidad ISO.
 */

// 1. ADN de Primitivos (Esquemas)
export * from './lib/ui-primitives/schemas/UiPrimitives.schema';
export * from './lib/ui-primitives/schemas/GlobalSearchWidget.schema';
export * from './lib/ui-primitives/schemas/NewsletterSubscriptionForm.schema';
export * from './lib/ui-primitives/i18n/NewsletterSubscriptionFormI18n.schema';

// 2. Aparatos Visuales
export { GlobalActionButton } from './lib/ui-primitives/GlobalActionButton';
export { GlobalBrandLogo } from './lib/ui-primitives/GlobalBrandLogo';
export { GlobalSearchWidget } from './lib/ui-primitives/GlobalSearchWidget';
export { NewsletterSubscriptionForm } from './lib/ui-primitives/NewsletterSubscriptionForm';

/**
 * @section Orquestadores de Interfaz (Composite UI)
 * Ensambles complejos de alta jerarquía (Organismos).
 */
export * from './lib/composite-ui/schemas/CompositeUi.schema';
export * from './lib/composite-ui/schemas/MainNavigationHeader.schema';
export * from './lib/composite-ui/i18n/MainNavigationHeaderI18n.schema';
export { GlobalMainNavigationHeader } from './lib/composite-ui/MainNavigationHeader';
