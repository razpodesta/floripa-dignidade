/**
 * @section Identity DNA - User Access Authority Schema
 * @description Define la jerarquía de autoridad institucional y el contrato de 
 * identidad soberana para el ecosistema. Orquesta el soporte para multi-tenancy, 
 * RBAC y auditoría forense de infraestructura.
 * 
 * Protocolo OEDP-V16.0 - ISO Standard Naming & Data Sovereignty.
 * SANEADO Zenith: Estandarización de 'assignedAuthorityRoleLiteral' para 
 * resolución de error TS2551 en el motor de mensajería.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * Jerarquía de Niveles de Autoridad Institucional.
 * Define la capacidad de actuación de cada identidad en el enjambre.
 */
export const UserAccessRoleSchema = z.enum([
  'INFRASTRUCTURE_SOVEREIGN_AUDITOR', // Control total de SRE y Seguridad.
  'PLATFORM_GLOBAL_MANAGER',           // Gestión administrativa de la ONG.
  'ORGANIZATION_ADMINISTRATOR',        // Administrador de entes aliados.
  'ORGANIZATION_OPERATOR',             // Operador de impacto y noticias.
  'CITIZEN_REGISTERED',                // Ciudadano con identidad verificada.
  'CITIZEN_ANONYMOUS'                  // Identidad temporal para procesos iniciales.
]).describe('Identificadores soberanos de rango de autoridad institucional.');

/** 🛡️ ADN Tipado para exportación Verbatim */
export type UserAccessRole = z.infer<typeof UserAccessRoleSchema>;

/**
 * @name UserIdentitySchema
 * @description Contrato maestro de identidad ciudadana e institucional.
 * Actúa como la Única Fuente de Verdad (SSOT) para perfiles y auditoría civil.
 */
export const UserIdentitySchema = z.object({
  
  /** Identificador único universal con tipado nominal para integridad de datos. */
  identityIdentifier: z.string().uuid().brand<'UserIdentifier'>(),

  /** Nombre y apellidos según registro civil oficial o proveedor social. */
  fullLegalNameLiteral: z.string()
    .min(3)
    .describe('Nombre legal completo para procesos de transparencia.'),

  /** Dirección de contacto principal validada. */
  electronicMailAddressLiteral: z.string().email()
    .describe('Dirección de correo electrónico vinculada a la cuenta soberana.'),

  /** 
   * Rango de autoridad institucional (RBAC). 
   * SANEADO Zenith: Renombrado para cumplimiento de norma ISO de literales.
   */
  assignedAuthorityRoleLiteral: UserAccessRoleSchema
    .default('CITIZEN_ANONYMOUS'),

  /**
   * Identificador de la Entidad Organizacional (Tenant).
   * Permite el aislamiento físico de datos entre ONGs anidadas.
   */
  tenantOrganizationIdentifier: z.string().uuid().nullable()
    .describe('Vínculo físico con la organización a la que pertenece la identidad.'),

  /** 
   * Estados de Verificación SRE.
   * Indica si el perfil ha pasado por la auditoría documental humana.
   */
  isIdentityLegallyVerifiedBoolean: z.boolean().default(false)
    .describe('Indica si el proceso de validación documental ha finalizado con éxito.'),

  /** 
   * Estado volátil que indica la activación del bypass de infraestructura. 
   */
  isSovereignEmergencyPowerActiveBoolean: z.boolean().default(false)
    .describe('Bandera de activación de privilegios de emergencia.'),

}).readonly();

/** 🛡️ ADN Tipado para exportación Verbatim */
export type IUserIdentity = z.infer<typeof UserIdentitySchema>;