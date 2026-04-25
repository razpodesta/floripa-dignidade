/**
 * @section Identity Logic - Authority Validation
 * @description Valida si una identidad cumple con los requisitos de rango para una operación.
 *
 * Protocolo OEDP-V14.0 - Verbatim Module Syntax.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import { ValidationException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/** 🛡️ SANEAMIENTO Zenith: Importación de ADN como tipo puro */
import type { UserAccessRole } from '../schemas/UserAccessRole.schema';
import type { IUserIdentity } from '../schemas/UserIdentity.schema';
import { UserIdentitySchema } from '../schemas/UserIdentity.schema';

const IDENTITY_MODULE_IDENTIFIER = 'IDENTITY_ACCESS_SENTRY';

/**
 * Verifica si la identidad proporcionada posee el rol requerido.
 *
 * @param rawUserIdentityData - Datos de identidad pendientes de validación.
 * @param requiredAccessRole - Nivel de autoridad mínimo solicitado.
 * @returns Identidad validada y purificada.
 */
export const ValidateUserAccess = (
  rawUserIdentityData: unknown,
  requiredAccessRole: UserAccessRole,
): IUserIdentity => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  const validationResult = UserIdentitySchema.safeParse(rawUserIdentityData);

  if (!validationResult.success) {
    const errorCodeLiteral = 'ADN_IDENTIDAD_CORRUPTO';

    EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: IDENTITY_MODULE_IDENTIFIER,
      operationCode: 'IDENTITY_SCHEMA_VIOLATION',
      correlationIdentifier,
      message: 'Los datos de identidad no cumplen el contrato técnico.',
      contextMetadata: {
        validationErrors: validationResult.error.flatten()
      },
    });

    throw new ValidationException(errorCodeLiteral, {
      identityValidationIssues: validationResult.error.flatten(),
    });
  }

  const authenticatedIdentity = validationResult.data;

  const hasRequiredAuthority =
    authenticatedIdentity.assignedAccessRole === requiredAccessRole ||
    authenticatedIdentity.assignedAccessRole === 'SYSTEM_ADMINISTRATOR';

  if (!hasRequiredAuthority) {
    const errorCodeLiteral = 'ACCESO_NO_AUTORIZADO';

    EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: IDENTITY_MODULE_IDENTIFIER,
      operationCode: 'UNAUTHORIZED_AUTHORITY_ATTEMPT',
      correlationIdentifier,
      message: `Intento de acceso no autorizado por el ciudadano: ${authenticatedIdentity.identifier}`,
      contextMetadata: {
        requiredAccessRole,
        currentCitizenRole: authenticatedIdentity.assignedAccessRole
      },
    });

    throw new ValidationException(errorCodeLiteral, {
      requiredAccessRole,
      citizenIdentifier: authenticatedIdentity.identifier,
    });
  }

  return authenticatedIdentity;
};
