/**
 * @section Quality Assurance - Application Jest Configuration
 * @description Orquestador de configuración para el motor de pruebas unitarias
 * del portal. Utiliza el integrador oficial de Next.js para garantizar la
 * simetría con el proceso de compilación de SWC y Turbopack.
 *
 * Protocolo OEDP-V16.0 - High Performance QA & ESM Standard.
 * Saneamiento: Transición de CommonJS a ESM y resolución de error TS2591.
 *
 * @author Engineering Department - Floripa Dignidade
 */

import nextJest from 'next/jest.js';
import type { Config } from 'jest';

/**
 * Inicializa el orquestador de Next.js para Jest.
 * Define el directorio raíz para la resolución de componentes y estilos.
 */
const initializeNextJestOrchestrator = nextJest({
  dir: './',
});

/**
 * @name jestApplicationConfiguration
 * @description Manifiesto de configuración técnica para las pruebas del portal.
 * Cumple con el estándar de tipado estricto de Jest.
 */
const jestApplicationConfiguration: Config = {
  /**
   * Identificador técnico para la ejecución en el enjambre de Nx.
   */
  displayName: '@floripa-dignidade/floripa-dignidade',

  /**
   * Pre-ajustes institucionales definidos en la raíz del monorepo.
   */
  preset: '../../jest.preset.js',

  /**
   * @section Motor de Transformación
   * Delegamos el procesamiento de activos no-TS al plugin especializado de Nx.
   */
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },

  /**
   * Extensiones de archivo autorizadas para el escaneo de pruebas.
   */
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],

  /**
   * Trazabilidad Forense de Cobertura.
   * Desvía los reportes de calidad fuera de la carpeta de la aplicación.
   */
  coverageDirectory: '../../coverage/apps/floripa-dignidade',

  /**
   * Entorno de ejecución: JSDOM.
   * Simula las APIs de navegador necesarias para componentes React.
   */
  testEnvironment: 'jsdom',
};

/**
 * Exportación soberana de la configuración procesada.
 */
export default initializeNextJestOrchestrator(jestApplicationConfiguration);
