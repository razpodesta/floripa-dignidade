import { z } from 'zod';

/**
 * @section Aduana de ADN - Inteligencia Artificial
 */

/**
 * Esquema de Proveedores de IA.
 * Define el ecosistema multi-modelo soportado por el motor de análisis.
 * - OPENAI/ANTHROPIC: Tier superior para razonamiento complejo.
 * - HUGGING_FACE: Tier privado para análisis de datos sensibles.
 * - LOCAL_SLM: Modelos de lenguaje pequeños para ejecución en el Edge.
 */
export const AIProviderSchema = z.enum(['OPENAI', 'ANTHROPIC', 'HUGGING_FACE', 'LOCAL_SLM'])
  .describe('Ecosistema de proveedores de inferencia cognitiva');

/**
 * Esquema Soberano de Respuesta de Inferencia.
 * Define el contrato inmutable que transforma datos técnicos en sabiduría operativa.
 */
export const InferenceResponseSchema = z.object({
  analysisId: z.string().uuid()
    .describe('Identificador único forense de la inferencia'),

  confidenceScore: z.number().min(0).max(1)
    .describe('Nivel de certeza del modelo sobre el análisis realizado (0.0 a 1.0)'),

  observation: z.string()
    .describe('Razonamiento lógico detallado generado por la IA'),

  suggestedAction: z.enum(['NONE', 'RESTART_MODULE', 'CACHE_PURGE', 'CODE_REFACTOR_REQUIRED'])
    .describe('Directiva de sanación recomendada para el ecosistema'),

  detectedAnomalies: z.array(z.string())
    .describe('Lista de patrones de falla o desviaciones lógicas detectadas'),

  metadata: z.record(z.string(), z.unknown())
    .describe('Metadatos técnicos del modelo (tokens usados, versión del modelo, etc.)')
}).readonly();

/**
 * Interfaz inmutable de la respuesta cognitiva.
 */
export type IInferenceResponse = z.infer<typeof InferenceResponseSchema>;
