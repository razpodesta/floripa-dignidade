/**
 * @section Technical Constitution - Global Infrastructure Governance
 * @description Orquestador soberano de integridad de código, límites modulares y
 * cumplimiento de estándares internacionales (ISO 25010 / ISO 11179).
 * Garantiza el desacoplamiento físico y lógico entre la infraestructura Core,
 * los Motores de Inteligencia y los Dominios de Impacto Social.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Structural Integrity.
 * Vision: Swiss-Watch Precision in a Swarm Architecture.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import nxEslintPlugin from '@nx/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // 1. INTEGRACIÓN DE CONFIGURACIONES BASE DE NX (Swarm Architecture)
  ...nxEslintPlugin.configs['flat/base'],
  ...nxEslintPlugin.configs['flat/typescript'],
  ...nxEslintPlugin.configs['flat/javascript'],

  {
    /**
     * @section Exclusión de Entropía Visual
     * Optimiza el rendimiento del análisis ignorando artefactos de construcción,
     * memorias volátiles y rastro de ADN autogenerado.
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
      'node_modules',
      '**/payload-types.ts',
      '**/next-env.d.ts'
    ],
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        /** Requerido para reglas de SRE basadas en tipos (ej: no-floating-promises) */
        project: ['./tsconfig.base.json', './apps/*/tsconfig.json', './libs/**/tsconfig.lib.json'],
      },
    },
    rules: {
      /**
       * @section Matriz de Fronteras (Module Boundaries - ADR 0003)
       * Implementa la jerarquía de dependencias ISO para asegurar la modularidad atómica.
       */
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            '^.*/next\\.config\\.[cm]?js$',
            '^.*/postcss\\.config\\.[cm]?js$',
            '^.*/tailwind\\.config\\.[cm]?js$'
          ],
          depConstraints: [
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:core'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared'],
            },
            {
              sourceTag: 'scope:engines',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:engines'],
            },
            {
              sourceTag: 'scope:modules',
              onlyDependOnLibsWithTags: [
                'scope:core',
                'scope:shared',
                'scope:engines',
                'scope:modules'
              ],
            },
            {
              sourceTag: 'scope:qa',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:engines', 'scope:modules'],
            },
            {
              sourceTag: 'scope:tools',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:tools'],
            },
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['scope:*'],
            },
            {
              sourceTag: 'type:data',
              notDependOnLibsWithTags: ['type:ui'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:schema', 'type:core', 'type:shared'],
            },
            {
              sourceTag: 'type:schema',
              onlyDependOnLibsWithTags: [],
            }
          ],
        },
      ],

      /**
       * @section Rigor Técnico SRE (Reliability & Performance)
       */
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      
      /** 🛡️ SANEADO Zenith: Complejidad y Atomización (ADR 0007) */
      'complexity': ['error', 10],
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],

      /** Prevención de fugas de memoria y promesas perdidas */
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      /** Optimización de Tree-shaking */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],

      /** Mantenimiento de grado Enterprise */
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * @section Bloqueo de Hardware (Sovereign Infrastructure)
       * Prohíbe el acceso directo a process.env en librerías para forzar el uso 
       * del environment-validator. Excepto en apps, tools y scripts.
       */
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "⚠️ Prohibido el acceso directo a 'process.env' en librerías. Utilice '@floripa-dignidade/environment-validator' para asegurar el tipado soberano de infraestructura."
        }
      ],

      /**
       * @section Convención de Nomenclatura Profesional ISO (ISO/IEC 11179)
       */
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
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
  /** 
   * @section Overrides Específicos 
   * Permite process.env exclusivamente en la capa de frontera y herramientas.
   */
  {
    files: ['apps/**/*', 'libs/core/environment-validator/**/*', 'scripts/**/*', 'libs/tools/**/*'],
    rules: {
      'no-restricted-syntax': 'off'
    }
  }
];