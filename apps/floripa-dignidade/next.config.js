// @ts-check

/**
 * @section Next.js Configuration - Main Application Shell
 * Protocolo OEDP-V13.0 - High Performance & Security
 */

const { composePlugins, withNx } = require('@nx/next');

/**
 * Configuración soberana para la aplicación principal Floripa Dignidade.
 * Optimizada para el despliegue en Vercel y la integración con el ecosistema Nx.
 *
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  /**
   * Opciones específicas de Nx.
   * @see https://nx.dev/recipes/next/next-config-setup
   */
  nx: {
    // Configuración para el soporte de SVGR o transformaciones de assets
  },

  /**
   * Seguridad y Rendimiento:
   * - poweredByHeader: false (Oculta la tecnología para mitigar ataques dirigidos)
   * - reactStrictMode: true (Ayuda a identificar bugs en renderizado y efectos)
   */
  poweredByHeader: false,
  reactStrictMode: true,
};

/**
 * Orquestación modular de plugins.
 * Siguiendo el Sistema Lego, los plugins se componen de forma inmutable.
 */
const plugins = [
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
