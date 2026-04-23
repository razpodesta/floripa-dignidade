import { z } from 'zod';

/**
 * @section Identity Sovereignty - Access Control
 * @description Niveles de autoridad inmutables definidos mediante esquema soberano.
 */
export const UserAccessRoleSchema = z.enum([
  'SYSTEM_ADMINISTRATOR', // Acceso total a infraestructura y auditoría.
  'LEGAL_AUDITOR',        // Acceso a denuncias y trazabilidad forense.
  'CONTENT_MANAGER',      // Gestión de noticias y comunicaciones.
  'REGISTERED_CITIZEN',   // Ciudadano con identidad verificada.
  'ANONYMOUS_USER',       // Identidad temporal para procesos de reporte.
]).describe('Jerarquía de roles de acceso soberanos de Floripa Dignidade');

/** Tipo inferido para guardias de seguridad y validación de tipos. */
export type UserAccessRole = z.infer<typeof UserAccessRoleSchema>;
