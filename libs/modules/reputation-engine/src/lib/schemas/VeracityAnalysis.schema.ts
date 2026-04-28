/**
 * @section Reputation DNA - Veracity Analysis Schema
 * @description Define el contrato de salida para la auditoría cognitiva de comentarios.
 * Permite al sistema clasificar la calidad ética y la veracidad de un testimonio.
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & AI Insights.
 */

import { z } from 'zod';

/**
 * @name VeracityAnalysisSchema
 * @description Esquema de resultados del escaneo cognitivo.
 */
export const VeracityAnalysisSchema = z.object({
  /** Coeficiente de Veracidad (0.0 a 1.0). Determinado por la IA. */
  veracityConfidenceScoreNumeric: z.number().min(0).max(1),

  /** Flags semánticas de comportamiento. */
  semanticFlagsCollection: z.array(z.enum([
    'HATE_SPEECH_DETECTED',
    'SPAM_BOT_PATTERN',
    'LOGICAL_INCONSISTENCY',
    'SARCASM_DETECTED',
    'OBJECTIVE_TESTIMONY'
  ])),

  /** Sugerencia de moderación automática. */
  moderationActionSuggestion: z.enum(['APPROVE', 'FLAG_FOR_REVIEW', 'REJECT']),

  /** Justificación técnica de la IA (Anonimizada). */
  inferenceReasoningLiteral: z.string(),

}).readonly();

export type IVeracityAnalysis = z.infer<typeof VeracityAnalysisSchema>;
