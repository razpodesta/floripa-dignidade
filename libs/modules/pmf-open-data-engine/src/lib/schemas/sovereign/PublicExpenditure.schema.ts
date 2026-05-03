/**
 * @section PMF Engine DNA - Sovereign Expenditure Schema
 * @description Contrato de "Verdad Única" para el gasto público.
 * Define la estructura de egresos con tipado nominal y validación estricta.
 *
 * Protocolo OEDP-V17.0 - High Performance & Data Sovereignty.
 */

import { z } from 'zod';

/**
 * @section IDENTIDADES SOBERANAS (Branded Types)
 * 🛡️ Blindaje de tipos para evitar colisiones en el Data Lake.
 */

export const PublicExpenditureIdentifierSchema = z.string()
  .uuid()
  .brand<'PublicExpenditureIdentifier'>();

/** 🛡️ FIX TS2724: Alineación de nombre nominal */
export type TPublicExpenditureIdentifier = z.infer<typeof PublicExpenditureIdentifierSchema>;

export const TerritorialTechnicalIdentifierSchema = z.string()
  .brand<'TerritorialTechnicalIdentifier'>();

/** 🛡️ FIX TS2305: Alineación con el motor territorial */
export type TTerritorialTechnicalIdentifier = z.infer<typeof TerritorialTechnicalIdentifierSchema>;

export const ProviderCnpjSchema = z.string()
  .regex(/^\d{14}$/, 'CNPJ_INVALIDO_14_DIGITOS')
  .brand<'LegalEntityProviderCnpj'>();

export type TProviderCnpj = z.infer<typeof ProviderCnpjSchema>;

/**
 * @section COMPONENTES ATÓMICOS DEL ADN
 */

/** Clasificación Funcional de Gobierno */
export const FunctionalCategorySchema = z.object({
  functionNameLiteral: z.string().describe('Área de gobierno.'),
  subFunctionNameLiteral: z.string().describe('Especialidad técnica.'),
  programNameLiteral: z.string().describe('Programa institucional.'),
}).readonly();

/** Metadata del Proveedor (Entidad Beneficiaria) */
export const ProviderMetadataSchema = z.object({
  legalNameLiteral: z.string()
    .transform((val) => val.toUpperCase().trim())
    .describe('Razón social purificada.'),
  taxIdentificationNumber: ProviderCnpjSchema,
}).readonly();

/** Rastro Forense y Auditoría */
export const ExpenditureAuditMetadataSchema = z.object({
  sourceSoftwareLiteral: z.string().default('E-PUBLICA'),
  extractionTimestampISO: z.string().datetime(),
  lastAnomalyScoreNumeric: z.number().min(0).max(1).default(0),
}).readonly();

/**
 * @name PublicExpenditureSchema
 * @description Contrato maestro para la persistencia e historización de egresos.
 */
export const PublicExpenditureSchema = z.object({
  expenditureIdentifier: PublicExpenditureIdentifierSchema,

  governmentTechnicalReferenceLiteral: z.string()
    .describe('ID oficial original para trazabilidad legal.'),

  /** Vínculo con el búnker territorial */
  targetTerritoryIdentifier: TerritorialTechnicalIdentifierSchema,

  totalExecutedAmountNumeric: z.number()
    .describe('Monto neto ejecutado tras auditoría.'),

  providerMetadata: ProviderMetadataSchema,
  functionalCategory: FunctionalCategorySchema,

  serviceDescriptionLiteral: z.string().min(5)
    .describe('Detalle técnico para análisis de IA.'),

  auditMetadata: ExpenditureAuditMetadataSchema,

}).readonly();

/** 
 * --- EXPORTACIONES NOMINALES --- 
 */
export type IPublicExpenditure = z.infer<typeof PublicExpenditureSchema>;
export type TFunctionalCategory = z.infer<typeof FunctionalCategorySchema>;
export type TProviderMetadata = z.infer<typeof ProviderMetadataSchema>;