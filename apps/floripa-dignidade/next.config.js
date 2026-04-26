// @ts-check
/**
 * @section Next.js Configuration - Zenith Infrastructure Shell
 * Protocolo OEDP-V16.0 - ESM-First Architecture.
 * SANEADO Zenith: Lectura síncrona de JSON en ESM, eliminación de requires y resolución de TS2353.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { composePlugins, withNx } from '@nx/next';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Resolución de CWD nativa en ESM
const currentFilePathLiteral = fileURLToPath(import.meta.url);
const currentDirectoryLiteral = dirname(currentFilePathLiteral);

// Carga de Silo JSON (Artefactos de Seguridad)
const securityHeadersPathLiteral = join(currentDirectoryLiteral, '../../libs/shared/src/lib/utility/GlobalSecurityHeaders.json');
const globalSecurityHeadersCollection = JSON.parse(readFileSync(securityHeadersPathLiteral, 'utf8'));

/**
 * @name configurationFoundation
 * @description Configuración base del portal validada por tipos.
 * @type {import('next').NextConfig}
 */
const configurationFoundation = {
  transpilePackages:[
    '@floripa-dignidade/shared',
    '@floripa-dignidade/telemetry',
    '@floripa-dignidade/routing',
    '@floripa-dignidade/exceptions',
    '@floripa-dignidade/identity',
    '@floripa-dignidade/newsletter',
    '@floripa-dignidade/analytics',
    '@floripa-dignidade/health-monitor',
    '@floripa-dignidade/search-engine',
    '@floripa-dignidade/resend-provider',
    '@floripa-dignidade/tools',
    '@floripa-dignidade/scripts'
  ],
  reactStrictMode: true,
  poweredByHeader: false,

  /** Optimización de ruteo tipado de grado Enterprise */
  experimental: {
    typedRoutes: true,
  },

  /**
   * @section Inyección de Seguridad ISO
   */
  async headers() {
    return[
      {
        source: '/(.*)',
        headers: globalSecurityHeadersCollection,
      },
    ];
  },

  /**
   * 🛡️ SANEADO Zenith: TS2353
   * Silenciamos la advertencia de TypeScript ya que esta propiedad
   * es requerida y procesada exclusivamente por el plugin de Nx.
   */
  // @ts-expect-error - Propiedad inyectada consumida exclusivamente por '@nx/next'
  nx: {
    svgr: false,
  },
};

const pluginsCollection = [withNx];
export default composePlugins(...pluginsCollection)(configurationFoundation);
