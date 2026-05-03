/**
 * @section Territorial DNA - Normalized Internal Schema
 * @description Define la estructura soberana de las entidades geográficas.
 * Transforma datos crudos (IBGE) en nodos de identidad con alta precisión técnica.
 * 
 * Protocolo OEDP-V17.0 - ISO Standard Naming & Branded Identity.
 */

import { z } from 'zod';

/**
 * @section IDENTIDADES SOBERANAS (Branded Types)
 * 🛡️ Blindaje Técnico: Evita que identificadores territoriales se confundan
 * con otros UUIDs o strings genéricos en el Data Lake.
 */
export const TerritorialTechnicalIdentifierSchema = z.string()
  .describe('Identificador técnico único (IBGE Standard) con sello de soberanía.')
  .brand<'TerritorialTechnicalIdentifier'>();

/** 🛡️ FIX TS2305: Exportación nominal para integración con pmf-open-data-engine */
export type TTerritorialTechnicalIdentifier = z.infer<typeof TerritorialTechnicalIdentifierSchema>;

/**
 * @section COMPONENTES ATÓMICOS
 */

/** Jerarquía Administrativa del Territorio */
export const AdministrativeHierarchySchema = z.enum([
  'MUNICIPALITY', 
  'DISTRICT', 
  'NEIGHBORHOOD'
]).describe('Nivel de jurisdicción administrativa del nodo.');

export type TAdministrativeHierarchy = z.infer<typeof AdministrativeHierarchySchema>;

/** Coordenadas Geográficas de Precisión (Swiss-Watch Standard) */
export const GeographicCoordinatesSchema = z.object({
  latitudeNumeric: z.number()
    .min(-90).max(90)
    .describe('Latitud decimal para el centroide territorial.'),
  longitudeNumeric: z.number()
    .min(-180).max(180)
    .describe('Longitud decimal para el centroide territorial.'),
}).readonly();

export type TGeographicCoordinates = z.infer<typeof GeographicCoordinatesSchema>;

/**
 * @name TerritorialEntitySchema
 * @description Contrato maestro para la gestión de búnkeres geográficos.
 */
export const TerritorialEntitySchema = z.object({
  
  /** 🛡️ Identidad Brindada: ID técnico del IBGE (Sovereign String) */
  territorialTechnicalIdentifier: TerritorialTechnicalIdentifierSchema,

  /** Nombre oficial purificado (Upper Case, Sin Abreviaturas) */
  officialTerritoryNameLiteral: z.string()
    .min(2, 'NOMBRE_TERRITORIAL_INVALIDO')
    .transform((val) => val.toUpperCase().trim()),

  /** Clasificación jerárquica */
  administrativeHierarchyLevel: AdministrativeHierarchySchema,

  /** Centroide para Mapas de Calor e Impacto Analytics */
  geographicCentroidMetadata: GeographicCoordinatesSchema.optional(),

  /** Fecha de la última validación de soberanía contra el IBGE */
  lastSovereignSyncTimestampISO: z.string().datetime(),

}).readonly();

/** 
 * --- EXPORTACIONES NOMINALES --- 
 * Integración total con el ecosistema Floripa Dignidade.
 */
export type ITerritorialEntity = z.infer<typeof TerritorialEntitySchema>;