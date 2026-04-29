/**
 * @section Identity Logic - Infrastructure Sovereign Authority Validator
 * @description Aparelho de segurança máxima que valida a ativação de privilégios
 * de auditoria total baseados em segredos de infraestrutura. Implementa comparação
 * de tempo constante para prevenir ataques de temporização (Timing Attacks).
 *
 * Protocolo OEDP-V17.0 - Security First & Functional Atomicity.
 * SANEADO Zenith: Erradicação total de process.env (Fix no-restricted-syntax).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';
import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { ValidationException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural */
import {
  ValidateInfrastructureSovereignAuthoritySchema
} from './schemas/ValidateInfrastructureSovereignAuthority.schema';
import type {
  IValidateInfrastructureSovereignAuthorityParameters
} from './schemas/ValidateInfrastructureSovereignAuthority.schema';

/** Identificador técnico para o Neural Sentinel. */
const SOVEREIGN_SECURITY_IDENTIFIER = 'INFRASTRUCTURE_SOVEREIGN_GATEKEEPER';

/**
 * Avalia se o desafio de poder soberano é legítimo.
 *
 * @param parameters - Objeto contendo o token de segurança fornecido.
 * @returns {Promise<boolean>} Verdadeiro se a simetria criptográfica for absoluta.
 */
export const ValidateInfrastructureSovereignAuthority = async (
  parameters: IValidateInfrastructureSovereignAuthorityParameters
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    SOVEREIGN_SECURITY_IDENTIFIER,
    'EXECUTE_SOVEREIGN_CHALLENGE_VALIDATION',
    correlationIdentifier,
    async () => {
      // 1. ADUANA DE ADN (Input Validation)
      const validationResult = ValidateInfrastructureSovereignAuthoritySchema.safeParse(parameters);

      if (!validationResult.success) {
        throw new ValidationException('TOKEN_DE_SEGURANÇA_MALFORMADO', {
          issues: validationResult.error.flatten()
        });
      }

      // 2. CAPTURA DE INFRAESTRUTURA (Sovereign Infrastructure Capture)
      /**
       * 🛡️ SANEADO Zenith: O segredo é recuperado exclusivamente via Aduana.
       * Isso garante que o token tenha o formato correto e tenha sido validado no bootstrap.
       */
      const {
        PAYLOAD_SECRET,
        SOVEREIGN_EMERGENCY_TOKEN
      } = ValidateEnvironmentAduana();

      /**
       * @section Blindagem Criptográfica (Constant-time Comparison)
       * Utilizamos HMAC para normalizar os dados e prevenir Timing Attacks.
       */
      const challengeHashBuffer = createHmac('sha256', PAYLOAD_SECRET)
        .update(validationResult.data.administrativeSecurityTokenLiteral)
        .digest();

      const expectedHashBuffer = createHmac('sha256', PAYLOAD_SECRET)
        .update(SOVEREIGN_EMERGENCY_TOKEN)
        .digest();

      const isIdentityLegitimateBoolean = timingSafeEqual(challengeHashBuffer, expectedHashBuffer);

      // 3. REPORTE DE TELEMETRIA DE ALTA PRIORIDADE
      if (!isIdentityLegitimateBoolean) {
        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: SOVEREIGN_SECURITY_IDENTIFIER,
          operationCode: 'SOVEREIGN_BYPASS_ATTEMPT_FAILED',
          correlationIdentifier,
          message: 'ALERTA DE SEGURANÇA: Tentativa falha de ativação de poder soberano.',
          contextMetadata: { threatLevel: 'HIGH' }
        });
      } else {
        void EmitTelemetrySignal({
          severityLevel: 'WARNING',
          moduleIdentifier: SOVEREIGN_SECURITY_IDENTIFIER,
          operationCode: 'SOVEREIGN_POWER_ACTIVATED',
          correlationIdentifier,
          message: 'Poder soberano de infraestrutura ativado com sucesso.'
        });
      }

      return isIdentityLegitimateBoolean;
    }
  );
};
