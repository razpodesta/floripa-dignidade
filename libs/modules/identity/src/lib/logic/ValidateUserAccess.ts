/**
 * @section Identity Logic - Authority Validation Orchestrator
 * @description Orquestrador encarregado de validar se uma identidade cidadã
 * cumpre os requisitos de autoridade para uma transação.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Correção de TS2554 (Async call) e sincronização com parâmetros nominais.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { ValidationException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import type { UserAccessRole } from '../schemas/UserAccessRole.schema';
import { UserIdentitySchema } from '../schemas/UserIdentity.schema';
import type { IUserIdentity } from '../schemas/UserIdentity.schema';

/* 2. Enxame Atômico */
import { EvaluateAuthorityHierarchy } from './atomic/EvaluateAuthorityHierarchy';

/** Identificador técnico do sensor para o Neural Sentinel. */
const IDENTITY_ACCESS_IDENTIFIER = 'IDENTITY_ACCESS_SENTRY';

/**
 * Verifica se a identidade cumpre o contrato técnico e possui autoridade legítima.
 *
 * @param rawUserIdentityData - Objeto capturado da sessão ou API.
 * @param requiredAccessRole - Nível de autoridade solicitado.
 * @returns {Promise<IUserIdentity>} Identidade purificada e validada.
 * @throws {ValidationException} Se o ADN estiver corrupto ou a autoridade for insuficiente.
 */
export const ValidateUserAccess = async (
  rawUserIdentityData: unknown,
  requiredAccessRole: UserAccessRole,
): Promise<IUserIdentity> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. ADUANA DE ADN (Safe Parsing)
  const validationResult = UserIdentitySchema.safeParse(rawUserIdentityData);

  if (!validationResult.success) {
    void EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: IDENTITY_ACCESS_IDENTIFIER,
      operationCode: 'IDENTITY_CONTRACT_VIOLATION',
      correlationIdentifier,
      message: 'Os dados de identidade falharam na auditoria de esquema.',
      contextMetadata: { issues: validationResult.error.flatten() }
    });

    throw new ValidationException('ADN_IDENTIDAD_CORRUPTO', {
      validationIssues: validationResult.error.flatten(),
    });
  }

  const authenticatedIdentity: IUserIdentity = validationResult.data;

  /**
   * 2. EVALUACIÓN DE JERARQUÍA (Delegación Atómica)
   * SANEADO Zenith: Invocação assíncrona e passagem de parâmetros via objeto (Fix TS2554).
   */
  const isAuthorizedBoolean = await EvaluateAuthorityHierarchy({
    activeRoleLiteral: authenticatedIdentity.assignedAuthorityRoleLiteral,
    requiredRoleLiteral: requiredAccessRole
  });

  if (!isAuthorizedBoolean) {
    void EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: IDENTITY_ACCESS_IDENTIFIER,
      operationCode: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      correlationIdentifier,
      message: `Bloqueio de segurança: Acesso negado para [${authenticatedIdentity.assignedAuthorityRoleLiteral}]`,
      contextMetadata: {
        citizenId: authenticatedIdentity.identityIdentifier,
        requiredRole: requiredAccessRole
      }
    });

    throw new ValidationException('ACCESO_NO_AUTORIZADO', {
      requiredRole: requiredAccessRole,
      activeRole: authenticatedIdentity.assignedAuthorityRoleLiteral,
      citizenIdentifier: authenticatedIdentity.identityIdentifier,
    });
  }

  // 3. REPORTE DE TRANSITO LEGÍTIMO
  void EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: IDENTITY_ACCESS_IDENTIFIER,
    operationCode: 'IDENTITY_ACCESS_AUTHORIZED',
    correlationIdentifier,
    message: 'Acesso perimetral autorizado com sucesso.'
  });

  return authenticatedIdentity;
};
