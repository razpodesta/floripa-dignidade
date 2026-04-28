/**
 * @section Messaging Logic - Unread Notifications Sensor
 * @description Orquestador encargado de obtener la cantidad de alertas pendientes.
 * Coordina la captura de infraestructura y delega el conteo técnico al enjambre.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Atomización completa y resolución de responsabilidad única.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 1. Enjambre Atómico de Soporte (Internal Swarm) */
import { FetchLedgerCount } from './FetchLedgerCount';

/** Identificador técnico del sensor para el Neural Sentinel. */
const NOTIFICATION_QUERY_IDENTIFIER = 'UNREAD_NOTIFICATIONS_COUNTER_ORCHESTRATOR';

/**
 * Recupera el número total de notificaciones no leídas para un ciudadano.
 * 
 * @param targetRecipientIdentifierLiteral - UUID del ciudadano bajo consulta.
 * @returns {Promise<number>} Cantidad de mensajes (0 a N).
 */
export const GetUnreadNotificationsCount = async (
  targetRecipientIdentifierLiteral: string
): Promise<number> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA (Sovereign Secrets)
  const {
    SUPABASE_URL: cloudUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    NOTIFICATION_QUERY_IDENTIFIER,
    'EXECUTE_UNREAD_COUNT_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 2. DELEGACIÓN AL SENSOR TÉCNICO (SRP Perfection)
        const unreadQuantityNumeric = await FetchLedgerCount(
          'system_notifications_ledger',
          `recipient_id=eq.${targetRecipientIdentifierLiteral}&interaction_status=eq.DELIVERED_UNREAD`,
          cloudUrlLiteral,
          cloudSecurityKeySecret
        );

        // 3. REPORTE DE SINCRONIZACIÓN (Audit Trail)
        void EmitTelemetrySignal({
          severityLevel: 'DEBUG',
          moduleIdentifier: NOTIFICATION_QUERY_IDENTIFIER,
          operationCode: 'NOTIFICATIONS_COUNT_SYNCED',
          correlationIdentifier,
          message: 'Sincronización de la campanita ciudadana finalizada.',
          contextMetadata: { unreadQuantityNumeric },
        });

        return unreadQuantityNumeric;

      } catch (caughtError: unknown) {
        // 4. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        const errorDescriptionLiteral = caughtError instanceof Error 
          ? caughtError.message 
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'ERROR',
          moduleIdentifier: NOTIFICATION_QUERY_IDENTIFIER,
          operationCode: 'NOTIFICATIONS_COUNT_FAULT',
          correlationIdentifier,
          message: 'Error al intentar sincronizar el contador de notificaciones.',
          contextMetadata: { errorTrace: errorDescriptionLiteral },
        });

        throw new InternalSystemException('FALLO_EN_CONSULTA_DE_NOTIFICACIONES_SRE', {
          originalError: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};