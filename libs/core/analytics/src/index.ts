/**
 * @section Core Analytics - Package Entry Point
 * @description Centraliza la exportación de capacidades para la captura de eventos
 * de comportamiento y métricas de rendimiento (Web Vitals).
 *
 * Protocolo OEDP-V14.0 - Single Source Resolution.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

export const CORE_ANALYTICS_VERSION = '1.3.1';

export * from './lib/schemas/AnalyticsEvent.schema';
export { CaptureAnalyticsEvent } from './lib/captureAnalyticsEvent';
export * from './lib/i18n/AnalyticsI18n.schema';
