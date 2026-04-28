/**
 * @section Impact Analytics DNA - Linguistic Integrity Schema
 * @description Define el contrato para la terminología estadística institucional.
 * Garantiza que conceptos técnicos complejos sean comunicados de forma
 * profesional pero accesible al ciudadano común.
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & Forensic Transparency.
 */

import { z } from 'zod';

/**
 * @name ImpactAnalyticsI18nSchema
 * @description Aduana de ADN para los diccionarios de analítica de impacto.
 */
export const ImpactAnalyticsI18nSchema = z.object({
  metrics: z.object({
    WEIGHTED_TRUST_LABEL: z.string().describe('Título del termómetro de confianza.'),
    CONFIDENCE_LEVEL_LABEL: z.string().describe('Explicación de la fiabilidad del dato.'),
    CONSENSUS_INDEX_LABEL: z.string().describe('Nivel de acuerdo entre diferentes sectores.'),
    PARTICIPATION_VOLUME_LABEL: z.string().describe('Cantidad total de voces capturadas.')
  }),
  trends: z.object({
    RISING_TRUST: z.string(),
    STABLE_CONSENSUS: z.string(),
    DECLINING_TRUST: z.string(),
    VOLATILE_RATING: z.string()
  }),
  explanations: z.object({
    BAYESIAN_METHODOLOGY_HINT: z.string()
      .describe('Breve texto explicando que las voces verificadas tienen mayor peso.'),
    SAMPLE_SIZE_WARNING: z.string()
      .describe('Aviso cuando hay pocos datos para una conclusión definitiva.')
  })
}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IImpactAnalyticsI18n = z.infer<typeof ImpactAnalyticsI18nSchema>;
