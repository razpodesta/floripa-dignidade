/**
 * @section Routing - Global System Constants
 * @description Define la configuración inmutable para el motor de ruteo y localización.
 * Protocolo OEDP-V13.0 - Sovereign Data.
 */

import type { ISupportedLocale } from '../schemas/RoutingConfiguration.schema';

/**
 * Colección oficial de prefijos de idioma soportados por la plataforma.
 * Sincronizado con el Manifiesto de Internacionalización.
 */
export const SUPPORTED_LOCALE_COLLECTION: readonly ISupportedLocale[] = [
  'pt-BR',
  'es-ES',
  'en-US'
];

/** Idioma base para fallbacks y redirecciones de raíz. */
export const DEFAULT_SYSTEM_LOCALE_IDENTIFIER: ISupportedLocale = 'pt-BR';

/**
 * Tiempo de persistencia de la cabecera de trazabilidad en milisegundos.
 * Útil para configuraciones de caché en el Edge.
 */
export const ROUTING_TRACE_TTL_MILLISECONDS = 60000;
