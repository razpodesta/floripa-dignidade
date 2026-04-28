/**
 * @section Messaging Logic - Inbox Consolidation Engine
 * @description Átomo de lógica pura que unifica, mapea y ordena cronológicamente 
 * las alertas y mensajes en una línea de tiempo única y soberana.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Polymorphic Mapping.
 */

import type { ISystemNotification } from '../../schemas/SystemNotification.schema';
import type { IDirectMessage } from '../../schemas/DirectMessage.schema';
import { 
  MapMessageToUnifiedEvent, 
  MapNotificationToUnifiedEvent,
  type IUnifiedCommunicationEvent 
} from './MapToUnifiedCommunicationEvent';

/**
 * Consolida un enjambre de señales en un flujo unificado para la UI.
 */
export const ConsolidateUnifiedInboxEvents = (
  notifications: ISystemNotification[],
  messages: IDirectMessage[]
): IUnifiedCommunicationEvent[] => {
  const unifiedEventsCollection: IUnifiedCommunicationEvent[] = [
    ...notifications.map(MapNotificationToUnifiedEvent),
    ...messages.map(MapMessageToUnifiedEvent),
  ];

  /** 
   * ORDENAMIENTO CRONOLÓGICO INVERSO (LIFO)
   * Garantiza que lo más reciente sea lo primero en el buzón.
   */
  return unifiedEventsCollection.sort(
    (eventA, eventB) => 
      new Date(eventB.timestampISO).getTime() - new Date(eventA.timestampISO).getTime()
  );
};