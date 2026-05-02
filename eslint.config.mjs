/**
 * @section Technical Constitution - Global Infrastructure Governance
 * @description Orquestador soberano de integridad de código y límites modulares.
 * Implementa la Estrategia de Servicio Dinámico y el Filtrado de ADN pre-emitido
 * para garantizar la estabilidad del proceso de auditoría.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Structural Integrity.
 * Vision: Swiss-Watch Precision in a Swarm Architecture.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import nxEslintPlugin from '@nx/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    /**
     * @section Purgado de Entropía Visual
     * Bloqueamos directorios de salida y rastro de caché.
     */
    ignores: [
      '**/dist/**',
      '**/out-tsc/**',
      '**/test-output/**',
      '**/tmp/**',
      '**/coverage/**',
      '**/.nx/**',
      '**/.cache/**',
      '.next/**/*',
      'pnpm-lock.yaml',
      'node_modules/**',
      '**/payload-types.ts',
      '**/next-env.d.ts',
    ],
  },

  // 1. INTEGRACIÓN DE CONFIGURACIONES BASE (Swarm Architecture)
  ...nxEslintPlugin.configs['flat/base'],
  ...nxEslintPlugin.configs['flat/typescript'],
  ...nxEslintPlugin.configs['flat/javascript'],

  {
    name: 'floripa-dignidade/governance-logic',
    // 🛡️ SANEADO Zenith: Limitamos el escaneo a código fuente real.
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // 🛡️ SANEADO Zenith: Ignoramos firmas .d.ts para evitar errores de Project Service.
    ignores: ['**/*.d.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        /**
         * 🛡️ CIRUGÍA ZENITH: Resolución del Heap Out of Memory.
         * Activamos 'projectService' para carga bajo demanda de tsconfigs.
         */
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      /**
       * @section Matriz de Fronteras (Module Boundaries - ADR 0003)
       * Ley de Hierro: Jerarquía inalterable del ecosistema Floripa.
       */
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            '^.*/next.config\\.[cm]?js$',
            '^.*/postcss.config\\.[cm]?js$',
            '^.*/tailwind.config\\.[cm]?js$',
          ],
          depConstraints: [
            { sourceTag: 'scope:core', onlyDependOnLibsWithTags: ['scope:core'] },
            { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: ['scope:core', 'scope:shared'] },
            { sourceTag: 'scope:engines', onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:engines'] },
            {
              sourceTag: 'scope:modules',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:engines', 'scope:modules'],
            },
            {
              sourceTag: 'scope:qa',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:engines', 'scope:modules'],
            },
            { sourceTag: 'scope:tools', onlyDependOnLibsWithTags: ['scope:core', 'scope:tools'] },
            { sourceTag: 'scope:app', onlyDependOnLibsWithTags: ['scope:*'] },
            /* Restricciones de Tipo */
            { sourceTag: 'type:data', notDependOnLibsWithTags: ['type:ui'] },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:schema', 'type:core', 'type:shared'],
            },
            { sourceTag: 'type:schema', onlyDependOnLibsWithTags: [] },
          ],
        },
      ],

      /**
       * @section Rigor SRE y Performance (ADR 0007)
       */
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'complexity': ['error', 10],
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],

      /** Prevención de fallos asíncronos y tipado any */
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * @section Bloqueo de Hardware (Cloud-Sovereign - ADR 0015)
       */
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "⚠️ Acceso prohibido a 'process.env'. Use '@floripa-dignidade/environment-validator'.",
        },
      ],

      /**
       * @section Convención de Nomenclatura ISO (ISO 11179)
       */
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
      ],

      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true, allowSeparatedGroups: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },

  /**
   * @section Jurisdicción de Excepción (Infrastructure Gates)
   */
  {
    files: [
      'apps/**/*',
      'libs/core/environment-validator/**/*',
      'scripts/**/*',
      'libs/tools/**/*',
      'libs/engines/adversarial-simulation-engine/**/*',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
];
