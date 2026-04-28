/**
 * @section Identity DNA - Global Verified Identity Schema
 * @description Define el contrato maestro para la identidad ciudadana e institucional.
 * Orquesta la convergencia entre autenticación social, transparencia y privacidad.
 *
 * Protocolo OEDP-V16.0 - High Performance & ISO Technical Naming.
 * SANEADO Zenith: Resolución de TS2769 mediante sincronización con UserAccessRoleSchema.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';
import { UserAccessRoleSchema } from './UserAccessRole.schema';

/**
 * @section ADN Criptográfico - Tipado Nominal
 */
export const UserIdentifierSchema = z.string().uuid().brand<'UserIdentifier'>();
export type UserIdentifier = z.infer<typeof UserIdentifierSchema>;

/**
 * Catálogo de proveedores de identidad externa autorizados.
 */
export const SocialIdentityProviderSchema = z.enum([
  'GOOGLE_IDENTITY',
  'APPLE_ID',
  'INSTAGRAM_GRAPH',
  'FACEBOOK_CONNECT',
  'X_CORP_API',
  'INTERNAL_INFRASTRUCTURE'
]).describe('Identificador técnico del proveedor de autenticación social.');

/**
 * @name UserIdentitySchema
 * @description Contrato soberano de identidad. SSOT para perfiles y auditoría civil.
 */
export const UserIdentitySchema = z.object({
  /** Identificador único e inalterable en el enjambre de datos. */
  identityIdentifier: UserIdentifierSchema,

  /** Nombre completo capturado del registro civil o proveedor social. */
  fullLegalNameLiteral: z.string()
    .min(3)
    .describe('Nombre legal completo para procesos de transparencia.'),

  /**
   * Nombre Público Anonimizado (Regla: NOMBRE + INICIAL).
   * Ejemplo: "ANALUIZA S."
   */
  anonymizedPublicNameLiteral: z.string()
    .describe('Representación visual segura para proteger la privacidad del ciudadano.'),

  /** Dirección de contacto principal validada. */
  electronicMailAddressLiteral: z.string().email()
    .describe('Dirección de correo electrónico vinculada a la cuenta soberana.'),

  /** URL física del avatar (fotografía) recuperada del proveedor social. */
  avatarSourceUrl: z.string().url().nullable()
    .describe('Enlace al recurso visual de identidad para transparencia pública.'),

  /** Identificador del proveedor OAuth2 utilizado. */
  socialProviderIdentifier: SocialIdentityProviderSchema
    .default('INTERNAL_INFRASTRUCTURE'),

  /**
   * NIVEL DE AUTORIDAD PONDERADA (Bayesian Confidence Level).
   * Determina el peso del voto/comentario en las estadísticas.
   */
  identityTrustWeightScore: z.number().min(0).max(1).default(0.1)
    .describe('Coeficiente algorítmico de credibilidad para el motor de impacto.'),

  /**
   * Rango de autoridad institucional (RBAC).
   * 🛡️ SANEADO: Sincronizado con el enum profesional.
   */
  assignedAuthorityRoleLiteral: UserAccessRoleSchema
    .default('CITIZEN_ANONYMOUS'),

  /** Estado de verificación legal (SRE Audit). */
  isIdentityLegallyVerifiedBoolean: z.boolean()
    .default(false)
    .describe('Indica si el perfil ha pasado por la auditoría documental.'),

  /** Registro inmutable de creación (ISO 8601). */
  occurrenceTimestampISO: z.string().datetime()
    .describe('Marca temporal del nacimiento de la identidad en la red.'),

}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IUserIdentity = z.infer<typeof UserIdentitySchema>;
