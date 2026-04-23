/**
 * @section Root Not Found Handler
 * @description Captura errores 404 fuera de los prefijos de idioma y reubica
 * al ciudadano en la página de inicio de su idioma detectado.
 *
 * Protocolo OEDP-V13.0 - Smart Resilience.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DetermineDeviceLocale } from '@floripa-dignidade/routing';

export default async function RootNotFound() {
  const requestHeaders = await headers();
  const acceptLanguageHeaderLiteral = requestHeaders.get('accept-language');

  const detectedLocaleIdentifier = DetermineDeviceLocale(acceptLanguageHeaderLiteral);

  // Redirigimos al inicio del idioma detectado en lugar de mostrar una página vacía.
  redirect(`/${detectedLocaleIdentifier}`);
}
