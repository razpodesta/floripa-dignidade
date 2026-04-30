/**
 * @section Identity Logic - Identity Authority Orchestrator
 * @description Orquestrador atômico que computa a autoridade bayesiana do cidadão.
 * Consolida bônus sociais, verificação documental e antiguidade.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Atomização total de pesos e sincronia com Ground Truth.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Contracts) */
import {
  CalculateIdentityAuthoritySchema,
  IdentityAuthorityResultSchema,
} from './schemas/CalculateIdentityAuthority.schema';

import type {
  ICalculateIdentityAuthorityParameters,
  IIdentityAuthorityResult,
} from './schemas/CalculateIdentityAuthority.schema';

/* 2. Infraestrutura e Enxame Atômico */
import { AUTHORITY_WEIGHT_GROUND_TRUTH } from '../../constants/AuthorityWeightGroundTruth';
import { CalculateSeniorityBonus } from './CalculateSeniorityBonus';
import { MapAuthorityBonuses } from './MapAuthorityBonuses';

/** Identificador técnico para auditoria cognitiva. */
const AUTHORITY_ENGINE_IDENTIFIER = 'IDENTITY_AUTHORITY_CALCULATOR';

/**
 * Executa o cálculo integral da autoridade institucional de uma identidade.
 *
 * @param identitySnapshot - ADN da identidade capturada na sessão.
 * @returns {Promise<IIdentityAuthorityResult>} Resultado validado e auditado.
 */
export const CalculateIdentityAuthority = async (
  identitySnapshot: ICalculateIdentityAuthorityParameters,
): Promise<IIdentityAuthorityResult> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    AUTHORITY_ENGINE_IDENTIFIER,
    'EXECUTE_BAYESIAN_AUTHORITY_COMPUTATION',
    correlationIdentifier,
    async () => {
      try {
        // 1. ADUANA DE ENTRADA (Safe Parsing)
        const validationInputResult = CalculateIdentityAuthoritySchema.safeParse(identitySnapshot);

        if (!validationInputResult.success) {
          throw new Error('INVALID_IDENTITY_DATA_FOR_CALCULATION');
        }

        const validatedIdentity = validationInputResult.data;

        /**
         * FASE 1: PONTUAÇÃO BASE E BONIFICAÇÕES
         * Iniciamos com o peso anônimo e delegamos o cálculo de benefícios ao átomo de mapeamento.
         */
        let currentAuthorityScoreNumeric = AUTHORITY_WEIGHT_GROUND_TRUTH.BASE_ANONYMOUS_TRUST_WEIGHT_NUMERIC;

        currentAuthorityScoreNumeric += MapAuthorityBonuses({
          socialProviderIdentifier: validatedIdentity.socialProviderIdentifier,
          isIdentityLegallyVerifiedBoolean: validatedIdentity.isIdentityLegallyVerifiedBoolean,
        });

        /**
         * FASE 2: CÁLCULO DE ANTIGUIDADE (Seniority Bonus)
         * Isola a aritmética temporal do fluxo principal.
         */
        const { daysSinceActivationQuantity, seniorityBonusNumeric } = CalculateSeniorityBonus(
          validatedIdentity.occurrenceTimestampISO,
        );

        currentAuthorityScoreNumeric += seniorityBonusNumeric;

        /**
         * FASE 3: NORMALIZAÇÃO ZENITH
         * Garantimos que o score final não ultrapasse o teto de 100%.
         */
        const finalCoefficientNumeric = Math.min(
          currentAuthorityScoreNumeric,
          AUTHORITY_WEIGHT_GROUND_TRUTH.MAXIMUM_AUTHORITY_THRESHOLD_NUMERIC,
        );

        const calculationResultSnapshot: IIdentityAuthorityResult = {
          authorityCoefficientNumeric: finalCoefficientNumeric,
          daysSinceActivationQuantity,
          isVerifiedHumanBoolean: validatedIdentity.isIdentityLegallyVerifiedBoolean,
        };

        // 2. ADUANA DE SAÍDA (Validación de Integridad del ADN)
        const validatedOutput = IdentityAuthorityResultSchema.parse(calculationResultSnapshot);

        // 3. REPORTE DE TELEMETRIA (Audit Trail)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: AUTHORITY_ENGINE_IDENTIFIER,
          operationCode: 'AUTHORITY_COMPUTATION_SUCCESS',
          correlationIdentifier,
          message: 'IDENTITY.LOGS.AUTHORITY_CALCULATED',
          contextMetadata: {
            citizenId: validatedIdentity.identityIdentifier,
            finalScoreNumeric: finalCoefficientNumeric,
            activeDaysQuantity: daysSinceActivationQuantity,
          },
        });

        return validatedOutput;

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral =
          caughtError instanceof Error ? caughtError.message : String(caughtError);

        throw new InternalSystemException('FALLO_EN_MOTOR_DE_AUTORIDAD_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    },
  );
};
