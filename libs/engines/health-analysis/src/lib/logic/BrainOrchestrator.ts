/**
 * @section Cognitive Logic - Neural Sentinel Brain Orchestrator
 * @description Punto de entrada para la inferencia predictiva y auditoría lógica.
 * Transforma señales de telemetría en directivas de acción delegando a proveedores de IA.
 *
 * Protocolo OEDP-V17.0 - Verbatim Module Syntax & Swarm Intelligence.
 * SANEADO Zenith: Consolidación de orquestador único, purga de redundancias,
 * resolución de promesas flotantes y validación atómica del ADN cognitivo.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/** 🛡️ SANEAMIENTO Zenith: Importación exclusiva de ADN como tipos */
import type { IInferenceResponse, TAIProvider } from '../schemas/Inference.schema';
import { InferenceResponseSchema } from '../schemas/Inference.schema';

/* 🛡️ SANEAMIENTO Zenith: Uso del Factory Pattern para desacoplar implementaciones */
import { DetermineIntelligenceDriver } from './IntelligenceProviderFactory';

/** Identificador técnico del motor para el Neural Sentinel. */
const ANALYSIS_ENGINE_IDENTIFIER = 'HEALTH_ANALYSIS_ENGINE';

/**
 * @section Átomo Interno: Aduana de ADN Cognitivo
 * @description Aísla la responsabilidad de validar la estructura devuelta por la IA externa.
 * Protege al ecosistema de "Alucinaciones" o cambios de formato de API.
 */
const validateCognitiveAdn = (
  rawAiPayload: unknown,
  correlationIdentifier: string
): IInferenceResponse => {
  const validationResult = InferenceResponseSchema.safeParse(rawAiPayload);

  if (!validationResult.success) {
    // Reporte inmediato de alucinación o cambio de contrato por parte de la IA
    void EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: ANALYSIS_ENGINE_IDENTIFIER,
      operationCode: 'AI_HALLUCINATION_OR_ADN_CORRUPTION',
      correlationIdentifier,
      message: 'HEALTH_ANALYSIS.ERRORS.AI_CONTRACT_VIOLATION',
      contextMetadata: {
        structuralIssuesCollection: validationResult.error.flatten(),
        rawAiResponseSnapshot: rawAiPayload,
      },
    });

    throw new InternalSystemException('ALUCINACION_O_ADN_COGNITIVO_CORRUPTO', {
      validationIssues: validationResult.error.flatten(),
    });
  }

  return validationResult.data;
};

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
        // 1. RESOLUCIÓN DE DRIVER (Delegación Atómica al Factory)
        const executeInferenceAction = DetermineIntelligenceDriver(targetAiProvider);

        // 2. EJECUCIÓN DE INFERENCIA (I/O Red Externa)
        const unvalidatedIntelligenceResponse = await executeInferenceAction(
          unvalidatedHealthPayload
        );

        // 3. ADUANA DE ADN (Delegación a Átomo Interno para SRP)
        const validatedInferenceResult = validateCognitiveAdn(
          unvalidatedIntelligenceResponse,
          correlationIdentifier
        );

        const isConfidenceBelowThresholdBoolean = validatedInferenceResult.confidenceScore < 0.75;

        // 4. REPORTE DE ESTADO COGNITIVO
        void EmitTelemetrySignal({
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
      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE COLAPSO (Resilience Layer)

        // Si la excepción ya fue generada y tipada por la Aduana Interna, se propaga intacta.
        if (caughtError instanceof InternalSystemException) {
          throw caughtError;
        }

        const errorDescriptionLiteral =
          caughtError instanceof Error ? caughtError.message : 'Fallo cognitivo no identificado.';

        void EmitTelemetrySignal({
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
