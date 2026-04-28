/**
 * @section Reputation Engine - Public Evaluation Pulse Schema
 * @description Define el contrato inmutable para los eventos de evaluación ciudadana.
 * Implementa el estándar ISO 20488 para la integridad de reseñas y juicios de valor.
 * Permite la captura de datos cuantitativos (puntuación) y cualitativos (comentarios).
 *
 * Protocolo OEDP-V16.0 - High Performance & ISO Technical Naming.
 * Vision: Multidimensional Trust Engine for Social Accountability.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section Tipado Nominal (Branded Types)
 * SANEADO: Nomenclatura verbosa según standard-naming-iso.md.
 */
export const EvaluatedEntityIdentifierSchema = z.string().uuid().brand<'EvaluatedEntityIdentifier'>();
export type EvaluatedEntityIdentifier = z.infer<typeof EvaluatedEntityIdentifierSchema>;

/**
 * Categorías oficiales sujetas a evaluación por la comunidad.
 */
export const EvaluatedEntityTypeSchema = z.enum([
  'CITIZEN_IDENTITY',           // Evaluación de conducta/credibilidad de un usuario.
  'INSTITUTIONAL_ORGANIZATION', // Evaluación de transparencia de una ONG o Ente.
  'NEWS_ARTICLE_CONTENT',       // Validación de veracidad de una noticia.
  'HUMAN_RIGHTS_REPORT'         // Validación de la existencia de un hecho denunciado.
]).describe('Categoría técnica de la entidad que recibe la evaluación pública.');

/**
 * @name PublicEvaluationPulseSchema
 * @description Contrato maestro de una interacción de auditoría popular.
 */
export const PublicEvaluationPulseSchema = z.object({
  /** Identificador único de la transacción de evaluación. */
  evaluationTransactionIdentifier: z.string().uuid(),

  /** Identificador físico de la entidad (Noticia, ONG, Usuario) que es evaluada. */
  targetEntityIdentifier: EvaluatedEntityIdentifierSchema,

  /** Tipo de entidad para el triaje del motor de estadísticas. */
  targetEntityType: EvaluatedEntityTypeSchema,

  /** Identificador anonimizado del ciudadano que emite la evaluación. */
  evaluatorIdentityIdentifier: z.string().uuid(),

  /**
   * EVALUACIÓN CUANTITATIVA (Puntuación de Confianza)
   * Rango: 0.0 (Falsedad/Desconfianza) a 1.0 (Verdad/Confianza Absoluta).
   */
  quantitativeTrustScoreNumeric: z.number().min(0).max(1)
    .describe('Valor numérico que representa el grado de credibilidad otorgado.'),

  /**
   * EVALUACIÓN CUALITATIVA (Comentario de Soporte)
   * Permite al ciudadano argumentar su evaluación.
   */
  qualitativeCommentaryLiteral: z.string()
    .min(10, { message: 'COMMENTARY_TOO_SHORT' })
    .max(1000, { message: 'COMMENTARY_EXCEEDS_MAXIMUM_LENGTH' })
    .transform((value) => value.trim())
    .describe('Argumentación textual o testimonio que fundamenta la puntuación.'),

  /**
   * Indicador de Evidencia Física.
   * Determina si el ciudadano adjuntó pruebas que respaldan su comentario.
   */
  hasSupportingEvidenceBoolean: z.boolean().default(false),

  /**
   * Contexto Territorial (Barrio/Distrito).
   * Vital para el búnker de analítica de impacto geográfico.
   */
  territorialContextLiteral: z.string().optional()
    .describe('Ubicación física relacionada con la evaluación (ej: "Bairro Tapera").'),

  /**
   * Metadatos para el Statistics Engine (Impact Analytics).
   * Almacena pesos de ponderación o flags de moderación previa.
   */
  metadata: z.record(z.string(), z.unknown()).optional(),

}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IPublicEvaluationPulse = z.infer<typeof PublicEvaluationPulseSchema>;
