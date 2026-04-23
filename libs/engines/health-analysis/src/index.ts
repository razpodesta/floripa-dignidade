/**
 * 🧠 Health Analysis Engine - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Neural Sentinel Intelligence
 *
 * Este búnker expone las capacidades de análisis cognitivo y los contratos
 * de inferencia de IA para la auto-sanación y detección de anomalías
 * en el ecosistema Floripa Dignidade. Actúa como el centro neural para
 * la toma de decisiones predictivas basadas en señales de telemetría.
 */

/**
 * @section ADN Estructural
 * Exportación de contratos de inferencia, esquemas Zod e interfaces cognitivas.
 */
export * from './lib/schemas/Inference.schema';

/**
 * @section Inteligencia Predictiva
 * Exportación del orquestador atómico para el análisis de salud del sistema.
 */
export { AnalyzeSystemHealthInference } from './lib/logic/BrainOrchestrator';
