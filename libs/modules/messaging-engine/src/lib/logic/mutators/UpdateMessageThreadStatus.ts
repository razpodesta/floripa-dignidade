/**
 * @section Messaging Logic - Thread Status Persistence Atom
 * @description Átomo encargado exclusivamente de la actualización física del estado
 * de un hilo de conversación en el Tier de Datos.
 *
 * Protocolo OEDP-V16.0 - Hardware Isolation & Network Resilience.
 */

import { InternalSystemException } from '@floripa-dignidade/exceptions';
import type { ISovereignHeadersResult } from '../dispatchers/CreateSovereignDatabaseHeaders';

/**
 * Ejecuta la mutación de estado sobre un hilo filtrando por autoridad de actor.
 * 
 * @param cloudUrl - Endpoint REST de la base de datos.
 * @param headers - Cabeceras de seguridad soberanas.
 * @param threadId - UUID del hilo objetivo.
 * @param actorId - UUID del ciudadano para validación de propiedad (RLS preventivo).
 * @param targetStatus - Nuevo estado (ej: ARCHIVED_BY_USER).
 * @param correlationId - ID de trazabilidad forense.
 */
export const UpdateMessageThreadStatus = async (
  cloudUrl: string,
  headers: ISovereignHeadersResult,
  threadId: string,
  actorId: string,
  targetStatus: string,
  correlationId: string
): Promise<void> => {
  const outgoingResponse = await fetch(
    `${cloudUrl}/rest/v1/direct_messages_ledger?thread_id=eq.${threadId}&or=(sender_id.eq.${actorId},recipient_id.eq.${actorId})`,
    {
      method: 'PATCH',
      headers: { ...headers },
      body: JSON.stringify({
        current_status: targetStatus,
        mutation_correlation_id: correlationId,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  if (!outgoingResponse.ok) {
    throw new InternalSystemException('FALLO_FISICO_MUTACION_HILO', {
      httpStatus: outgoingResponse.status,
      threadIdentifier: threadId
    });
  }
};