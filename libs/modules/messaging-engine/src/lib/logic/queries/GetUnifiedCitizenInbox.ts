/**
 * @section Messaging Logic - Unified Citizen Inbox Orchestrator
 * @description Orquestador superior encargado de coordinar la recuperación y 
 * consolidación de la bandeja de entrada del ciudadano.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Atomización completa y unificación de flujo cronológico.
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

/* 1. ADN de Dominio (Verbatim Module Syntax) */
import type { ISystemNotification } from '../../schemas/SystemNotification.schema';
import type { IDirectMessage } from '../../schemas/DirectMessage.schema';
import type { IUnifiedCommunicationEvent } from '../mappers/MapToUnifiedCommunicationEvent';

/* 2. Enjambre de Átomos Especializados */
import { FetchMessagingLedgerData } from './FetchMessagingLedgerData';
import { ConsolidateUnifiedInboxEvents } from '../mappers/ConsolidateUnifiedInboxEvents';

/**
 * @interface IUnifiedInboxSnapshot
 * @description Contrato de salida con rastro de sincronización.
 */
export interface IUnifiedInboxSnapshot {
  readonly unifiedTimelineCollection: IUnifiedCommunicationEvent[];
  readonly metadata: {
    readonly totalItemsQuantity: number;
    readonly synchronizationTimestampISO: string;
  };
}

/** Identificador técnico para el Neural Sentinel. */
const INBOX_ORCHESTRATOR_IDENTIFIER = 'UNIFIED_INBOX_ORCHESTRATOR';

/**
 * Recupera el estado íntegro y unificado del buzón del ciudadano.
 * 
 * @param targetCitizenIdentifierLiteral - UUID del ciudadano bajo consulta.
 * @param limitQuantity - Cantidad de elementos por flujo (Paginación).
 * @returns {Promise<IUnifiedInboxSnapshot>} Snapshot inmutable del buzón.
 */
export const GetUnifiedCitizenInbox = async (
  targetCitizenIdentifierLiteral: string,
  limitQuantity = 20
): Promise<IUnifiedInboxSnapshot> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA (Aislamiento)
  const { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    INBOX_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_UNIFIED_INBOX_SWARM',
    correlationIdentifier,
    async () => {
      try {
        // 2. EXTRACCIÓN PARALELA (Performance Optimization)
        const [rawNotifications, rawMessages] = await Promise.all([
          FetchMessagingLedgerData<ISystemNotification>(
            'system_notifications_ledger',
            `recipient_id=eq.${targetCitizenIdentifierLiteral}&interaction_status=neq.TRASHED_DELETED&order=dispatch_timestamp.desc`,
            url, key, limitQuantity
          ),
          FetchMessagingLedgerData<IDirectMessage>(
            'direct_messages_ledger',
            `or=(sender_id.eq.${targetCitizenIdentifierLiteral},recipient_id.eq.${targetCitizenIdentifierLiteral})&current_status=neq.TRASHED_DELETED&order=transmission_timestamp.desc`,
            url, key, limitQuantity
          )
        ]);

        // 3. CONSOLIDACIÓN (Lógica Polimórfica)
        const unifiedTimeline = ConsolidateUnifiedInboxEvents(rawNotifications, rawMessages);

        // 4. REPORTE DE ÉXITO SRE
        EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: INBOX_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'INBOX_SYNCHRONIZED_NOMINAL',
          correlationIdentifier,
          message: 'Buzón unificado y cronológico generado con éxito.',
          contextMetadata: { 
            totalItems: unifiedTimeline.length,
            targetCitizen: targetCitizenIdentifierLiteral 
          }
        });

        return {
          unifiedTimelineCollection: unifiedTimeline,
          metadata: {
            totalItemsQuantity: unifiedTimeline.length,
            synchronizationTimestampISO: new Date().toISOString(),
          }
        };

      } catch (caughtError: unknown) {
        throw new InternalSystemException('FALLO_EN_ORQUESTACION_DE_BUZON_UNIFICADO', {
          originalError: caughtError instanceof Error ? caughtError.message : String(caughtError),
          correlationIdentifier,
        });
      }
    }
  );
};