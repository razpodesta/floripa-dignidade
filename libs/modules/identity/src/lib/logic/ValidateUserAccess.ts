/**
 * @section Identity Logic - Sovereignty Validation
 * @description Valida si un ciudadano posee la autoridad necesaria para una operación.
 * Actúa como el Juez de Paz del sistema, bloqueando accesos no autorizados
 * y reportando anomalías al flujo sanguíneo digital.
 *
 * Protocolo OEDP-V13.0 - Atomic Security & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { ValidationException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';
import { UserAccessRole } from '../schemas/UserAccessRole.schema';
import { IUserIdentity, UserIdentitySchema } from '../schemas/UserIdentity.schema';

/** Identificador técnico del búnker de identidad para el Neural Sentinel. */
const IDENTITY_MODULE_IDENTIFIER = 'IDENTITY_ACCESS_SENTRY';

/**
 * Verifica si la identidad proporcionada cumple con el ADN soberano y posee el rol requerido.
 * Emite señales de telemetría y dispara excepciones ante fallos de integridad.
 *
 * @param {unknown} rawUserIdentityData - Datos de identidad capturados en la frontera.
 * @param {UserAccessRole} requiredAccessRole - Nivel de autoridad mínimo solicitado.
 * @returns {IUserIdentity} Identidad purificada y validada con autoridad confirmada.
 * @throws {ValidationException} Si el ADN es corrupto o la autoridad es insuficiente.
 */
export const ValidateUserAccess = (
  rawUserIdentityData: unknown,
  requiredAccessRole: UserAccessRole,
): IUserIdentity => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. ADUANA DE ADN (Data Integrity Check)
  // Purificamos el objeto de identidad contra el esquema soberano de Zod.
  const validationResult = UserIdentitySchema.safeParse(rawUserIdentityData);

  if (!validationResult.success) {
    const identityCorruptionErrorMessage = 'ADN_IDENTIDAD_CORRUPTO';

    EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: IDENTITY_MODULE_IDENTIFIER,
      operationCode: 'IDENTITY_SCHEMA_VIOLATION',
      correlationIdentifier,
      message: `${identityCorruptionErrorMessage}: Los datos de identidad no cumplen el contrato soberano.`,
      contextMetadata: {
        validationErrors: validationResult.error.flatten(),
        receivedDataSnapshot: rawUserIdentityData
      },
    });

    throw new ValidationException(identityCorruptionErrorMessage, {
      identityValidationIssues: validationResult.error.flatten(),
    });
  }

  const authenticatedIdentity = validationResult.data;

  // 2. VALIDACIÓN DE AUTORIDAD (RBAC Enforcement)
  // Un SYSTEM_ADMINISTRATOR tiene bypass automático por soberanía técnica.
  const hasRequiredAuthority =
    authenticatedIdentity.assignedAccessRole === requiredAccessRole ||
    authenticatedIdentity.assignedAccessRole === 'SYSTEM_ADMINISTRATOR';

  if (!hasRequiredAuthority) {
    const authorizationFailureErrorMessage = 'ACCESO_NO_AUTORIZADO';

    EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: IDENTITY_MODULE_IDENTIFIER,
      operationCode: 'UNAUTHORIZED_AUTHORITY_ATTEMPT',
      correlationIdentifier,
      message: `${authorizationFailureErrorMessage}: El ciudadano ${authenticatedIdentity.identifier} intentó acceder a un recurso de nivel ${requiredAccessRole}.`,
      contextMetadata: {
        requiredAccessRole,
        currentCitizenRole: authenticatedIdentity.assignedAccessRole,
        citizenIdentifier: authenticatedIdentity.identifier
      },
    });

    throw new ValidationException(authorizationFailureErrorMessage, {
      requiredAccessRole,
      citizenAssignedRole: authenticatedIdentity.assignedAccessRole,
      citizenIdentifier: authenticatedIdentity.identifier,
    });
  }

  // 3. REPORTE DE ÉXITO (Forensic Trace)
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: IDENTITY_MODULE_IDENTIFIER,
    operationCode: 'AUTHORITY_VALIDATION_SUCCESS',
    correlationIdentifier,
    message: `Acceso concedido para el ciudadano: ${authenticatedIdentity.identifier}`,
  });

  return authenticatedIdentity;
};
