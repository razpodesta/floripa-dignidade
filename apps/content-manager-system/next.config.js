// @ts-check

/**
 * @section Next.js Configuration - CMS Shell
 * Protocolo OEDP-V13.0 - Enterprise Optimization
 */

const { composePlugins, withNx } = require('@nx/next');

/**
 * Configuración soberana para el Content Manager System (CMS).
 * Gestiona la integración con Nx y optimizaciones específicas del servidor.
 *
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  /**
   * Opciones específicas de Nx.
   * @see https://nx.dev/recipes/next/next-config-setup
   */
  nx: {
    // Configuración de Svgr o plugins adicionales aquí
  },

  // Forzar el cumplimiento de encabezados de seguridad básicos
  poweredByHeader: false,
  reactStrictMode: true,
};

/**
 * Orquestación de plugins de Next.js.
 * Se utiliza composePlugins para permitir una extensibilidad modular (Lego System).
 */
const plugins = [
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
