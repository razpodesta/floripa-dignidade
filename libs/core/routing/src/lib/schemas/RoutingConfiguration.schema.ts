/**
 * @section Routing DNA - Internationalization & Authority Governance Schema
 * @description Define el contrato de integridad absoluto para la gestión de rutas 
 * localizadas y el control de acceso perimetral. Actúa como la Única Fuente de Verdad (SSOT) 
 * para el enjambre de ruteo, garantizando que solo los idiomas autorizados y 
 * patrones de URL seguros sean procesados por el motor de Next.js 16+.
 * 
 * Protocolo OEDP-V17.0 - Sovereign Data & ISO Standard Naming.
 * SANEADO Zenith: Purga de Cronología (Next.js 16+ Ready) e inyección de Branded Types.
 * 
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section Tipado Nominal (Branded Types)
 * @description Protege los identificadores de localización de colisiones semánticas.
 * Los idiomas deben seguir el estándar ISO 639-1 / ISO 3166-1.
 */
export const SupportedLocaleSchema = z.enum(['pt-BR', 'es-ES', 'en-US'])
  .describe('Identificadores de localización estándar admitidos por el ecosistema Floripa Dignidade.')
  .brand<'SupportedLocale'>();

/** 🛡️ ADN Tipado: Interfaz nominal inmutable para el enjambre. */
export type ISupportedLocale = z.infer<typeof SupportedLocaleSchema>;

/**
 * @name RoutingConfigurationSchema
 * @description Aduana de ADN para la orquestación del middleware de navegación y localización.
 * Implementa inmutabilidad forzada para prevenir mutaciones en el ciclo de vida del Edge.
 */
export const RoutingConfigurationSchema = z.object({
  /**
   * Idioma base de la plataforma.
   * Utilizado como fallback absoluto cuando el rastro del dispositivo es ilegible.
   */
  defaultLocale: SupportedLocaleSchema.default('pt-BR' as ISupportedLocale),

  /**
   * Colección de Patrones Excluidos.
   * Lista de prefijos de ruta que no deben ser interceptados por el motor de i18n
   * (ej: /api, /_next, /brand, /monitoring).
   */
  excludedPathPatternsCollection: z.array(z.string())
    .describe('Patrones de URL que deben ser ignorados por el orquestador de idiomas para optimizar performance.'),

  /**
   * Mapa de Autoridad de Rutas (RBAC).
   * Vincula segmentos de URL con el nivel de autoridad institucional requerido
   * para su visualización.
   */
  routeAuthorityMapping: z.record(z.string(), z.string())
    .describe('Diccionario que asocia rutas protegidas con roles de autoridad requeridos (Identity Sync).'),

}).readonly();

/** 🛡️ ADN Tipado: Contrato de configuración global de ruteo. */
export type IRoutingConfiguration = z.infer<typeof RoutingConfigurationSchema>;