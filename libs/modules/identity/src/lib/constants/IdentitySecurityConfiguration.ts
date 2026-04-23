/**
 * @section Identity Sovereignty - Security Defaults
 * @description Constantes de configuración inmutables para el búnker de identidad.
 * Protocolo OEDP-V13.0 - ISO/IEC 27001 Alignment.
 */
export const IdentitySecurityConfiguration = {
  /** Nivel de entropía y complejidad mínima requerida para credenciales. */
  MINIMUM_PASSWORD_STRENGTH: 4,

  /** Tiempo de vida de la sesión activa en minutos antes de requerir re-validación. */
  SESSION_TIMEOUT_MINUTES: 60,

  /** Obligatoriedad de Segundo Factor de Autenticación para roles administrativos. */
  MANDATORY_MULTI_FACTOR_AUTHENTICATION: true,
} as const;
