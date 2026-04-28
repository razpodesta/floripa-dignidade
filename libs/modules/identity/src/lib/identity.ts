/**
 * @section Identity Sovereignty - Global Constants & Roles
 * @description Única Fuente de Verdad (SSOT) para la jerarquía de autoridad 
 * institucional y configuración de seguridad criptográfica del ecosistema.
 *
 * Protocolo OEDP-V16.0 - ISO/IEC 27001 Alignment & Professional Naming.
 * SANEADO Zenith: Nivelación de roles profesionales para resolución de error TS2339.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @name USER_ROLES
 * @description Catálogo inmutable de rangos de autoridad institucional.
 * Define la capacidad de actuación de cada identidad en el enjambre.
 */
export const USER_ROLES = {
  /** Auditor de Infraestructura: Acceso total a SRE, Seguridad y Kernel. */
  INFRASTRUCTURE_SOVEREIGN_AUDITOR: 'INFRASTRUCTURE_SOVEREIGN_AUDITOR',

  /** Gestor Global: Administración operativa de la plataforma y ONGs. */
  PLATFORM_GLOBAL_MANAGER: 'PLATFORM_GLOBAL_MANAGER',

  /** Administrador de Organización: Autoridad máxima de una entidad anidada. */
  ORGANIZATION_ADMINISTRATOR: 'ORGANIZATION_ADMINISTRATOR',

  /** Operador de Impacto: Personal operativo encargado de noticias y denuncias. */
  ORGANIZATION_OPERATOR: 'ORGANIZATION_OPERATOR',

  /** Ciudadano Verificado: Usuario con identidad validada documentalmente. */
  CITIZEN_REGISTERED: 'CITIZEN_REGISTERED',

  /** Ciudadano Anónimo: Identidad temporal para procesos iniciales de denuncia. */
  CITIZEN_ANONYMOUS: 'CITIZEN_ANONYMOUS',
} as const;

/**
 * @section ADN Tipado
 * Tipo inferido de la jerarquía de roles para uso en guardias de seguridad (RBAC).
 */
export type UserRole = keyof typeof USER_ROLES;

/**
 * @section Configuración de Seguridad ISO
 * @description Parámetros técnicos para la gobernanza de accesos y resiliencia.
 */
export const IDENTITY_CONFIG = {
  /** Nivel de entropía mínima requerida para secretos ciudadanos. */
  minimumPasswordStrengthLevelQuantity: 4,

  /** Tiempo de vida de la sesión activa en minutos. */
  sessionTimeoutDurationMinutesQuantity: 60,

  /** Obligatoriedad de Segundo Factor de Autenticación para roles de autoridad. */
  isMultiFactorAuthenticationMandatoryBoolean: true,
} as const;