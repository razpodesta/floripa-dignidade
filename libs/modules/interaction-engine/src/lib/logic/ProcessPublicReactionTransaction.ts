/**
 * @section Interaction Logic - Public Reaction Processor
 * @description Aparato de lógica atómica que gestiona la ingesta de reacciones.
 * Implementa la metodología de ponderación responsable basada en la autoridad
 * de la identidad del evaluador.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Bayesian Weighting.
 * Vision: Anti-Bot & Verified Social Impact.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { ValidationException } from '@floripa-dignidade/exceptions';
import { PublicReactionSchema } from '../schemas/PublicReaction.schema';

/** 🛡️ SANEAMIENTO: Importación Verbatim del ADN de identidad para ponderación */
import type { IUserIdentity } from '@floripa-dignidade/identity';
import type { IPublicReaction } from '../schemas/PublicReaction.schema';

/** Identificador técnico para el Neural Sentinel. */
const INTERACTION_PROCESSOR_IDENTIFIER = 'INTERACTION_TRANSACTION_PROCESSOR';

/**
 * Procesa una reacción pública, calcula su peso de impacto inmediato
 * y emite señales de trazabilidad forense.
 *
 * @param unvalidatedReactionPayload - Datos crudos de la interacción.
 * @param activeCitizenIdentity - Contexto de la identidad (Opcional para anónimos).
 * @returns {Promise<IPublicReaction>} Reacción purificada con peso calculado.
 */
export const ProcessPublicReactionTransaction = async (
  unvalidatedReactionPayload: unknown,
  activeCitizenIdentity?: IUserIdentity
): Promise<IPublicReaction & { readonly calculatedImpactWeightNumeric: number }> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    INTERACTION_PROCESSOR_IDENTIFIER,
    'EXECUTE_REACTION_INGESTION',
    correlationIdentifier,
    async () => {

      // 1. ADUANA DE ADN (Security Border)
      const validationResult = PublicReactionSchema.safeParse(unvalidatedReactionPayload);

      if (!validationResult.success) {
        throw new ValidationException('INTERACTION_REACTION_ADN_CORRUPTO', {
          issuesCollection: validationResult.error.flatten()
        });
      }

      const validatedReaction: IPublicReaction = validationResult.data;

      // 2. ALGORITMO DE PONDERACIÓN RESPONSABLE (ISO 20488)
      /**
       * @section Metodología Bayesiana de Confianza
       * Peso Base Anónimo: 0.1
       * Peso Base Identificado: 1.0 + TrustWeightScore
       */
      let calculatedImpactWeightNumeric = 0.1;

      if (activeCitizenIdentity) {
        const baseAuthorityNumeric = 1.0;
        calculatedImpactWeightNumeric = baseAuthorityNumeric + activeCitizenIdentity.identityTrustWeightScore;
      }

      // 3. REPORTE DE TRACEABILIDAD SRE
      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: INTERACTION_PROCESSOR_IDENTIFIER,
        operationCode: 'PUBLIC_REACTION_PROCESSED',
        correlationIdentifier,
        message: 'INTERACTION.LOGS.REACTION_RECEIVED',
        contextMetadata: {
          targetEntityIdentifier: validatedReaction.targetEntityIdentifier,
          impactWeight: calculatedImpactWeightNumeric,
          isAnonymous: !activeCitizenIdentity,
          polarity: validatedReaction.interactionPolarityNumeric
        }
      });

      return {
        ...validatedReaction,
        calculatedImpactWeightNumeric
      };
    }
  );
};
