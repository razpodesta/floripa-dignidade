/**
 * @section Messaging Logic - User Presence Heartbeat Mutator
 * @description Orquestador encargado de validar y persistir el pulso de vida.
 * Asegura la integridad del contrato de presencia antes del volcado al Ledger.
 *
 * Protocolo OEDP-V17.0 - High Performance & Atomic Responsibility.
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

import { UserPresenceSchema } from '../../schemas/UserPresence.schema';
import type { IUserPresence } from '../../schemas/UserPresence.schema';

const MUTATOR_IDENTIFIER = 'CITIZEN_PRESENCE_HEARTBEAT_MUTATOR';

/**
 * Ejecuta la actualización soberana del estado de presencia.
 * @param unvalidatedPayload - Datos crudos provenientes del pulso del cliente.
 */
export const UpdateUserPresence = async (
  unvalidatedPayload: unknown
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    MUTATOR_IDENTIFIER,
    'PRESENCE_HEARTBEAT_SYNC',
    correlationIdentifier,
    async () => {
      // 1. ADUANA DE ADN (Validación de Contrato)
      const validation = UserPresenceSchema.safeParse(unvalidatedPayload);

      if (!validation.success) {
        throw new InternalSystemException('PRESENCE_DNA_VIOLATION', {
          correlationIdentifier,
          validationErrors: validation.error.format(),
          intent: 'VALIDATE_PRESENCE_PAYLOAD'
        });
      }

      const validatedData = validation.data;

      try {
        // 2. PERSISTENCIA (Protocolo PostgREST Upsert)
        // Atomizamos la construcción del recurso para evitar errores de mapeo.
        const ledgerPayload = MapPresenceToLedger(validatedData, correlationIdentifier);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/user_presence_ledger`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify(ledgerPayload),
        });

        if (!response.ok) {
          throw new Error(`LEDGER_REJECTION_HTTP_${response.status}`);
        }

        // 3. REPORTE SRE
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: MUTATOR_IDENTIFIER,
          operationCode: 'HEARTBEAT_ACKNOWLEDGED',
          correlationIdentifier,
          message: 'Pulso de vida sincronizado con el Ledger.',
          contextMetadataSnapshot: { 
            citizenId: validatedData.citizenIdentifier,
            status: validatedData.currentAvailabilityStatus 
          }
        });

        return true;

      } catch (caughtError: unknown) {
        throw new InternalSystemException('PRESENCE_SYNC_FAILED', {
          correlationIdentifier,
          originalError: caughtError instanceof Error ? caughtError.message : String(caughtError),
          citizenId: validatedData.citizenIdentifier
        });
      }
    }
  );
};

/**
 * 🔒 ATOMIZACIÓN PRIVADA: Mapeador de Infraestructura.
 * Traduce el modelo de dominio al modelo de persistencia (snake_case).
 */
const MapPresenceToLedger = (data: IUserPresence, correlationId: string) => ({
  citizen_id: data.citizenIdentifier,
  availability_status: data.currentAvailabilityStatus,
  custom_status_text: data.customStatusMessageLiteral,
  platform_type: data.lastActivePlatformLiteral,
  push_token: data.activePushSubscriptionTokenSecret,
  last_heartbeat_at: data.lastHeartbeatTimestampISO,
  correlation_id: correlationId,
});