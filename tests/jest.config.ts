/**
 * @section Quality Assurance - Jest Configuration
 * @description Orquestador de ejecución de pruebas para el búnker de validación.
 * Protocolo OEDP-V10.0 - Mirror Testing.
 */

export default {
  displayName: 'qa-mirror',
  preset: '../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/tests',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [],
  /**
   * Sincronización de Alias con el Mapa Maestro.
   * Permite que los tests importen de libs/ usando el alias institucional.
   */
  moduleNameMapper: {
    '^@floripa-dignidade/(.*)$': '<rootDir>/../libs/$1/src/index.ts',
  },
};
