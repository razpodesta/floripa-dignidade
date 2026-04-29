/**
 * @section Identity Logic - Authority Hierarchy Evaluator
 * @description Átomo de lógica pura que determina se um papel possui autoridade
 * suficiente comparando o peso institucional do papel ativo com o nível
 * exigido pela operação. Implementa a matriz de poder soberano do enjambre.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Weight-based Authorization.
 * SANEADO Zenith: Sincronização com SSOT dinâmico e injeção de telemetria forense.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { ValidationException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Contracts) */
import { USER_ACCESS_ROLES_COLLECTION } from '../../schemas/UserAccessRole.schema';
import type { UserAccessRole } from '../../schemas/UserAccessRole.schema';
import { EvaluateAuthorityHierarchySchema } from './schemas/EvaluateAuthorityHierarchy.schema';
import type { IEvaluateAuthorityHierarchyParameters } from './schemas/EvaluateAuthorityHierarchy.schema';

/** Identificador técnico do aparato para o Neural Sentinel. */
const HIERARCHY_EVALUATOR_IDENTIFIER = 'IDENTITY_HIERARCHY_EVALUATOR_ATOM';

/**
 * @name ROLE_AUTHORITY_WEIGHTS
 * @description Mapa de influência numérica para comparação de hierarquia.
 * Define a física do poder dentro do ecossistema Floripa Dignidade.
 */
const ROLE_AUTHORITY_WEIGHTS: Record<UserAccessRole, number> = {
  INFRASTRUCTURE_SOVEREIGN_AUDITOR: 100,
  PLATFORM_GLOBAL_MANAGER: 90,
  ORGANIZATION_ADMINISTRATOR: 80,
  ORGANIZATION_OPERATOR: 70,
  CITIZEN_REGISTERED: 20,
  CITIZEN_ANONYMOUS: 0,
};

/**
 * Avalia se o papel ativo possui autoridade igual ou superior ao exigido.
 *
 * @param parameters - Objeto contendo o papel ativo e o papel requerido.
 * @returns {Promise<boolean>} Verdadeiro se o acesso for legítimo por peso ou bypass.
 */
export const EvaluateAuthorityHierarchy = async (
  parameters: IEvaluateAuthorityHierarchyParameters
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    HIERARCHY_EVALUATOR_IDENTIFIER,
    'EXECUTE_AUTHORITY_HIERARCHY_EVALUATION',
    correlationIdentifier,
    async () => {

      // 1. ADUANA DE ADN (Safe Parsing)
      const validationResult = EvaluateAuthorityHierarchySchema.safeParse(parameters);

      if (!validationResult.success) {
        throw new ValidationException('CONTRATO_DE_HIERARQUIA_VIOLADO', {
          issuesCollection: validationResult.error.flatten()
        });
      }

      const { activeRoleLiteral, requiredRoleLiteral } = validationResult.data;

      /**
       * 2. BYPASS DE INFRAESTRUTURA (Super-User Short-circuit)
       * Auditores e Gestores possuem autoridade total intrínseca no sistema.
       */
      const isSovereignUserBoolean =
        activeRoleLiteral === USER_ACCESS_ROLES_COLLECTION.INFRASTRUCTURE_SOVEREIGN_AUDITOR ||
        activeRoleLiteral === USER_ACCESS_ROLES_COLLECTION.PLATFORM_GLOBAL_MANAGER;

      if (isSovereignUserBoolean) {
        return true;
      }

      /**
       * 3. AVALIAÇÃO DE PESO HIERÁRQUICO
       * Compara os coeficientes de autoridade definidos na ontologia da ONG.
       */
      const activeAuthorityWeightNumeric = ROLE_AUTHORITY_WEIGHTS[activeRoleLiteral];
      const requiredAuthorityWeightNumeric = ROLE_AUTHORITY_WEIGHTS[requiredRoleLiteral];

      const isAuthorizedBoolean = activeAuthorityWeightNumeric >= requiredAuthorityWeightNumeric;

      // 4. REPORTE DE TELEMETRIA (Audit Trail)
      void EmitTelemetrySignal({
        severityLevel: isAuthorizedBoolean ? 'INFO' : 'WARNING',
        moduleIdentifier: HIERARCHY_EVALUATOR_IDENTIFIER,
        operationCode: 'AUTHORITY_EVALUATION_COMPLETED',
        correlationIdentifier,
        message: `Avaliação de hierarquia finalizada. Resultado: [${isAuthorizedBoolean}]`,
        contextMetadata: {
          activeRole: activeRoleLiteral,
          requiredRole: requiredRoleLiteral,
          activeWeight: activeAuthorityWeightNumeric,
          requiredWeight: requiredAuthorityWeightNumeric
        }
      });

      return isAuthorizedBoolean;
    }
  );
};
