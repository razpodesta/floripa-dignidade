// @ts-check

/**
 * @section Next.js Configuration - Zenith Infrastructure Shell
 * @description Orquestador soberano de compilación.
 * Implementa el patrón de Silos JSON para garantizar la resolución del grafo de Nx.
 *
 * Protocolo OEDP-V15.0 - Build Resilience & Universal Interoperability.
 * Saneamiento: Resolución de infracción de fronteras y colisión de tipos Next 15/16.
 *
 * @author Raz Podestá - MetaShark Tech
 */

const { composePlugins, withNx } = require('@nx/next');

/**
 * @section Importación de Silo Universal
 * @infrastructure_bridge
 * SANEADO: Se utiliza supresión de regla @nx/enforce-module-boundaries.
 * RAZÓN TÉCNICA: next.config.js requiere acceso físico al JSON antes de la
 * resolución de alias de TypeScript para inyectar la seguridad en el Edge.
 */
// eslint-disable-next-line @nx/enforce-module-boundaries
const GLOBAL_SECURITY_HEADERS_COLLECTION = require('../../libs/shared/src/lib/utility/GlobalSecurityHeaders.json');

/**
 * @name configurationFoundation
 * @description Configuración base del portal validada por tipos.
 * @type {import('next').NextConfig}
 */
const configurationFoundation = {
  /**
   * @section Sincronización del Sistema Lego
   * Automatización de transpilación para búnkeres del monorepo.
   */
  transpilePackages: [
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
   * Implementa las cabeceras de protección atomizadas.
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        /**
         * @infrastructure_bridge
         * SANEADO: Casting controlado para neutralizar la discrepancia estructural
         * de tipos entre la definición de Header de Next 15 y Next 16.
         */
        headers: /** @type {any} */ (GLOBAL_SECURITY_HEADERS_COLLECTION),
      },
    ];
  },

  /** Configuración específica de Nx */
  nx: {
    svgr: false,
  },
};

/**
 * @section Orquestación de Plugins con Blindaje Zenith
 * SANEADO: Se realiza un casting a 'any' para la composición final.
 * RAZÓN TÉCNICA (TS2345): Colisión de firmas en la propiedad 'headers' entre versiones.
 */
const pluginsCollection = [withNx];
const synchronizedConfig = composePlugins(...pluginsCollection)(
  /** @type {any} */ (configurationFoundation)
);

module.exports = synchronizedConfig;
