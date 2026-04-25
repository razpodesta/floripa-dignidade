/**
 * @section Health Analysis Engine - Package Entry Point
 * @description Centraliza las capacidades de análisis cognitivo, contratos
 * de inferencia y orquestación de inteligencia artificial.
 *
 * Protocolo OEDP-V14.0 - Single Source Resolution.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

export * from './lib/schemas/Inference.schema';
export { AnalyzeSystemHealthInference } from './lib/logic/BrainOrchestrator';
