/**
 * @section Identity DNA - Linguistic Integrity Schema
 * @description Define el contrato soberano para los diccionarios del búnker de identidad.
 * Garantiza que cada descripción técnica y mensaje de error posea una traducción
 * obligatoria y tipada, erradicando los textos en duro (Hardcoded).
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & ReadOnly Integrity.
 */

import { z } from 'zod';

/**
 * @name IdentityI18nSchema
 * @description Aduana de validación para las almas lingüísticas del dominio de identidad.
 */
export const IdentityI18nSchema = z.object({
  schemas: z.object({
    FULL_NAME_DESCRIPTION: z.string()
      .describe('Descripción técnica del campo de nombre legal completo.'),
    EMAIL_DESCRIPTION: z.string()
      .describe('Descripción técnica del campo de correo electrónico.'),
    AVATAR_DESCRIPTION: z.string()
      .describe('Descripción técnica del recurso visual de identidad.'),
    TRUST_LEVEL_DESCRIPTION: z.string()
      .describe('Explicación del coeficiente de credibilidad bayesiana.')
  }),
  errors: z.object({
    INVALID_AVATAR_URL: z.string(),
    TRUST_LEVEL_OUT_OF_BOUNDS: z.string(),
    IDENTITY_NOT_FOUND: z.string(),
    UNAUTHORIZED_PROVIDER: z.string()
  }),
  roles: z.object({
    INFRASTRUCTURE_SOVEREIGN_AUDITOR: z.string(),
    PLATFORM_GLOBAL_MANAGER: z.string(),
    ORGANIZATION_ADMINISTRATOR: z.string(),
    ORGANIZATION_OPERATOR: z.string(),
    CITIZEN_REGISTERED: z.string(),
    CITIZEN_ANONYMOUS: z.string()
  })
}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IIdentityI18n = z.infer<typeof IdentityI18nSchema>;
