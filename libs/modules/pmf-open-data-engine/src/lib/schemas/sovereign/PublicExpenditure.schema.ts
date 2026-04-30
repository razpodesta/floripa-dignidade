/**
 * @section PMF Engine DNA - Sovereign Expenditure Schema
 * @description Define el contrato de "Verdad Única" para el gasto público procesado.
 * Homogeniza los datos crudos de la Prefeitura en una estructura plana y eficiente.
 *
 * Protocolo OEDP-V17.0 - High Performance & Data Sovereignty.
 * SANEADO Zenith: Inyección de Branded Type para Identificadores Territoriales.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section Tipado Nominal (Branded Types)
 */
export const ExpenditureIdentifierSchema = z.string()
  .describe('Identificador unívoco generado por el enjambre de Floripa Dignidade.')
  .brand<'PublicExpenditureIdentifier'>();

export type ExpenditureIdentifier = z.infer<typeof ExpenditureIdentifierSchema>;

/** 🛡️ SANEADO Zenith: Vinculación Semántica con el motor territorial */
export const TerritorialTechnicalIdentifierSchema = z.string()
  .describe('Código técnico del distrito o barrio según el estándar IBGE.')
  .brand<'TerritorialTechnicalIdentifier'>();

export type TerritorialTechnicalIdentifier = z.infer<typeof TerritorialTechnicalIdentifierSchema>;

export const ProviderCnpjSchema = z.string()
  .regex(/^\d{14}$/, { message: 'INVALID_CNPJ_FORMAT' })
  .describe('Identificación fiscal pura (14 dígitos) para cruce de transparencia.')
  .brand<'LegalEntityProviderCnpj'>();

export type ProviderCnpj = z.infer<typeof ProviderCnpjSchema>;

/**
 * @name PublicExpenditureSchema
 * @description Contrato maestro para la persistencia e historización de egresos públicos.
 */
export const PublicExpenditureSchema = z.object({
  expenditureIdentifier: ExpenditureIdentifierSchema,

  governmentTechnicalReferenceLiteral: z.string()
    .describe('ID oficial original (Empenho/Contrato) para trazabilidad legal.'),

  /** 🛡️ SANEADO: Uso de tipo nominal para evitar errores de ruteo geográfico */
  targetTerritoryIdentifier: TerritorialTechnicalIdentifierSchema,

  totalExecutedAmountNumeric: z.number()
    .describe('Monto financiero neto ejecutado tras auditar créditos y débitos.'),

  providerMetadata: z.object({
    legalNameLiteral: z.string()
      .transform((value) => value.toUpperCase().trim())
      .describe('Razón social purificada de la entidad beneficiaria.'),
    taxIdentificationNumber: ProviderCnpjSchema,
  }).readonly(),

  functionalCategory: z.object({
    functionNameLiteral: z.string().describe('Área de gobierno (ej: Saúde).'),
    subFunctionNameLiteral: z.string().describe('Especialidad (ej: Vigilância Sanitária).'),
    programNameLiteral: z.string().describe('Nombre del programa institucional.'),
  }).readonly(),

  serviceDescriptionLiteral: z.string().min(5)
    .describe('Detalle técnico del servicio o adquisición para análisis de IA.'),

  auditMetadata: z.object({
    sourceSoftwareLiteral: z.string().default('E-PUBLICA'),
    extractionTimestampISO: z.string().datetime(),
    lastAnomalyScoreNumeric: z.number().min(0).max(1).default(0),
  }).readonly(),

}).readonly();

/** 🛡️ ADN Tipado: Interfaz homogenizada para el consumo universal. */
export type IPublicExpenditure = z.infer<typeof PublicExpenditureSchema>;
