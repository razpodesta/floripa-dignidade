/**
 * @section Messaging Logic - Group Persistence Dispatcher
 * @description Átomo encargado exclusivamente de la inserción física del grupo 
 * en el Ledger Cloud. Implementa el protocolo Stateless para el Edge.
 *
 * Protocolo OEDP-V16.0 - Hardware Isolation & Network Resilience.
 */

import { InternalSystemException } from '@floripa-dignidade/exceptions';
import { CreateSovereignDatabaseHeaders } from './CreateSovereignDatabaseHeaders';

/**
 * Ejecuta la transacción física de creación de un Action Hub.
 */
export const PersistCommunicationGroup = async (
  cloudUrl: string,
  cloudKey: string,
  mappedPayload: Record<string, unknown>
): Promise<void> => {
  const outgoingResponse = await fetch(`${cloudUrl}/rest/v1/communication_groups_ledger`, {
    method: 'POST',
    headers: {
      ...CreateSovereignDatabaseHeaders(cloudKey, 'representation')
    },
    body: JSON.stringify(mappedPayload),
  });

  if (!outgoingResponse.ok) {
    throw new InternalSystemException('FALLO_FISICO_PERSISTENCIA_GRUPO', {
      httpStatus: outgoingResponse.status,
      statusText: outgoingResponse.statusText
    });
  }
};