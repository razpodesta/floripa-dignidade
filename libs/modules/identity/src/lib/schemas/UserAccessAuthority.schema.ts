/**
 * @section Identity DNA - User Access Authority Schema
 * @description Define la jerarquía de autoridad soberana y el contrato de identidad
 * para el ecosistema Floripa Dignidade. Implementa soporte para multi-tenancy
 * y auditoría forense de infraestructura.
 *
 * Protocolo OEDP-V13.0 - ISO/IEC 11179 (Object + Property + Representation).
 * @author Raz  Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * Jerarquía de Niveles de Autoridad.
 * Nomenclatura profesional que describe la capacidad de actuación de la entidad.
 */
export const UserAccessRoleSchema = z.enum([
  'INFRASTRUCTURE_SOVEREIGN_AUDITOR', // Grado Técnico Máximo (God Mode)
  'PLATFORM_GLOBAL_MANAGER',           // Gestión Soberana de la ONG Madre
  'ORGANIZATION_ADMINISTRATOR',        // Administrador de una ONG anidada
  'ORGANIZATION_OPERATOR',             // Personal operativo / Editor de ONG anidada
  'CITIZEN_REGISTERED',                // Ciudadano con identidad validada
  'CITIZEN_ANONYMOUS'                  // Identidad temporal para denuncias iniciales
]).describe('Identificadores soberanos de rango de autoridad institucional.');

export type UserAccessRole = z.infer<typeof UserAccessRoleSchema>;

/**
 * @name UserIdentitySchema
 * @description Contrato maestro de identidad ciudadana e institucional.
 */
export const UserIdentitySchema = z.object({
  /** Identificador único universal con tipado nominal para integridad de datos. */
  identityIdentifier: z.string().uuid().brand<'UserIdentifier'>(),

  fullLegalNameLiteral: z.string()
    .min(3)
    .describe('Nombre y apellidos según registro civil oficial.'),

  electronicMailAddressLiteral: z.string().email()
    .describe('Dirección de correo electrónico validada para comunicaciones legales.'),

  assignedAuthorityRole: UserAccessRoleSchema
    .default('CITIZEN_ANONYMOUS'),

  /**
   * Identificador de la Entidad Organizacional (Tenant).
   * Permite el aislamiento de datos entre ONGs anidadas.
   */
  tenantOrganizationIdentifier: z.string().uuid().nullable()
    .describe('Vínculo físico con la organización a la que pertenece la identidad.'),

  /** Estados de Verificación (Boolean Suffix Standard) */
  isIdentityLegallyVerifiedBoolean: z.boolean().default(false)
    .describe('Indica si el proceso de validación documental ha finalizado con éxito.'),

  isSovereignEmergencyPowerActiveBoolean: z.boolean().default(false)
    .describe('Estado volátil que indica la activación del bypass de infraestructura.'),

}).readonly();

export type IUserIdentity = z.infer<typeof UserIdentitySchema>;
