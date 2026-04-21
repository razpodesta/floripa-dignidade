/**
 * @section API Route Handler - Sonda de Disponibilidad
 * Protocolo OEDP-V13.0
 */

/**
 * Manejador de solicitudes GET para el endpoint de prueba.
 * Actúa como un "Ping" básico para verificar que el servidor de la aplicación
 * principal esté respondiendo correctamente a las peticiones HTTP.
 *
 * @param {Request} _request - Objeto de solicitud entrante (Ignorado intencionalmente).
 * @returns {Promise<Response>} Respuesta de texto plano con estado 200.
 */
export const GET = async (_request: Request): Promise<Response> => {
  return new Response('Hello from Floripa Dignidade API!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'X-Robots-Tag': 'noindex',
    },
  });
};
