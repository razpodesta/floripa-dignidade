/**
 * @section Reputation Logic - Evaluation Veracity Analyzer (Orchestrator)
 * @description Orquestador de inteligencia encargado de la auditoría de veracidad
 * cualitativa. Coordina la comunicación con el Neural Sentinel para detectar
 * sesgos o falsedades en testimonios ciudadanos.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Sincronización PascalCase, Resolución de Ceguera (TS2307) y SRP.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { MapHttpErrorToException } from '@floripa-dignidade/exceptions';
import { AnalyzeSystemHealthInference } from '@floripa-dignidade/health-analysis-engine';
import { EmitTelemetrySignal, TraceExecutionTime } from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural */
import type { IVeracityAnalysis } from '../../schemas/VeracityAnalysis.schema';

/* 2. Enjambre Atómico Local (Internal Swarm) */
import { BuildVeracityAuditPayload } from './BuildVeracityAuditPayload';
import { ValidateCognitiveVeracityAdn } from './ValidateCognitiveVeracityAdn';

/** Identificador técnico para el Neural Sentinel. */
const VERACITY_ANALYZER_IDENTIFIER = 'REPUTATION_VERACITY_ANALYZER';

/**
 * Ejecuta una auditoría cognitiva integral sobre el contenido de una evaluación.
 *
 * @param qualitativeCommentaryLiteral - El texto argumentativo del ciudadano.
 * @param correlationIdentifier - Identificador de trazabilidad forense.
 * @returns {Promise<IVeracityAnalysis>} Resultado de la auditoría purificado.
 */
export const AnalyzeEvaluationVeracity = async (
  qualitativeCommentaryLiteral: string,
  correlationIdentifier: string,
): Promise<IVeracityAnalysis> => {

  return await TraceExecutionTime(
    VERACITY_ANALYZER_IDENTIFIER,
    'EXECUTE_COGNITIVE_VERACITY_AUDIT_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        // 1. CONSTRUCCIÓN DE CONTRATO (Delegación Atómica)
        const intelligencePayloadSnapshot = BuildVeracityAuditPayload(qualitativeCommentaryLiteral);

        // 2. INFERENCIA COGNITIVA (Health Analysis Engine Synergy)
        const rawInferenceResponseSnapshot = await AnalyzeSystemHealthInference(
          intelligencePayloadSnapshot,
          'HUGGING_FACE'
        );

        // 3. ADUANA DE ADN Y GESTIÓN DE FALLBACK (Delegación Atómica)
        const validatedVeracityResult = ValidateCognitiveVeracityAdn(
          rawInferenceResponseSnapshot.metadata['veracityAuditOutput'],
          correlationIdentifier
        );

        // 4. REPORTE DE RESULTADO (SRE Visibility)
        void EmitTelemetrySignal({
          severityLevel: validatedVeracityResult.moderationActionSuggestion === 'REJECT' ? 'WARNING' : 'INFO',
          moduleIdentifier: VERACITY_ANALYZER_IDENTIFIER,
          operationCode: 'VERACITY_SCAN_COMPLETED',
          correlationIdentifier,
          message: 'Auditoria de veracidad finalizada exitosamente.',
          contextMetadataSnapshot: {
            confidenceScoreNumeric: validatedVeracityResult.veracityConfidenceScoreNumeric,
            moderationActionLiteral: validatedVeracityResult.moderationActionSuggestion
          }
        });

        return validatedVeracityResult;

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw MapHttpErrorToException(500, 'FALLO_EN_AUDITORIA_DE_VERACIDAD_COGNITIVA', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
