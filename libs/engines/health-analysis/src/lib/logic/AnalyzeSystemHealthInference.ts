/**
 * @section Cognitive Logic - System Health Inference Orchestrator
 * @description Punto de entrada soberano para la auditoría cognitiva.
 * Transforma telemetría en directivas de acción mediante el enjambre de IA.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & ISO Technical Naming.
 * SANEADO Zenith: Atomización de fábrica y soberanía lingüística (ADR 0006).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';
import { InferenceResponseSchema } from '../schemas/Inference.schema';
import { DetermineIntelligenceDriver } from './IntelligenceProviderFactory';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import type { IInferenceResponse, TAIProvider } from '../schemas/Inference.schema';

/** Identificador técnico del motor para el Neural Sentinel. */
const COGNITIVE_ENGINE_IDENTIFIER = 'HEALTH_ANALYSIS_COGNITIVE_ENGINE';

/**
 * Ejecuta un análisis cognitivo sobre señales de salud orquestando al proveedor.
 *
 * @param unvalidatedHealthPayloadSnapshot - Estado del sistema capturado para análisis.
 * @param targetAiProviderLiteral - Proveedor de inteligencia (Default: HUGGING_FACE).
 * @returns {Promise<IInferenceResponse>} Directiva de sanación validada y purificada.
 * @throws {InternalSystemException} Si la inferencia falla o viola el contrato de ADN.
 */
export const AnalyzeSystemHealthInference = async (
  unvalidatedHealthPayloadSnapshot: unknown,
  targetAiProviderLiteral: TAIProvider = 'HUGGING_FACE'
): Promise<IInferenceResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    COGNITIVE_ENGINE_IDENTIFIER,
    `COGNITIVE_INFERENCE_ORCHESTRATION_${targetAiProviderLiteral}`,
    correlationIdentifier,
    async () => {
      try {
        // 1. RESOLUCIÓN DE DRIVER (Delegación Atómica)
        const executeInferenceAction = DetermineIntelligenceDriver(targetAiProviderLiteral);

        // 2. EJECUCIÓN DE INFERENCIA
        const unvalidatedIntelligenceResponse = await executeInferenceAction(
          unvalidatedHealthPayloadSnapshot
        );

        // 3. ADUANA DE ADN (Safe Parsing)
        const validationResult = InferenceResponseSchema.safeParse(unvalidatedIntelligenceResponse);

        if (!validationResult.success) {
          throw new Error('INTELLIGENCE_ADN_CORRUPTION_DETECTED');
        }

        const validatedInferenceResult = validationResult.data;
        const isConfidenceWarningRequiredBoolean = validatedInferenceResult.confidenceScore < 0.75;

        // 4. REPORTE DE ESTADO COGNITIVO (Telemetry Sync)
        EmitTelemetrySignal({
          severityLevel: isConfidenceWarningRequiredBoolean ? 'WARNING' : 'INFO',
          moduleIdentifier: COGNITIVE_ENGINE_IDENTIFIER,
          operationCode: 'INFERENCE_SUCCESSFULLY_ORCHESTRATED',
          correlationIdentifier,
          /** Uso de clave soberana para internacionalización de logs técnicos */
          message: 'HEALTH_ANALYSIS.LOGS.INFERENCE_NOMINAL',
          contextMetadata: {
            analysisId: validatedInferenceResult.analysisId,
            suggestedActionLiteral: validatedInferenceResult.suggestedAction,
            confidenceScoreNumeric: validatedInferenceResult.confidenceScore,
            providerLiteral: targetAiProviderLiteral
          },
        });

        return validatedInferenceResult;

      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE COLAPSO (Resilience Layer)
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: COGNITIVE_ENGINE_IDENTIFIER,
          operationCode: 'COGNITIVE_ORCHESTRATION_COLAPSE',
          correlationIdentifier,
          message: 'HEALTH_ANALYSIS.ERRORS.ORCHESTRATION_FAULT',
          contextMetadata: {
            errorTraceLiteral: errorDescriptionLiteral,
            providerLiteral: targetAiProviderLiteral
          },
        });

        throw new InternalSystemException('FALLO_EN_ORQUESTACION_COGNITIVA', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
