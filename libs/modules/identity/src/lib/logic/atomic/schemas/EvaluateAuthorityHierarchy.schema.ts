/**
 * @section Identity DNA - Authority Hierarchy Contract
 * @description Define a estrutura de validação para a avaliação de hierarquia.
 * Garante que ambos os papéis (ativo e exigido) pertençam ao catálogo oficial.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';
import { UserAccessRoleSchema } from '../../../schemas/UserAccessRole.schema';

/**
 * @name EvaluateAuthorityHierarchySchema
 * @description Valida os parâmetros de entrada para o átomo de decisão hierárquica.
 */
export const EvaluateAuthorityHierarchySchema = z.object({
  /** Papel institucional da identidade que solicita o acesso. */
  activeRoleLiteral: UserAccessRoleSchema,

  /** Mínimo nível de autoridade exigido pela operação de fronteira. */
  requiredRoleLiteral: UserAccessRoleSchema,
}).readonly();

/** 🛡️ ADN Tipado para exportação Verbatim */
export type IEvaluateAuthorityHierarchyParameters = z.infer<typeof EvaluateAuthorityHierarchySchema>;
