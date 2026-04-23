/**
 * 🏛️ Shared UI Bunker - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Atomic Visual Consistency & Unified Access
 *
 * Este es el orquestador maestro de la capa visual de Floripa Dignidade.
 * Centraliza utilidades de estilo, tokens de diseño, primitivos atómicos
 * y ensambles compuestos para todo el ecosistema.
 *
 * @author Staff Software Engineer - Floripa Dignidade
 */

/**
 * @section Trazabilidad Operativa
 * Elevación a versión Zenith de integración visual.
 */
export const GLOBAL_SHARED_UI_VERSION = '1.3.0';

/**
 * @section 0. Utilidades de Infraestructura Visual
 * Herramientas base para la gestión de estilos y lógica de renderizado.
 */
export { GlobalStyleClassMerger } from './lib/utility/GlobalStyleMerger';

/**
 * @section 1. Design System DNA
 * Tokens inmutables, paleta cromática y escalas tipográficas ISO.
 */
export * from './lib/design-system/schemas/DesignSystem.schema';
export { GlobalThemeConfiguration } from './lib/design-system/index';

/**
 * @section 2. UI Primitives (Ladrillos Atómicos)
 * Componentes de bajo nivel y sus contratos estructurales de ADN.
 */
// ADN Primitivo
export * from './lib/ui-primitives/schemas/UiPrimitives.schema';
export * from './lib/ui-primitives/schemas/GlobalSearchWidget.schema';

// Aparatos Primitivos
export { GlobalActionButton } from './lib/ui-primitives/GlobalActionButton';
export { GlobalBrandLogo } from './lib/ui-primitives/GlobalBrandLogo';
export { GlobalSearchWidget } from './lib/ui-primitives/GlobalSearchWidget';

/**
 * @section 3. Composite UI (Ensambles / Organismos)
 * Orquestadores de alto nivel que integran lógica, i18n y primitivos.
 */
// ADN Compuesto e i18n
export * from './lib/composite-ui/schemas/CompositeUi.schema';
export * from './lib/composite-ui/schemas/MainNavigationHeader.schema';
export * from './lib/composite-ui/i18n/MainNavigationHeaderI18n.schema';

// Aparatos Compuestos
export { GlobalMainNavigationHeader } from './lib/composite-ui/MainNavigationHeader';
