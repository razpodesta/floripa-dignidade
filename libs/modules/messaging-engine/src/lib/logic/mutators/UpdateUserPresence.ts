/**
 * @section Messaging Logic - User Presence Heartbeat Mutator
 * @description Átomo encargado de actualizar el pulso de vida y el estado
 * de disponibilidad del ciudadano. Gestiona el registro de tokens de 
 * dispositivos para la entrega de notificaciones Push (PWA).
 *
 * Protocolo OEDP-V16.0 - High Performance & Real-time SRE.
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 1. ADN de Presencia (Verbatim Module Syntax) */
import { UserPresenceSchema } from '../../schemas/UserPresence.schema';
import type { IUserPresence } from '../../schemas/UserPresence.schema';

/** Identificador técnico del sensor de vida. */
const PRESENCE_MUTATOR_IDENTIFIER = 'CITIZEN_PRESENCE_HEARTBEAT_MUTATOR';

/**
 * Ejecuta la actualización del estado de presencia en el Tier de Datos.
 * Implementa una estrategia 'Upsert' para mantener un único registro por ciudadano.
 *
 * @param unvalidatedPresencePayloadSnapshot - Snapshot del estado actual del cliente.
 * @returns {Promise<boolean>} Verdadero si el pulso fue recibido por la nube.
 */
export const UpdateUserPresence = async (
  unvalidatedPresencePayloadSnapshot: unknown
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA
  const {
    SUPABASE_URL: cloudUrl,
    SUPABASE_SERVICE_ROLE_KEY: cloudKey,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    PRESENCE_MUTATOR_IDENTIFIER,
    'EXECUTE_PRESENCE_HEARTBEAT_UPDATE',
    correlationIdentifier,
    async () => {
      try {
        // 2. ADUANA DE ADN (Safe Parsing)
        const validationResult = UserPresenceSchema.safeParse(unvalidatedPresencePayloadSnapshot);

        if (!validationResult.success) {
          throw new Error('PRESENCE_CONTRACT_VIOLATION');
        }

        const validatedPresenceData: IUserPresence = validationResult.data;

        /**
         * 3. PERSISTENCIA CLOUD (PostgREST Upsert Protocol)
         * Actualiza el estado y el token de dispositivo. El campo 'on_conflict' 
         * asegura que solo exista un registro de presencia por ciudadano.
         */
        const cloudResponse = await fetch(`${cloudUrl}/rest/v1/user_presence_ledger`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': cloudKey,
            'Authorization': `Bearer ${cloudKey}`,
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            citizen_id: validatedPresenceData.citizenIdentifier,
            availability_status: validatedPresenceData.currentAvailabilityStatus,
            custom_status_text: validatedPresenceData.customStatusMessageLiteral,
            platform_type: validatedPresenceData.lastActivePlatformLiteral,
            push_token: validatedPresenceData.activePushSubscriptionTokenSecret,
            last_heartbeat_at: validatedPresenceData.lastHeartbeatTimestampISO,
            correlation_id: correlationIdentifier,
          }),
        });

        if (!cloudResponse.ok) {
          throw new Error(`DATABASE_PROVIDER_FAULT_${cloudResponse.status}`);
        }

        // 4. REPORTE SRE (Vigilancia de Conectividad)
        EmitTelemetrySignal({
          severityLevel: 'DEBUG',
          moduleIdentifier: PRESENCE_MUTATOR_IDENTIFIER,
          operationCode: 'HEARTBEAT_NOMINAL',
          correlationIdentifier,
          message: `Ciudadano [${validatedPresenceData.citizenIdentifier}] sincronizado en [${validatedPresenceData.currentAvailabilityStatus}].`,
          contextMetadata: { platform: validatedPresenceData.lastActivePlatformLiteral }
        });

        return true;

      } catch (caughtError: unknown) {
        throw new InternalSystemException('FALLO_EN_SINCRONIZACION_DE_PRESENCIA_SRE', {
          originalErrorLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError),
          correlationIdentifier,
        });
      }
    }
  );
};