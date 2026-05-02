/**
 * @section PMF Engine Logic - Network Execution Atom
 * @description Átomo encargado exclusivamente de la comunicación física I/O
 * con los servidores de E-Pública bajo estándares SRE.
 *
 * Protocolo OEDP-V17.0 - Hardware Isolation & Network Resilience.
 * @author Raz Podestá - MetaShark Tech
 */

import { MapHttpErrorToException } from '@floripa-dignidade/exceptions';

/**
 * Ejecuta el fetch físico hacia el portal de transparencia.
 * Implementa un tiempo de espera soberano para evitar bloqueos en el Edge.
 *
 * @param requestUrlLiteral - URL completa generada por el builder.
 * @param correlationIdentifier - ID de trazabilidad forense.
 * @returns {Promise<Response>} Respuesta cruda del servidor gubernamental.
 * @throws {GlobalBaseException} Si la red o el protocolo fallan.
 */
export const ExecuteEPublicaNetworkRequest = async (
  requestUrlLiteral: string,
  correlationIdentifier: string
): Promise<Response> => {
  try {
    const networkResponse = await fetch(requestUrlLiteral, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Floripa-Dignidade-Auditor-Engine/1.0',
        'X-Correlation-ID': correlationIdentifier
      },
      /** SRE: Timeout de 20 segundos para resiliencia en el Edge */
      signal: AbortSignal.timeout(20000)
    });

    if (!networkResponse.ok) {
      throw MapHttpErrorToException(
        networkResponse.status,
        'PMF_ENGINE.ERRORS.NETWORK_CONNECTION_FAULT',
        { targetUrl: requestUrlLiteral, statusText: networkResponse.statusText }
      );
    }

    return networkResponse;

  } catch (caughtError: unknown) {
    /** Gestión específica de interrupción por tiempo de espera */
    if (caughtError instanceof Error && caughtError.name === 'AbortError') {
       throw MapHttpErrorToException(504, 'EXTERNAL_SERVICE_TIMEOUT', { requestUrlLiteral });
    }

    throw caughtError;
  }
};
