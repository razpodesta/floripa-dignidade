/**
 * @section Routing Logic - Route Authority Guardian
 * @description Aparato de vigilancia que valida la simetría entre la ruta solicitada
 * y el nivel de autoridad del ciudadano (RBAC).
 *
 * Protocolo OEDP-V13.0 - Atomic Security & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { ValidationException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';
import { UserAccessRole } from '@floripa-dignidade/identity';

/** Identificador técnico del guardián para trazabilidad forense. */
const AUTHORITY_SENTINEL_IDENTIFIER = 'ROUTE_AUTHORITY_SENTINEL';

/**
 * Mapeo Soberano de Rutas Protegidas.
 * Define el nivel de autoridad mínimo requerido para cada segmento.
 */
const ROUTE_PROTECTION_MANIFESTO: Record<string, UserAccessRole> = {
  '/administracion': 'SYSTEM_ADMINISTRATOR',
  '/auditoria': 'LEGAL_AUDITOR',
  '/gestion': 'CONTENT_MANAGER',
  '/perfil': 'REGISTERED_CITIZEN',
};

/**
 * Evalúa si el ciudadano posee la autoridad necesaria para transitar por la ruta.
 *
 * @param requestedPathnameLiteral - Ruta de destino capturada en el middleware.
 * @param citizenAccessRole - Nivel de autoridad actual del usuario.
 * @returns {boolean} Verdadero si el acceso es legítimo.
 * @throws {ValidationException} Si se detecta un intento de acceso no autorizado.
 */
export const ValidateRouteAuthority = (
  requestedPathnameLiteral: string,
  citizenAccessRole: UserAccessRole = 'ANONYMOUS_USER'
): boolean => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. Identificación de restricciones (Path Matching)
  const matchingRuleKey = Object.keys(ROUTE_PROTECTION_MANIFESTO).find(path =>
    requestedPathnameLiteral.startsWith(path)
  );

  if (!matchingRuleKey) return true; // Ruta pública nominal.

  const requiredAuthorityRole = ROUTE_PROTECTION_MANIFESTO[matchingRuleKey];

  // 2. Validación de Jerarquía y Permisos
  const hasAuthorityBoolean =
    citizenAccessRole === 'SYSTEM_ADMINISTRATOR' ||
    citizenAccessRole === requiredAuthorityRole;

  if (!hasAuthorityBoolean) {
    EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: AUTHORITY_SENTINEL_IDENTIFIER,
      operationCode: 'UNAUTHORIZED_ROUTE_ACCESS_ATTEMPT',
      correlationIdentifier,
      message: `Bloqueo de seguridad: [${citizenAccessRole}] intentó acceder a [${requestedPathnameLiteral}]`,
      contextMetadata: {
        requestedPath: requestedPathnameLiteral,
        requiredRole: requiredAuthorityRole,
        activeRole: citizenAccessRole
      }
    });

    throw new ValidationException('AUTORIDAD_INSUFICIENTE_PARA_RUTA', {
      requiredAuthorityRole,
      activeCitizenRole: citizenAccessRole
    });
  }

  return true;
};
