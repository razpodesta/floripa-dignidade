/**
 * @section Identity Sovereignty - Global Constants & Roles
 * Protocolo OEDP-V13.0 - ISO/IEC 27001 Alignment
 */

/**
 * Roles Soberanos del Sistema.
 * Define la jerarquía de acceso inmutable para todo el ecosistema.
 * - SYSTEM_ADMINISTRATOR: Acceso total a infraestructura y auditoría.
 * - LEGAL_AUDITOR: Acceso a denuncias y trazabilidad forense.
 * - CONTENT_MANAGER: Gestión de noticias y comunicaciones.
 * - REGISTERED_CITIZEN: Usuario con identidad verificada.
 * - ANONYMOUS_USER: Identidad temporal para reportes ciudadanos.
 */
export const USER_ROLES = {
  SYSTEM_ADMINISTRATOR: 'SYSTEM_ADMINISTRATOR',
  LEGAL_AUDITOR: 'LEGAL_AUDITOR',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  REGISTERED_CITIZEN: 'REGISTERED_CITIZEN',
  ANONYMOUS_USER: 'ANONYMOUS_USER',
} as const;

/**
 * Tipo inferido de la jerarquía de roles para uso en guardias de seguridad.
 */
export type UserRole = keyof typeof USER_ROLES;

/**
 * Constantes de Configuración de Identidad.
 */
export const IDENTITY_CONFIG = {
  MINIMUM_PASSWORD_STRENGTH: 4, // Nivel de entropía requerido
  SESSION_TIMEOUT_MINUTES: 60,
  MANDATORY_MFA: true,
} as const;
