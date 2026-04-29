/**
 * @section Identity Module - Sovereign Package Entry Point (Barrel)
 * @description Único ponto de exportação autorizado para o búnker de identidade.
 * Orquestra a visibilidade dos contratos de ADN, lógica de autoridade e
 * configurações de segurança para o ecossistema Floripa Dignidade.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & SSOT Alignment.
 * SANEADO Zenith: Purga de exportações obsoletas e sincronização com a nova hierarquia.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

/**
 * @version 1.2.5
 * Estatus: Nivelamento Zenith completo. Suporte para Hierarquia Bayeseana e
 * Blindagem Criptográfica de Autoridade Máxima.
 */
export const MODULE_IDENTITY_VERSION = '1.2.5';

/**
 * @section Camada 1: ADN Estrutural (Schemas & Types)
 * Exportação de contratos inalteráveis para validação de perfis e papéis.
 */
export {
  UserIdentifierSchema,
  UserIdentitySchema,
  SocialIdentityProviderSchema
} from './lib/schemas/UserIdentity.schema';

export type {
  UserIdentifier,
  IUserIdentity
} from './lib/schemas/UserIdentity.schema';

export {
  UserAccessRoleSchema,
  USER_ACCESS_ROLES_COLLECTION
} from './lib/schemas/UserAccessRole.schema';

export type {
  UserAccessRole
} from './lib/schemas/UserAccessRole.schema';

/**
 * @section Camada 2: Infraestrutura e Segurança
 * Definições técnicas de resiliência e governança criptográfica.
 */
export {
  IDENTITY_SECURITY_CONFIG
} from './lib/constants/IdentitySecurityConfiguration';

/**
 * @section Camada 3: Motores de Lógica e Orquestração
 * Unidades funcionais para gestão de acesso e soberania.
 */

// Orquestrador de Fronteira (RBAC Sentry)
export { ValidateUserAccess } from './lib/logic/ValidateUserAccess';

// Átomos Lógicos (Functional Swarm)
export { AnonymizeCitizenName } from './lib/logic/atomic/AnonymizeCitizenName';
export { CalculateIdentityAuthority } from './lib/logic/atomic/CalculateIdentityAuthority';
export { ValidateInfrastructureSovereignAuthority } from './lib/logic/atomic/ValidateInfrastructureSovereignAuthority';

/**
 * @section Camada 4: Contratos de Átomos (Sub-Schemas)
 * Necessário para aplicações que realizam triagem de formulários ou auditoria.
 */
export type {
  IAnonymizeCitizenNameParameters
} from './lib/logic/atomic/schemas/AnonymizeCitizenName.schema';

export type {
  ICalculateIdentityAuthorityParameters,
  IIdentityAuthorityResult
} from './lib/logic/atomic/schemas/CalculateIdentityAuthority.schema';

export type {
  IValidateInfrastructureSovereignAuthorityParameters
} from './lib/logic/atomic/schemas/ValidateInfrastructureSovereignAuthority.schema';
