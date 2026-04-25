/**
 * @section Style Infrastructure - PostCSS Orchestrator
 * @description Orquestador soberano de transformación de estilos para el portal.
 * Coordina la ejecución del motor Tailwind CSS y garantiza la compatibilidad
 * multi-navegador mediante la inyección de prefijos técnicos.
 *
 * Protocolo OEDP-V13.0 - High Performance & Vercel Optimization.
 * Estatus: ZENITH - Listo para Producción.
 *
 * @author Raz  Podestá - MetaShark Tech
 */

const { join: pathJoin } = require('path');

/**
 * @name PostCssConfiguration
 * @description ADN de configuración para la transpilación de CSS.
 */
module.exports = {
  plugins: {
    /**
     * @section Motor de Diseño Atómico (Tailwind)
     * Referencia física absoluta a la configuración nivelada del portal.
     */
    tailwindcss: {
      config: pathJoin(__dirname, 'tailwind.config.js'),
    },

    /**
     * @section Compatibilidad Transversal (Autoprefixer)
     * Inyecta automáticamente los prefijos de proveedor necesarios para cumplir
     * con los estándares de legibilidad y renderizado en navegadores antiguos
     * o redes de baja fidelidad.
     */
    autoprefixer: {
      /** Desactiva la visualización de avisos en consola durante el build de Vercel */
      flexbox: 'no-2009',
    },

    /**
     * @todo Integrar 'cssnano' en una fase futura para la minificación
     * avanzada de capas externas si fuera necesario.
     */
  },
};
