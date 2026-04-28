/**
 * @section Reputation Engine - Evaluation Submission Processor
 * @description Aparato de lógica atómica encargado de la ingesta y validación
 * de pulsos de evaluación. Actúa como el sensor de entrada para la
 * reputación del sistema, gestionando el rastro forense y la latencia.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & ISO Technical Naming.
 * Vision: Immutable Trust Ingestion with Zero Data Corruption.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { ValidationException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import { PublicEvaluationPulseSchema } from '../schemas/PublicEvaluationPulse.schema';
import type { IPublicEvaluationPulse } from '../schemas/PublicEvaluationPulse.schema';

/** Identificador técnico del aparato para el Neural Sentinel. */
const REPUTATION_PROCESSOR_IDENTIFIER_LITERAL = 'REPUTATION_SUBMISSION_PROCESSOR';

/**
 * Procesa una solicitud de evaluación pública, validando su integridad técnica
 * y emitiendo las señales de telemetría necesarias para el monitoreo SRE.
 *
 * @param unvalidatedEvaluationPayloadSnapshot - Datos crudos recibidos desde la interacción del ciudadano.
 * @returns {Promise<IPublicEvaluationPulse>} El pulso de evaluación purificado y listo para persistencia.
 * @throws {ValidationException} Si el pulso viola el contrato de integridad ISO 20488.
 */
export const ProcessPublicEvaluationSubmission = async (
  unvalidatedEvaluationPayloadSnapshot: unknown
): Promise<IPublicEvaluationPulse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    REPUTATION_PROCESSOR_IDENTIFIER_LITERAL,
    'EXECUTE_EVALUATION_INGESTION_TRANSACTION',
    correlationIdentifier,
    async () => {

      // 1. ADUANA DE ADN (Border Security)
      const evaluationValidationResult = PublicEvaluationPulseSchema.safeParse(
        unvalidatedEvaluationPayloadSnapshot
      );

      if (!evaluationValidationResult.success) {
        /**
         * @section Gestión de Fallo de Integridad
         * Emitimos una señal de alerta técnica antes de abortar la ejecución.
         */
        EmitTelemetrySignal({
          severityLevel: 'WARNING',
          moduleIdentifier: REPUTATION_PROCESSOR_IDENTIFIER_LITERAL,
          operationCode: 'EVALUATION_CONTRACT_VIOLATION',
          correlationIdentifier,
          message: 'REPUTATION.LOGS.INVALID_PULSE_STRUCTURE',
          contextMetadata: {
            validationIssuesCollection: evaluationValidationResult.error.flatten(),
            receivedDataSnapshot: unvalidatedEvaluationPayloadSnapshot
          }
        });

        throw new ValidationException('REPUTATION_PULSE_ADN_CORRUPTO', {
          issues: evaluationValidationResult.error.flatten()
        });
      }

      const validatedEvaluationPulse: IPublicEvaluationPulse = evaluationValidationResult.data;

      // 2. REPORTE DE ÉXITO OPERACIONAL (SRE Visibility)
      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: REPUTATION_PROCESSOR_IDENTIFIER_LITERAL,
        operationCode: 'EVALUATION_SUCCESSFULLY_PROCESSED',
        correlationIdentifier,
        message: 'REPUTATION.LOGS.SUBMISSION_NOMINAL',
        contextMetadata: {
          targetEntityTypeLiteral: validatedEvaluationPulse.targetEntityType,
          hasCommentaryBoolean: !!validatedEvaluationPulse.qualitativeCommentaryLiteral,
          trustScoreNumeric: validatedEvaluationPulse.quantitativeTrustScoreNumeric
        }
      });

      /**
       * @section Desacoplamiento de Flujo
       * Retornamos el dato purificado. El orquestador de nivel superior
       * decidirá si enviarlo a persistencia o al motor de análisis cognitivo.
       */
      return validatedEvaluationPulse;
    }
  );
};
