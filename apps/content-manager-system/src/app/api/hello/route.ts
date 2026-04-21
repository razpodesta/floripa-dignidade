/**
 * @section API Route Handler - CMS Health Probe
 * Protocolo OEDP-V13.0
 */

/**
 * Manejador de solicitudes GET para el endpoint de verificación del CMS.
 * Proporciona una señal de vida (Heartbeat) para el sistema de gestión de contenidos,
 * permitiendo que el Infrastructure Vigilant confirme la disponibilidad del servicio.
 *
 * @param {Request} _request - Objeto de solicitud entrante (Ignorado intencionalmente).
 * @returns {Promise<Response>} Respuesta de texto plano con estado 200.
 */
export const GET = async (_request: Request): Promise<Response> => {
  return new Response('Hello from Content Manager System API!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'X-Robots-Tag': 'noindex',
    },
  });
};
