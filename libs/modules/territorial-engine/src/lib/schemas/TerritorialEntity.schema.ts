/**
 * @section Territorial DNA - Normalized Internal Schema
 * @description Transforma los datos del IBGE en una estructura soberana optimizada
 * para el Reputation Engine y el Impact Analytics.
 *
 * Protocolo OEDP-V16.0 - ISO Standard Naming & Data Sovereignty.
 */

import { z } from 'zod';

export const TerritorialEntitySchema = z.object({
  /** ID técnico del IBGE (convertido a string para consistencia). */
  territorialTechnicalIdentifier: z.string(),

  /** Nombre oficial purificado (Sin abreviaciones, Upper Case). */
  officialTerritoryNameLiteral: z.string(),

  /** Jerarquía administrativa. */
  administrativeHierarchyLevel: z.enum(['MUNICIPALITY', 'DISTRICT', 'NEIGHBORHOOD']),

  /** Atributos para el Mapa de Calor Popular. */
  geographicCentroidMetadata: z.object({
    latitudeNumeric: z.number().optional(),
    longitudeNumeric: z.number().optional()
  }).optional(),

  /** Fecha de la última sincronización con el IBGE. */
  lastSovereignSyncTimestampISO: z.string().datetime(),

}).readonly();

export type ITerritorialEntity = z.infer<typeof TerritorialEntitySchema>;
