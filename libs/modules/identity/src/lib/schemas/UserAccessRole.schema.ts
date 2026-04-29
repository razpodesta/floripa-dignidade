/**
 * @section Identity DNA - Global Access Role Hierarchy (SSOT)
 * @description Única Fonte de Verdade (SSOT) para a hierarquia de autoridade institucional.
 * Define os níveis de atuação permitidos e deriva dinamicamente o esquema de validação
 * para garantir simetria absoluta entre constantes e ADN de dados.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & Dynamic SSOT.
 * SANEADO Zenith: Resolução de erro TS2305 (Missing export) e centralização de autoridade.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';

/**
 * @name USER_ACCESS_ROLES_COLLECTION
 * @description Catálogo inalterável de papéis institucionais.
 * Este objeto é a semente de autoridade de todo o ecossistema.
 */
export const USER_ACCESS_ROLES_COLLECTION = {
  /** Auditor de Infraestrutura: Controle total de SRE, Segurança e Kernel. */
  INFRASTRUCTURE_SOVEREIGN_AUDITOR: 'INFRASTRUCTURE_SOVEREIGN_AUDITOR',

  /** Gestor Global: Administração operacional da plataforma e rede de ONGs. */
  PLATFORM_GLOBAL_MANAGER: 'PLATFORM_GLOBAL_MANAGER',

  /** Administrador de Organização: Autoridade sobre um ente aliado específico. */
  ORGANIZATION_ADMINISTRATOR: 'ORGANIZATION_ADMINISTRATOR',

  /** Operador de Impacto: Gestão de notícias, indicadores e triagem de dados. */
  ORGANIZATION_OPERATOR: 'ORGANIZATION_OPERATOR',

  /** Cidadão Registrado: Usuário com identidade e soberania validada documentalmente. */
  CITIZEN_REGISTERED: 'CITIZEN_REGISTERED',

  /** Cidadão Anônimo: Identidade temporária para processos iniciais de interação. */
  CITIZEN_ANONYMOUS: 'CITIZEN_ANONYMOUS',
} as const;

/**
 * @section Extração Dinâmica de ADN
 * Transformamos as chaves do objeto em um Enum de Zod para evitar redundância manual.
 * Garantimos tipagem forte para o array de chaves.
 */
const rolesKeysCollection = Object.keys(USER_ACCESS_ROLES_COLLECTION) as [
  keyof typeof USER_ACCESS_ROLES_COLLECTION,
  ...(keyof typeof USER_ACCESS_ROLES_COLLECTION)[]
];

/**
 * @name UserAccessRoleSchema
 * @description Aduana de ADN que valida se um literal pertence à hierarquia oficial.
 */
export const UserAccessRoleSchema = z.enum(rolesKeysCollection)
  .describe('Jerarquia técnica de autoridade da ONG Floripa Dignidade.');

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 * Representação em tempo de compilação da autoridade institucional.
 */
export type UserAccessRole = z.infer<typeof UserAccessRoleSchema>;
