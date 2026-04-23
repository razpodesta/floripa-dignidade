/**
 * @section Social Media Kernel - Infrastructure Constants
 * Protocolo OEDP-V13.0 - Multi-Platform Orchestration
 */

/**
 * Identificadores de plataformas soportadas por el ecosistema.
 * Utilizado para el enrutamiento de publicaciones y escucha de eventos sociales.
 */
export const SOCIAL_MEDIA_PLATFORMS = {
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  THREADS: 'THREADS',
} as const;

/**
 * Tipo inferido para las plataformas de redes sociales.
 */
export type SocialMediaPlatform = keyof typeof SOCIAL_MEDIA_PLATFORMS;
