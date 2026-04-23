/**
 * @section Application Edge Middleware
 * @description Orquestador de frontera para la aplicación principal.
 * Intercepta solicitudes en el Edge de Vercel para gestionar localización,
 * seguridad y auditoría técnica antes del renderizado.
 *
 * Protocolo OEDP-V13.0 - Request Interception Shell.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { NextRequest } from 'next/server';
import { GlobalRequestOrchestrator } from '@floripa-dignidade/routing';

/**
 * Manejador de middleware estándar de Next.js.
 * Delega la lógica pesada al búnker soberano de ruteo para mantener la app
 * como una carcasa de ensamblaje pura.
 *
 * @param incomingRequest - Objeto de solicitud nativo de Next.js.
 */
export async function middleware(incomingRequest: NextRequest) {
  return await GlobalRequestOrchestrator(incomingRequest);
}

/**
 * Configuración de Emparejamiento (Matcher).
 * Define qué rutas deben ser procesadas por el sistema de ruteo internacionalizado.
 * Se excluyen activos estáticos, imágenes de marca y el búnker de API.
 */
export const config = {
  matcher: [
    /*
     * 1. Ignorar todas las rutas de API (/api)
     * 2. Ignorar archivos estáticos de Next.js (_next/static, _next/image)
     * 3. Ignorar recursos de branding y favicon
     */
    '/((?!api|_next/static|_next/image|brand|favicon.ico).*)',
  ],
};
