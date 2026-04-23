/**
 * @section Routing DNA - Internationalization & Authority Schema
 * @description Contrato soberano para la gestión de rutas localizadas.
 * Protocolo OEDP-V13.0 - Zero Abbreviations & ISO Standards.
 */

import { z } from 'zod';

/**
 * Esquema de Códigos de Idioma (ISO 639-1 / ISO 3166-1).
 * Define los lenguajes oficiales soportados por la ONG.
 */
export const SupportedLocaleSchema = z.enum(['pt-BR', 'es-ES', 'en-US'])
  .describe('Identificadores de localización estándar admitidos por el sistema.');

export type ISupportedLocale = z.infer<typeof SupportedLocaleSchema>;

/**
 * @name RoutingConfigurationSchema
 * @description ADN para la orquestación del middleware de navegación.
 */
export const RoutingConfigurationSchema = z.object({
  defaultLocale: SupportedLocaleSchema.default('pt-BR'),

  /**
   * Lista de rutas que no requieren internacionalización (ej: /api, /_next).
   */
  excludedPathPatterns: z.array(z.string())
    .describe('Patrones de URL que deben ser ignorados por el orquestador de idiomas.'),

  /**
   * Niveles de acceso requeridos por segmento de ruta.
   */
  routeAuthorityMapping: z.record(z.string(), z.string())
    .describe('Mapeo de rutas a roles de autoridad requeridos (RBAC).')
}).readonly();

export type IRoutingConfiguration = z.infer<typeof RoutingConfigurationSchema>;

