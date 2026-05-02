/**
 * @section Routing - Global System Constants
 * @description Define la configuración inmutable para el motor de ruteo y localización.
 * Implementa aserción de tipos nominales (Branded Types) para compatibilidad con Zod.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & Pure Types.
 * SANEADO Zenith: Inyección de aserciones explícitas para resolver TS2322.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type { ISupportedLocale } from '../schemas/RoutingConfiguration.schema';

/**
 * Colección oficial de prefijos de idioma soportados por la plataforma.
 * Sincronizado con el Manifiesto de Internacionalización.
 *
 * 🛡️ SANEADO: Uso de 'as ISupportedLocale' para satisfacer el contrato de
 * Branded Types ('SupportedLocale') de Zod sin perder rendimiento en runtime.
 */
export const SUPPORTED_LOCALE_COLLECTION: readonly ISupportedLocale[] =[
  'pt-BR' as ISupportedLocale,
  'es-ES' as ISupportedLocale,
  'en-US' as ISupportedLocale
];

/**
 * Idioma base para fallbacks y redirecciones de raíz.
 */
export const DEFAULT_SYSTEM_LOCALE_IDENTIFIER: ISupportedLocale = 'pt-BR' as ISupportedLocale;

/**
 * Tiempo de persistencia de la cabecera de trazabilidad en milisegundos.
 * Útil para configuraciones de caché en el Edge.
 */
export const ROUTING_TRACE_TTL_MILLISECONDS = 60000;
