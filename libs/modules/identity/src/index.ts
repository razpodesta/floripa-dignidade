/**
 * @section Identity Module - Sovereign Package Entry Point (Barrel)
 * @description Único punto de exportación autorizado para el búnker de identidad.
 * Orquestra la visibilidad de los contratos de ADN, lógica de autoridad y
 * configuraciones de seguridad para el ecosistema Floripa Dignidade.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & SSOT Alignment.
 * SANEADO Zenith: Sincronización de exportaciones nominales (Fix TS2305 / TS2724).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

/**
 * @version 1.3.1
 * Estatus: Nivelación Zenith completada. Grafo de visibilidad sanado para
 * los motores de mensajería e interacción.
 */
export const MODULE_IDENTITY_VERSION = '1.3.1';

/**
 * @section Capa 1: ADN Estructural (Schemas & Types)
 * @description Exportación de contratos inalterables para validación de perfiles y roles.
 */
export {
  SocialIdentityProviderSchema,
  UserIdentifierSchema,
  UserIdentitySchema,
} from './lib/schemas/UserIdentity.schema';

export type {
  SocialIdentityProvider, // 🛡️ SANEADO: Desbloquea el tipado en mappers externos.
  UserIdentifier,
  IUserIdentity,
} from './lib/schemas/UserIdentity.schema';

export {
  UserAccessRoleSchema,
  USER_ACCESS_ROLES_COLLECTION,
  /**
   * 🛡️ SANEADO Zenith: Alias de compatibilidad institucional.
   * Evita la ruptura del 'messaging-engine' mientras se completa la
   * migración hacia la nueva nomenclatura ISO.
   */
  USER_ACCESS_ROLES_COLLECTION as USER_ROLES,
} from './lib/schemas/UserAccessRole.schema';

export type {
  UserAccessRole,
} from './lib/schemas/UserAccessRole.schema';

/**
 * @section Capa 2: Infraestructura y Seguridad
 * @description Definiciones técnicas de resiliencia y gobernanza criptográfica.
 */
export {
  IDENTITY_SECURITY_CONFIG,
} from './lib/constants/IdentitySecurityConfiguration';

/**
 * @section Capa 3: Motores de Lógica y Orquestación (Atoms & Orchestrators)
 * @description Unidades funcionales para la gestión de acceso y soberanía de autoridad.
 */

// Orquestadores Principales (RBAC Sentry & Persistencia Cloud)
export { ValidateUserAccess } from './lib/logic/ValidateUserAccess';
export { SyncIdentityAuthority } from './lib/logic/SyncIdentityAuthority';

// Átomos Lógicos (Functional Swarm)
export { AnonymizeCitizenName } from './lib/logic/atomic/AnonymizeCitizenName';
export { CalculateIdentityAuthority } from './lib/logic/atomic/CalculateIdentityAuthority';
export { ValidateInfrastructureSovereignAuthority } from './lib/logic/atomic/ValidateInfrastructureSovereignAuthority';

/**
 * @section Capa 4: Contratos de Átomos (Specific Parameters)
 * @description Tipado necesario para aplicaciones que realizan triaje de
 * formularios o auditoría forense de parámetros.
 */
export type {
  IAnonymizeCitizenNameParameters,
} from './lib/logic/atomic/schemas/AnonymizeCitizenName.schema';

export type {
  ICalculateIdentityAuthorityParameters,
  IIdentityAuthorityResult,
} from './lib/logic/atomic/schemas/CalculateIdentityAuthority.schema';

export type {
  IValidateInfrastructureSovereignAuthorityParameters,
} from './lib/logic/atomic/schemas/ValidateInfrastructureSovereignAuthority.schema';
