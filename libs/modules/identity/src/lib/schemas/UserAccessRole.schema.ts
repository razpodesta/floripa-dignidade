/**
 * @section Identity DNA - Global Access Role Hierarchy
 * @description Define la jerarquía de autoridad inmutable para todo el ecosistema.
 * Establece los rangos de actuación permitidos, desde la auditoría de
 * infraestructura hasta la participación ciudadana anónima.
 *
 * Protocolo OEDP-V16.0 - ISO Standard Naming & SSOT.
 * SANEADO Zenith: Nivelación profesional de roles para simetría con CMS y Routing.
 */

import { z } from 'zod';

/**
 * @name UserAccessRoleSchema
 * @description Catálogo soberano de roles institucionales.
 * Cualquier cambio aquí se propaga automáticamente a Identity, Routing y Reputation.
 */
export const UserAccessRoleSchema = z.enum([
  'INFRASTRUCTURE_SOVEREIGN_AUDITOR', // Control total de SRE y Seguridad.
  'PLATFORM_GLOBAL_MANAGER',           // Gestión administrativa de la ONG.
  'ORGANIZATION_ADMINISTRATOR',        // Administrador de entes aliados.
  'ORGANIZATION_OPERATOR',             // Operador de impacto y noticias.
  'CITIZEN_REGISTERED',                // Ciudadano con identidad verificada.
  'CITIZEN_ANONYMOUS'                  // Identidad temporal para procesos de inicio.
]).describe('Jerarquía técnica de autoridad de Floripa Dignidade.');

/** 🛡️ ADN Tipado para exportación Verbatim */
export type UserAccessRole = z.infer<typeof UserAccessRoleSchema>;
