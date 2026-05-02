/**
 * @section Messaging Logic - Hardware Sensor Atom
 * @description Analisa o User Agent para identificar a plataforma de origem do sinal.
 *
 * Protocolo OEDP-V17.0 - Hardware Isolation.
 */

/**
 * Identifica se a execução ocorre em um dispositivo móvel ou desktop.
 * Retorna identificadores compatíveis com o esquema 'DevicePlatformSchema'.
 */
export const DetermineDevicePlatform = (): 'PWA_MOBILE_ANDROID' | 'WEB_DESKTOP' => {
  if (typeof navigator === 'undefined') {
    return 'WEB_DESKTOP';
  }

  const isMobileBoolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return isMobileBoolean ? 'PWA_MOBILE_ANDROID' : 'WEB_DESKTOP';
};
