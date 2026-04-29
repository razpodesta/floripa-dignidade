/**
 * @section PMF Engine DNA - Sovereign Expenditure Schema
 * @description Define el contrato de "Verdad Única" para el gasto público procesado.
 * Homogeniza los datos crudos de la Prefeitura en una estructura plana, altamente
 * eficiente para el análisis estadístico y el cruzamiento con el motor territorial.
 * Actúa como el puente de datos para el motor de analítica de impacto social.
 *
 * Protocolo OEDP-V17.0 - High Performance & Data Sovereignty.
 * Vision: Software Agnostic Forensic Data Layer.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section Tipado Nominal (Branded Types)
 * @description Garantiza la integridad de las llaves primarias y evita colisiones
 * lógicas entre identificadores de diferentes orígenes.
 */
export const ExpenditureIdentifierSchema = z.string()
  .describe('Identificador unívoco generado por el enjambre de Floripa Dignidade.')
  .brand<'PublicExpenditureIdentifier'>();

/** 🛡️ ADN Tipado: ID único de gasto soberano. */
export type ExpenditureIdentifier = z.infer<typeof ExpenditureIdentifierSchema>;

export const ProviderCnpjSchema = z.string()
  .regex(/^\d{14}$/, { message: 'INVALID_CNPJ_FORMAT' })
  .describe('Identificación fiscal pura (14 dígitos) para cruce de transparencia.')
  .brand<'LegalEntityProviderCnpj'>();

/** 🛡️ ADN Tipado: CNPJ normalizado del proveedor. */
export type ProviderCnpj = z.infer<typeof ProviderCnpjSchema>;

/**
 * @name PublicExpenditureSchema
 * @description Contrato maestro para la persistencia e historización de egresos públicos.
 * Implementa inmutabilidad absoluta para garantizar la cadena de custodia de la información.
 */
export const PublicExpenditureSchema = z.object({
  /** Identificador técnico inalterable en nuestro Data Lake. */
  expenditureIdentifier: ExpenditureIdentifierSchema,

  /** Referencia física al número de empenho o proceso oficial de la municipalidad. */
  governmentTechnicalReferenceLiteral: z.string()
    .describe('ID oficial original (Empenho/Contrato) para trazabilidad legal.'),

  /**
   * Vínculo Territorial (IBGE Integration).
   * Debe coincidir con un 'territorialTechnicalIdentifier' válido del territorial-engine.
   */
  targetTerritoryIdentifier: z.string()
    .describe('Código técnico del distrito o barrio según el estándar IBGE.'),

  /**
   * Higiene Financiera.
   * Valor final calculado por el átomo de precisión matemática.
   */
  totalExecutedAmountNumeric: z.number()
    .describe('Monto financiero neto ejecutado tras auditar créditos y débitos.'),

  /** Identidad Legal del Proveedor (Audit Ready). */
  providerMetadata: z.object({
    legalNameLiteral: z.string()
      .transform((value) => value.toUpperCase().trim())
      .describe('Razón social purificada de la entidad beneficiaria.'),
    taxIdentificationNumber: ProviderCnpjSchema,
  }),

  /** Clasificación Presupuestaria de Impacto. */
  functionalCategory: z.object({
    functionNameLiteral: z.string().describe('Área de gobierno (ej: Saúde).'),
    subFunctionNameLiteral: z.string().describe('Especialidad (ej: Vigilância Sanitária).'),
    programNameLiteral: z.string().describe('Nombre del programa institucional.'),
  }),

  /** Descripción semántica del objeto contractual. */
  serviceDescriptionLiteral: z.string().min(5)
    .describe('Detalle técnico del servicio o adquisición para análisis de IA.'),

  /** Trazabilidad de Auditoría SRE. */
  auditMetadata: z.object({
    sourceSoftwareLiteral: z.string().default('E-PUBLICA'),
    extractionTimestampISO: z.string().datetime(),
    /** Coeficiente de sospecha generado por el Neural Sentinel (0 a 1). */
    lastAnomalyScoreNumeric: z.number().min(0).max(1).default(0),
  }),

}).readonly();

/** 🛡️ ADN Tipado: Interfaz homogenizada para el consumo universal. */
export type IPublicExpenditure = z.infer<typeof PublicExpenditureSchema>;
