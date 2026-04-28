/**
 * @section Impact Analytics DNA - Popular Acceptance Indicator Schema
 * @description Define el contrato soberano para las métricas de impacto social.
 * Estructura los datos estadísticos procesados por el motor de analítica,
 * incluyendo intervalos de confianza y niveles de consenso ciudadano.
 *
 * Protocolo OEDP-V16.0 - High Performance & Forensic Statistical Accuracy.
 * Vision: Data-Driven Social Reliability (SRE).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section Tipado Nominal (Branded Types)
 */
export const IndicatorIdentifierSchema = z.string().uuid().brand<'ImpactIndicatorIdentifier'>();
export type ImpactIndicatorIdentifier = z.infer<typeof IndicatorIdentifierSchema>;

/**
 * Tendencia estadística detectada en el periodo actual.
 */
export const AcceptanceTrendSchema = z.enum([
  'RISING_TRUST',    // Incremento de credibilidad popular.
  'STABLE_CONSENSUS', // Estabilidad en la percepción civil.
  'DECLINING_TRUST', // Degradación de la confianza popular.
  'VOLATILE_RATING'   // Fluctuaciones extremas (posible conflicto social).
]).describe('Dirección vectorial del sentimiento popular.');

/**
 * @name PopularAcceptanceIndicatorSchema
 * @description Contrato maestro para la representación del "Termómetro Popular".
 */
export const PopularAcceptanceIndicatorSchema = z.object({
  /** Identificador único del indicador generado. */
  indicatorIdentifier: IndicatorIdentifierSchema,

  /** Referencia a la entidad analizada (Noticia, Institución, Denuncia). */
  targetEntityIdentifier: z.string().uuid(),

  /**
   * PUNTUACIÓN BAYESIANA PONDERADA (0.0 - 1.0)
   * Resultado final tras aplicar los pesos de autoridad de los ciudadanos.
   */
  weightedTrustScoreNumeric: z.number().min(0).max(1)
    .describe('Promedio ponderado de confianza calculado por el algoritmo de Bayes.'),

  /**
   * INTERVALO DE CONFIANZA (Certidumbre Estadística)
   * 1.0 = Certeza matemática total.
   * 0.0 = Datos insuficientes o contradictorios.
   */
  statisticalConfidenceLevelNumeric: z.number().min(0).max(1)
    .describe('Grado de fiabilidad del indicador basado en el volumen y calidad de la muestra.'),

  /** Volumen total de participaciones (Pulsos de interacción). */
  totalParticipantQuantity: z.number().int().nonnegative(),

  /** Desglose por niveles de autoridad (Transparencia SRE). */
  authorityLevelDistributionMetadata: z.object({
    verifiedCitizensQuantity: z.number().int().nonnegative(),
    anonymousInteractionsQuantity: z.number().int().nonnegative(),
    technicalAuditorsQuantity: z.number().int().nonnegative(),
  }).describe('Distribución de la muestra según el rango de autoridad de los evaluadores.'),

  /** Tendencia temporal del indicador. */
  currentAcceptanceTrend: AcceptanceTrendSchema,

  /**
   * Índice de Consenso (Polarización).
   * 1.0 = Unanimidad popular.
   * 0.0 = Polarización absoluta (50% apoyo / 50% rechazo).
   */
  communityConsensusIndexNumeric: z.number().min(0).max(1),

  /** Marca temporal de la última agregación de datos (ISO 8601). */
  lastAggregationTimestampISO: z.string().datetime(),

}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IPopularAcceptanceIndicator = z.infer<typeof PopularAcceptanceIndicatorSchema>;
