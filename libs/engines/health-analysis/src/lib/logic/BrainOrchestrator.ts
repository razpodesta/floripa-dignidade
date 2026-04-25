/**
 * @section Cognitive Logic - Neural Sentinel Brain Orchestrator
 * @description Punto de entrada para la inferencia predictiva y auditoría lógica.
 * Transforma señales de telemetría en directivas de acción delegando a proveedores de IA.
 *
 * Protocolo OEDP-V15.0 - Verbatim Module Syntax & Type Purification.
 * Saneamiento: Resolución de infracción consistent-type-imports y desacoplamiento de esquemas.
 *
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/** 🛡️ SANEAMIENTO Zenith: Importación exclusiva de ADN como tipos */
import type { IInferenceResponse, TAIProvider } from '../schemas/Inference.schema';

/** 🛡️ LÓGICA: Importación de esquemas para validación en tiempo de ejecución */
import { InferenceResponseSchema } from '../schemas/Inference.schema';

import { executeHuggingFaceInference } from '../providers/HuggingFaceInferenceDriver';

const ANALYSIS_ENGINE_IDENTIFIER = 'HEALTH_ANALYSIS_ENGINE';

/**
 * Ejecuta un análisis cognitivo sobre señales de salud orquestando al proveedor seleccionado.
 *
 * @param unvalidatedHealthPayload - Estado del sistema capturado en el snapshot.
 * @param targetAiProvider - Proveedor de IA (OPENAI | ANTHROPIC | HUGGING_FACE | LOCAL_SLM).
 * @returns {Promise<IInferenceResponse>} Directiva de sanación validada y estructurada.
 * @throws {InternalSystemException} Si el modelo falla o retorna un ADN corrupto.
 */
export const AnalyzeSystemHealthInference = async (
  unvalidatedHealthPayload: unknown,
  targetAiProvider: TAIProvider = 'HUGGING_FACE'
): Promise<IInferenceResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    ANALYSIS_ENGINE_IDENTIFIER,
    `COGNITIVE_INFERENCE_REQUEST_${targetAiProvider}`,
    correlationIdentifier,
    async () => {
      try {
        let rawAiResponse: unknown;

        // SELECCIÓN ATÓMICA DE DRIVER
        // En una fase futura, este bloque evolucionará a un 'InferenceProviderRegistry'.
        if (targetAiProvider === 'HUGGING_FACE') {
          rawAiResponse = await executeHuggingFaceInference(unvalidatedHealthPayload);
        } else {
          // Fallback resiliente hacia Hugging Face para otros proveedores no implementados.
          rawAiResponse = await executeHuggingFaceInference(unvalidatedHealthPayload);
        }

        // ADUANA DE ADN: Purificación de la respuesta de la IA
        const validatedInferenceResult = InferenceResponseSchema.parse(rawAiResponse);

        const isConfidenceBelowThresholdBoolean = validatedInferenceResult.confidenceScore < 0.75;

        // REPORTE DE ESTADO COGNITIVO
        EmitTelemetrySignal({
          severityLevel: isConfidenceBelowThresholdBoolean ? 'WARNING' : 'INFO',
          moduleIdentifier: ANALYSIS_ENGINE_IDENTIFIER,
          operationCode: 'INFERENCE_ORCHESTRATION_COMPLETED',
          correlationIdentifier,
          message: `Inferencia finalizada con éxito vía [${targetAiProvider}]`,
          contextMetadata: {
            suggestedActionLiteral: validatedInferenceResult.suggestedAction,
            analysisIdentifierLiteral: validatedInferenceResult.analysisId,
            confidenceScoreNumeric: validatedInferenceResult.confidenceScore,
          },
        });

        return validatedInferenceResult;

      } catch (caughtError) {
        const errorDescriptionLiteral =
          caughtError instanceof Error ? caughtError.message : 'Fallo cognitivo no identificado.';

        EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: ANALYSIS_ENGINE_IDENTIFIER,
          operationCode: 'INFERENCE_ORCHESTRATION_FAILURE',
          correlationIdentifier,
          message: `Colapso crítico en el motor de análisis: ${errorDescriptionLiteral}`,
          contextMetadata: { targetAiProvider, correlationIdentifier },
        });

        throw new InternalSystemException('COLAPSO_COGNITIVO_EN_ORQUESTACION', {
          aiProviderLiteral: targetAiProvider,
          errorTraceLiteral: errorDescriptionLiteral,
        });
      }
    }
  );
};
