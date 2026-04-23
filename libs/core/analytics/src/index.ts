/**
 * 📈 Core Analytics - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Performance & Behavior Tracking
 *
 * Este búnker centraliza la exportación de capacidades para la captura de eventos
 * de usuario y métricas de Core Web Vitals (LCP, INP, CLS).
 *
 * @author Staff Software Engineer - Floripa Dignidade
 */

/**
 * @section Trazabilidad Operativa
 * Versión de la interfaz pública del búnker.
 */
export const CORE_ANALYTICS_VERSION = '1.3.1';

/**
 * @section ADN Estructural (Sovereign Contracts)
 * Exportación de esquemas Zod e interfaces para la validación de eventos analíticos.
 */
export * from './lib/schemas/AnalyticsEvent.schema';

/**
 * @section Lógica Atómica (Apparatus)
 * Exportación de la lógica de captura purificada y no bloqueante.
 * Sincronizado con el estándar de nomenclatura PascalCase para Aparatos Atómicos.
 */
export { CaptureAnalyticsEvent } from './lib/captureAnalyticsEvent';

/**
 * @section Aduana Lingüística (i18n)
 * Exportación del esquema de traducciones para el Dictionary Builder.
 */
export * from './lib/i18n/AnalyticsI18n.schema';
