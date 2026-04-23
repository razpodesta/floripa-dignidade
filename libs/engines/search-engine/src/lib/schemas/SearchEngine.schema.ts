import { z } from 'zod';
import { UserAccessRoleSchema } from '@floripa-dignidade/identity';

/**
 * @section Discovery DNA - Search & Interlinking
 * Protocolo OEDP-V13.0 - Entity Sovereignty
 */

/**
 * Identificador Nominal para Entidades Buscables.
 * Evita que se confundan IDs de búsqueda con IDs de base de datos crudos.
 */
export const SearchableEntityIdSchema = z.string().uuid().brand<'SearchableEntityId'>();
export type SearchableEntityId = z.infer<typeof SearchableEntityIdSchema>;

/**
 * Esquema de Categorías de Entidad.
 * Define el origen y propósito del dato.
 */
export const EntityCategorySchema = z.enum([
  'INSTITUCIONAL', // Quienes somos, valores, etc.
  'NOTICIA',       // Artículos del blog/prensa.
  'DENUNCIA',      // Casos públicos (respetando RBAC).
  'RECURSO',       // Espacio solidario, descargas, guías.
]).describe('Categoría semántica para filtrado y CSI');

/**
 * @name SearchIndexSchema
 * @description El contrato maestro para cualquier objeto que desee ser "encontrable"
 * o "enlazable" dinámicamente en el portal.
 */
export const SearchIndexSchema = z.object({
  identifier: SearchableEntityIdSchema.describe('ID único inmutable en el índice'),

  title: z.string()
    .min(3)
    .max(150)
    .describe('Título optimizado para el buscador y el SEO'),

  keywords: z.array(z.string())
    .min(1)
    .describe('Términos clave para el sistema CSI (Contextual Interlinking)'),

  contentSnippet: z.string()
    .max(300)
    .describe('Resumen breve para mostrar en los resultados de búsqueda'),

  path: z.string()
    .regex(/^\//)
    .describe('Ruta relativa ISO (debe empezar con /)'),

  requiredAccessRole: UserAccessRoleSchema
    .default('ANONYMOUS_USER')
    .describe('Mínimo nivel de autoridad para ver este resultado (RBAC)'),

  relevanceWeight: z.number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe('Prioridad en los resultados (1.0 es máxima)'),
}).readonly();

/**
 * Interfaces e Inferencias para el Motor
 */
export type ISearchableEntity = z.infer<typeof SearchIndexSchema>;
export type EntityCategory = z.infer<typeof EntityCategorySchema>;

/**
 * Esquema de Respuesta de Búsqueda Purificada.
 * Garantiza que el frontend nunca reciba datos que no deba.
 */
export const SearchResponseSchema = z.array(SearchIndexSchema).readonly();
export type ISearchResponse = z.infer<typeof SearchResponseSchema>;

