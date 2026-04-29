/**
 * @section Identity Logic - Identity Authority Orchestrator
 * @description Orquestrador atômico que computa a autoridade bayesiana do cidadão.
 * Consolida bônus sociais, verificação documental e antiguidade em um único
 * coeficiente de influência institucional.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Atomização da lógica de datas e validação por Aduana Zod.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Contracts) */
import {
  CalculateIdentityAuthoritySchema,
  IdentityAuthorityResultSchema
} from './schemas/CalculateIdentityAuthority.schema';

import type {
  ICalculateIdentityAuthorityParameters,
  IIdentityAuthorityResult
} from './schemas/CalculateIdentityAuthority.schema';

/* 2. Átomos de Cálculo Interno */
import { CalculateSeniorityBonus } from './CalculateSeniorityBonus';

/** Identificador técnico para auditoria cognitiva. */
const AUTHORITY_ENGINE_IDENTIFIER = 'IDENTITY_AUTHORITY_CALCULATOR';

/**
 * @section Constantes de Ponderação (Ground Truth)
 */
const BASE_ANONYMOUS_TRUST_WEIGHT_NUMERIC = 0.1;
const SOCIAL_FEDERATION_BONUS_NUMERIC = 0.2;
const LEGAL_VERIFICATION_BONUS_NUMERIC = 0.5;

/**
 * Executa o cálculo integral da autoridade institucional de uma identidade.
 *
 * @param identitySnapshot - ADN da identidade capturada na sessão.
 * @returns {Promise<IIdentityAuthorityResult>} Resultado validado e auditado.
 */
export const CalculateIdentityAuthority = async (
  identitySnapshot: ICalculateIdentityAuthorityParameters
): Promise<IIdentityAuthorityResult> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    AUTHORITY_ENGINE_IDENTIFIER,
    'EXECUTE_BAYESIAN_AUTHORITY_COMPUTATION',
    correlationIdentifier,
    async () => {
      try {
        // 1. ADUANA DE ENTRADA (Input Validation)
        const validationInputResult = CalculateIdentityAuthoritySchema.safeParse(identitySnapshot);

        if (!validationInputResult.success) {
          throw new Error('INVALID_IDENTITY_DATA_FOR_CALCULATION');
        }

        const validatedIdentity = validationInputResult.data;
        let currentAuthorityScoreNumeric = BASE_ANONYMOUS_TRUST_WEIGHT_NUMERIC;

        // 2. BÔNUS DE FEDERAÇÃO SOCIAL
        const isFederatedIdentityBoolean = validatedIdentity.socialProviderIdentifier !== 'INTERNAL_INFRASTRUCTURE';
        if (isFederatedIdentityBoolean) {
          currentAuthorityScoreNumeric += SOCIAL_FEDERATION_BONUS_NUMERIC;
        }

        // 3. BÔNUS DE SOBERANIA LEGAL (Documental)
        if (validatedIdentity.isIdentityLegallyVerifiedBoolean) {
          currentAuthorityScoreNumeric += LEGAL_VERIFICATION_BONUS_NUMERIC;
        }

        // 4. BÔNUS DE ANTIGUIDADE (Delegado ao Átomo Matemático)
        const {
          daysSinceActivationQuantity,
          seniorityBonusNumeric
        } = CalculateSeniorityBonus(validatedIdentity.occurrenceTimestampISO);

        currentAuthorityScoreNumeric += seniorityBonusNumeric;

        // 5. NORMALIZAÇÃO E CONSTRUÇÃO DO RESULTADO
        const finalCoefficientNumeric = Math.min(currentAuthorityScoreNumeric, 1.0);

        const calculationResultSnapshot: IIdentityAuthorityResult = {
          authorityCoefficientNumeric: finalCoefficientNumeric,
          daysSinceActivationQuantity,
          isVerifiedHumanBoolean: validatedIdentity.isIdentityLegallyVerifiedBoolean
        };

        // 6. ADUANA DE SAÍDA (Output Validation)
        const validatedOutput = IdentityAuthorityResultSchema.parse(calculationResultSnapshot);

        // 7. REPORTE DE TELEMETRIA (Audit Trail)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: AUTHORITY_ENGINE_IDENTIFIER,
          operationCode: 'AUTHORITY_SCORE_GENERATED',
          correlationIdentifier,
          message: 'IDENTITY.LOGS.AUTHORITY_CALCULATED',
          contextMetadata: {
            citizenId: validatedIdentity.identityIdentifier,
            finalScore: finalCoefficientNumeric,
            daysActive: daysSinceActivationQuantity
          }
        });

        return validatedOutput;

      } catch (caughtError: unknown) {
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw new InternalSystemException('FALLO_EN_MOTOR_DE_AUTORIDAD_SRE', {
          originalError: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
