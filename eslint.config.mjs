/**
 * @section Technical Constitution - Global Infrastructure Governance
 * @description Orquestador de integridad de código, límites modulares y cumplimiento
 * de estándares internacionales. Garantiza el desacoplamiento de búnkeres lógicos
 * y la inmutabilidad de las fronteras de dominio.
 *
 * Protocolo OEDP-V15.0 - Structural Integrity & Build Readiness.
 * Saneamiento: Autorización de importaciones relativas para orquestadores de construcción.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import nxEslintPlugin from '@nx/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // 1. Integración de Configuraciones Base de Nx
  ...nxEslintPlugin.configs['flat/base'],
  ...nxEslintPlugin.configs['flat/typescript'],
  ...nxEslintPlugin.configs['flat/javascript'],

  {
    /**
     * @section Exclusión de Entropía Visual
     * Optimiza el rendimiento ignorando artefactos de construcción y memorias volátiles.
     */
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/test-output',
      '**/tmp',
      '**/coverage',
      '**/.nx',
      '**/.cache',
      '.next/**/*',
      'pnpm-lock.yaml',
      'node_modules'
    ],
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      /**
       * @section Matriz de Fronteras (Module Boundaries)
       * Implementa la jerarquía de dependencias para asegurar la modularidad atómica.
       */
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          /**
           * @section Autorización de Orquestadores
           * SANEADO: Se añaden los archivos de configuración de Next.js y PostCSS
           * a la lista blanca para permitir importaciones físicas durante el build.
           */
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            '^.*/next\\.config\\.[cm]?js$',
            '^.*/postcss\\.config\\.[cm]?js$'
          ],
          depConstraints: [
            {
              /** Capa de Infraestructura (Core): Independencia absoluta. */
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:core'],
            },
            {
              /** Capa Visual (Shared): Depende únicamente de infraestructura base. */
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared'],
            },
            {
              /** Capa de Motores (Engines): Inteligencia agnóstica al negocio. */
              sourceTag: 'scope:engines',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:engines'],
            },
            {
              /** Capa de Dominios (Modules): Ensambla inteligencia e infraestructura. */
              sourceTag: 'scope:modules',
              onlyDependOnLibsWithTags: [
                'scope:core',
                'scope:shared',
                'scope:engines',
                'scope:modules'
              ],
            },
            {
              /** Capa de Calidad (QA): Capacidad de observación total del sistema. */
              sourceTag: 'scope:qa',
              onlyDependOnLibsWithTags: [
                'scope:core',
                'scope:shared',
                'scope:engines',
                'scope:modules'
              ],
            },
            {
              /** Capa de Soporte (Tools/Scripts). */
              sourceTag: 'scope:tools',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:tools'],
            },
            {
              /** Aplicaciones Finales: Consumidores de todo el ecosistema. */
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['scope:*'],
            },
            {
              /** Restricción de Tipo: Prohibida la lógica visual en capas de datos. */
              sourceTag: 'type:data',
              notDependOnLibsWithTags: ['type:ui'],
            },
            {
              /** Restricción de Tipo: La UI solo consume contratos y bases. */
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:schema', 'type:core', 'type:shared'],
            },
            {
              /** Los esquemas actúan como Nodos Hoja inalterables. */
              sourceTag: 'type:schema',
              onlyDependOnLibsWithTags: [],
            }
          ],
        },
      ],

      /**
       * @section Rigor Técnico y Mantenibilidad (ISO 25010)
       */
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],

      /** Forzar el uso de 'import type' para optimizar Turbopack y resolver TS1484. */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],

      /** Garantiza la visibilidad explícita de miembros de clase. */
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' }
      ],

      /** Prevención de ambigüedad técnica. */
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * @section Convención de Nomenclatura Profesional (ISO/IEC 11179)
       */
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I']
        },
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow'
        }
      ],

      'sort-imports': ['error', {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        allowSeparatedGroups: true
      }],

      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
    },
  },
];
