/**
 * @section Reputation Logic - Evaluation Veracity Analyzer
 * @description Átomo de inteligencia encargado de la auditoría de veracidad
 * cualitativa. Orquesta la comunicación con el Neural Sentinel para detectar
 * sesgos o falsedades en los testimonios ciudadanos.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Resolución TS2307 (Corrección de alias del motor),
 * atomización de la aduana de fallback y purga de variables flotantes (void).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { InternalSystemException } from '@floripa-dignidade/exceptions';
/** 🛡️ SANEADO Zenith: Corrección de alias del paquete (health-analysis -> health-analysis-engine) */
import { AnalyzeSystemHealthInference } from '@floripa-dignidade/health-analysis-engine';
import { EmitTelemetrySignal, TraceExecutionTime } from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import { VeracityAnalysisSchema } from '../../schemas/VeracityAnalysis.schema';
import type { IVeracityAnalysis } from '../../schemas/VeracityAnalysis.schema';

/** Identificador técnico para el Neural Sentinel. */
const VERACITY_ANALYZER_IDENTIFIER = 'REPUTATION_VERACITY_ANALYZER';

/**
 * @section Átomo Interno: Aduana de Fallback Resiliente
 * @description Separa la lógica de validación Zod y el manejo de contingencias
 * (cuando la IA alucina o el formato cambia) del orquestador principal.
 */
const validateCognitiveOutputAndHandleFallback = (
  unvalidatedAuditOutput: unknown,
  correlationIdentifier: string
): IVeracityAnalysis => {
  const veracityValidationResult = VeracityAnalysisSchema.safeParse(unvalidatedAuditOutput);

  if (!veracityValidationResult.success) {
    /** Fallback resiliente: Si la IA falla, marcamos para revisión humana. */
    void EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: VERACITY_ANALYZER_IDENTIFIER,
      operationCode: 'COGNITIVE_ADN_INCONSISTENCY',
      correlationIdentifier,
      message: 'REPUTATION.LOGS.ANOMALY_DETECTED',
      contextMetadata: {
        fallbackTriggered: true,
        structuralIssuesCollection: veracityValidationResult.error.flatten()
      }
    });

    return {
      veracityConfidenceScoreNumeric: 0.5,
      semanticFlagsCollection:['LOGICAL_INCONSISTENCY'],
      moderationActionSuggestion: 'FLAG_FOR_REVIEW',
      inferenceReasoningLiteral: 'Auditoría automática inconsistente; requiere triaje humano.'
    };
  }

  return veracityValidationResult.data;
};

/**
 * Ejecuta una auditoría cognitiva sobre el contenido textual de una evaluación.
 *
 * @param qualitativeCommentaryLiteral - El texto argumentativo del ciudadano.
 * @param correlationIdentifier - Identificador de trazabilidad del flujo de origen.
 * @returns {Promise<IVeracityAnalysis>} Resultado de la auditoría validado por Zod.
 * @throws {InternalSystemException} Si el enjambre de IA no responde.
 */
export const AnalyzeEvaluationVeracity = async (
  qualitativeCommentaryLiteral: string,
  correlationIdentifier: string,
): Promise<IVeracityAnalysis> => {

  return await TraceExecutionTime(
    VERACITY_ANALYZER_IDENTIFIER,
    'EXECUTE_COGNITIVE_VERACITY_AUDIT',
    correlationIdentifier,
    async () => {
      try {
        /**
         * @section Inferencia de Inteligencia (Swarm Sync)
         * Se utiliza el motor de análisis de salud como proveedor de inferencia
         * para asegurar la soberanía del dato (ADR 0015).
         */
        const intelligencePayloadSnapshot = {
          targetTextToAudit: qualitativeCommentaryLiteral,
          auditTaskIdentifier: 'VERACITY_AND_ETHICS_SCAN'
        };

        const rawInferenceResponse = await AnalyzeSystemHealthInference(
          intelligencePayloadSnapshot,
          'HUGGING_FACE'
        );

        // 1. ADUANA DE ADN (Delegación Atómica)
        const validatedVeracityResult = validateCognitiveOutputAndHandleFallback(
          rawInferenceResponse.metadata['veracityAuditOutput'],
          correlationIdentifier
        );

        // 2. REPORTE DE ESTADO (SRE Visibility)
        void EmitTelemetrySignal({
          severityLevel: validatedVeracityResult.moderationActionSuggestion === 'REJECT' ? 'WARNING' : 'INFO',
          moduleIdentifier: VERACITY_ANALYZER_IDENTIFIER,
          operationCode: 'VERACITY_SCAN_COMPLETED',
          correlationIdentifier,
          message: 'REPUTATION.LOGS.SUBMISSION_NOMINAL',
          contextMetadata: {
            confidenceScore: validatedVeracityResult.veracityConfidenceScoreNumeric,
            suggestion: validatedVeracityResult.moderationActionSuggestion
          }
        });

        return validatedVeracityResult;

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw new InternalSystemException('FALLO_EN_AUDITORIA_DE_VERACIDAD_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
