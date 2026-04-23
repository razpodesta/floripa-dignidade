/**
 * @section Root Entry Page
 * @description Detecta el idioma del dispositivo y ejecuta una redirección 307
 * hacia el prefijo localizado correspondiente.
 *
 * Protocolo OEDP-V13.0 - Atomic Redirector.
 */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DetermineDeviceLocale } from '@floripa-dignidade/routing';

export default async function RootPage() {
  // 1. Captura de metadatos de cabecera en el servidor
  const requestHeaders = await headers();
  const acceptLanguageHeaderLiteral = requestHeaders.get('accept-language');

  // 2. Inferencia de localización vía búnker de Routing
  const detectedLocaleIdentifier = DetermineDeviceLocale(acceptLanguageHeaderLiteral);

  /**
   * 3. Redirección Soberana
   * Se utiliza un código de estado temporal para permitir cambios de preferencia.
   */
  redirect(`/${detectedLocaleIdentifier}`);
}
