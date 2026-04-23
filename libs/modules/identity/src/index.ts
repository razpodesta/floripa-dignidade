/**
 * 🔑 Identity Module - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Identity & Access Management (IAM)
 *
 * Este búnker orquesta la soberanía de identidad y la jerarquía de roles
 * para todo el ecosistema Floripa Dignidade.
 */

// Exportación de Configuración de Seguridad
export * from './lib/constants/IdentitySecurityConfiguration';

// Exportación de ADN Estructural (Esquemas y Roles)
export * from './lib/schemas/UserAccessRole.schema';
export * from './lib/schemas/UserIdentity.schema';

// Exportación de Lógica de Soberanía Atómica
export { ValidateUserAccess } from './lib/logic/ValidateUserAccess';
