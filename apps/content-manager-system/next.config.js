// @ts-check
/**
 * @section Next.js Configuration - CMS Shell (Payload 3.0)
 * Protocolo OEDP-V16.0 - ESM-First Architecture & Type Parity.
 * SANEADO Zenith: Resolución de TS2353 (Nx Override) y TS7006 (Implicit Any).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { composePlugins, withNx } from '@nx/next';
import { withPayload } from '@payloadcms/next/withPayload';

/**
 * @name nextConfigurationFoundation
 * @description ADN base de la aplicación.
 * @type {import('next').NextConfig}
 */
const nextConfigurationFoundation = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * 🛡️ SANEADO Zenith: TS2353
   * Utilizamos ts-expect-error porque esta propiedad muta el tipo original
   * de NextConfig, pero es un requerimiento vital para el motor de Nx.
   */
  // @ts-expect-error - Propiedad inyectada consumida exclusivamente por '@nx/next'
  nx: {
    svgr: false,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns:[
      { protocol: 'https', hostname: '**' },
    ],
  },
};

/**
 * Colección de orquestadores de compilación (Plugins).
 */
const pluginsCollection =[
  withNx,
  /**
   * 🛡️ SANEADO Zenith: TS7006
   * Inyección de JSDoc para declarar la firma de entrada de la función flecha,
   * erradicando el 'any' implícito.
   *
   * @param {import('next').NextConfig} config
   * @returns {import('next').NextConfig}
   */
  (config) => withPayload(config),
];

export default composePlugins(...pluginsCollection)(nextConfigurationFoundation);
