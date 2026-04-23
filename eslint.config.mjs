/**
 * @section Technical Constitution - Global Governance
 * @description Orquestador soberano de integridad de código y límites modulares.
 * Garantiza el desacoplamiento absoluto del Sistema Lego y el cumplimiento de
 * estándares ISO de mantenibilidad.
 *
 * Protocolo OEDP-V13.0 - Structural Integrity & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import nx from '@nx/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  {
    /**
     * SECCIÓN: EXCLUSIÓN DE ENTROPÍA
     * Ignora artefactos de construcción y carpetas temporales para optimizar
     * el rendimiento del Neural Sentinel.
     */
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/test-output',
      '**/tmp',
      '.next/**/*',
      'pnpm-lock.yaml'
    ],
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
      /** Configuración de tipado estricto para análisis estático profundo. */
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      /**
       * 🛡️ REGLAS DE BOUNDARIES (Nx Enforce Module Boundaries)
       * El sistema inmunitario del monorepo. Impide dependencias circulares
       * y garantiza que el flujo de datos sea unidireccional.
       */
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              /** CORE: Cimientos inalterables. Solo pueden depender de otros bloques core. */
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:core'],
            },
            {
              /** SHARED: Kit visual y utilidades puras. Solo dependen de infraestructura base. */
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:core'],
            },
            {
              /** ENGINES: Motores de inteligencia. Consumen infraestructura y contratos de dominio. */
              sourceTag: 'scope:engines',
              onlyDependOnLibsWithTags: [
                'scope:core',
                'scope:shared',
                'scope:engines',
                'scope:modules'
              ],
            },
            {
              /** MODULES: Dominios de negocio. Ensamblan lógica y UI específica. */
              sourceTag: 'scope:modules',
              onlyDependOnLibsWithTags: [
                'scope:core',
                'scope:shared',
                'scope:engines',
                'scope:modules'
              ],
            },
            {
              /** APPS: Orquestadores finales. Consumen todo el ecosistema. */
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['scope:*'],
            },
            {
              /** TYPE DATA: Prohibido importar lógica de UI para evitar fugas de renderizado. */
              sourceTag: 'type:data',
              notDependOnLibsWithTags: ['type:ui'],
            },
            {
              /** TYPE UI: Presentación pura. No debe poseer lógica de acceso a datos directa. */
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:schema', 'type:core', 'type:shared'],
            },
            {
              /** TYPE SCHEMA: Nodos hoja. No tienen permiso de importación externa (Pure ADN). */
              sourceTag: 'type:schema',
              onlyDependOnLibsWithTags: [],
            }
          ],
        },
      ],

      /**
       * 👨‍💻 REGLAS DE RIGOR TÉCNICO (OEDP Standard)
       */
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],

      /** Forzar accesibilidad explícita en miembros de clase (ISO Mantenibilidad). */
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' }
      ],

      /** Prohibición de 'any' para garantizar integridad de tipos en la aduana Zod. */
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * 🏷️ CONVENCIÓN DE NOMENCLATURA ISO (ISO/IEC 11179)
       * Obliga a que el código se lea como literatura técnica.
       */
      '@typescript-eslint/naming-convention': [
        'error',
        /** Tipos, Interfaces y Enums: Siempre PascalCase. */
        { selector: 'typeLike', format: ['PascalCase'] },
        /**
         * Aparatos Atómicos y Constantes: PascalCase (para funciones exportadas)
         * o camelCase (para lógica interna).
         */
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        /** Parámetros: Siempre camelCase sin abreviaturas. */
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow'
        },
        /** Interfaces: Prefijo 'I' obligatorio según OEDP-V13.0. */
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I']
        }
      ],

      /** Prevención de código muerto y polución visual. */
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],

      /** Organización de importaciones para reducir conflictos de merge. */
      'sort-imports': ['error', {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      }],
    },
  },
];
