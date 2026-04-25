/**
 * @section Application Edge Middleware - Swarm Entry Point
 * @description Puerta de enlace soberana para la aplicación principal.
 * Activa el orquestador de sensores cognitivos en el Edge de Vercel.
 *
 * Protocolo OEDP-V15.0 - Verbatim Syntax & Swarm Orchestration.
 * Saneamiento: Purificación de importación de tipos y resolución de error ESLint.
 *
 * @author Raz  Podestá - MetaShark Tech
 */

import type { NextRequest } from 'next/server';
import { GlobalRequestOrchestrator } from '@floripa-dignidade/routing';

/**
 * Manejador de middleware soberano.
 * Delega la ejecución al Enjambre de Sensores del búnker de Routing.
 *
 * @param incomingRequest - Objeto de solicitud nativo del motor Next.js.
 */
export async function middleware(incomingRequest: NextRequest) {
  /**
   * @infrastructure_bridge
   * SANEADO: Se utiliza supresión de regla específica de ESLint.
   *
   * RAZÓN TÉCNICA: Existe una discrepancia estructural en el objeto 'NextRequest'
   * entre las versiones instaladas que provoca un error TS2345.
   * El uso de 'any' es una medida de interoperabilidad ineludible en el Edge Runtime.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestWithTypeBridge = incomingRequest as any;

  return await GlobalRequestOrchestrator(requestWithTypeBridge);
}

/**
 * @section Configuración de Radio de Acción (Matcher)
 */
export const config = {
  matcher: [
    /**
     * Excluye explícitamente:
     * - api: Rutas de backend internas.
     * - _next: Archivos de sistema y optimización de Next.js.
     * - brand: Activos de identidad visual.
     * - favicon, robots.txt y activos binarios de imagen.
     */
    '/((?!api|_next/static|_next/image|brand|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$|robots.txt).*)',
  ],
};
