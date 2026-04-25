/**
 * @section Routing - Authority Governance Manifesto
 * @description Define el mapa de acceso y los niveles de autoridad requeridos para cada
 * segmento del portal. Actúa como el 'Ground Truth' para el Route Authority Sentinel.
 *
 * Protocolo OEDP-V13.0 - Sovereign Data & ISO Standard Naming.
 */

/**
 * Espejo Local de Rangos de Autoridad (Mirror de Identity).
 * Saneamiento: Evita violaciones de Boundary entre 'core' y 'modules'.
 */
export type SovereignAuthorityRoleLiteral =
  | 'INFRASTRUCTURE_SOVEREIGN_AUDITOR'
  | 'PLATFORM_GLOBAL_MANAGER'
  | 'ORGANIZATION_ADMINISTRATOR'
  | 'ORGANIZATION_OPERATOR'
  | 'CITIZEN_REGISTERED'
  | 'CITIZEN_ANONYMOUS';

/**
 * Manifiesto de Protección de Rutas.
 * Mapeo de prefijos de ruta a roles de autoridad institucional.
 */
export const ROUTE_PROTECTION_MANIFESTO: Record<string, SovereignAuthorityRoleLiteral> = {
  '/administracion': 'PLATFORM_GLOBAL_MANAGER',
  '/auditoria': 'INFRASTRUCTURE_SOVEREIGN_AUDITOR',
  '/gestion': 'ORGANIZATION_OPERATOR',
  '/perfil': 'CITIZEN_REGISTERED',
} as const;
