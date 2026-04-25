/**
 * @section Identity Module - Package Entry Point
 * @description Centraliza la gestión de autoridad, roles y validación de identidad
 * para el ecosistema Floripa Dignidade.
 *
 * Protocolo OEDP-V14.0 - Single Source Resolution.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

export * from './lib/schemas/UserAccessAuthority.schema';
export { ValidateInfrastructureSovereignAuthority } from './lib/logic/atomic/ValidateInfrastructureSovereignAuthority';
export { ValidateUserAccess } from './lib/logic/ValidateUserAccess';
export { IDENTITY_CONFIG, USER_ROLES } from './lib/identity';
