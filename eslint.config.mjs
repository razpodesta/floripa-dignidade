import nx from '@nx/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores:['**/dist', '**/out-tsc', '**/test-output', '**/tmp'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      /**
       * 🛡️ REGLAS DE BOUNDARIES (Nx Enforce Module Boundaries)
       * Soluciona el error de "type:data" y define el flujo de dependencia.
       */
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow:['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints:[
            // REGLA 1: CORE (Infraestructura base: Telemetry, Exceptions, Analytics)
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags:['scope:core'],
            },
            // REGLA 2: ENGINES (Motores de lógica e IA: Health-Monitor, AI-Brain)
            {
              sourceTag: 'scope:engines',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:engines'],
            },
            // REGLA 3: MODULES (Dominios de Negocio: Identity, Newsletter)
            {
              sourceTag: 'scope:modules',
              onlyDependOnLibsWithTags:['scope:core', 'scope:shared', 'scope:engines', 'scope:modules'],
            },
            // REGLA 4: APPS (Next.js Shells)
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags:['scope:core', 'scope:shared', 'scope:modules', 'scope:engines'],
            },
            // REGLA 5: RESTRICCIÓN DE CAPA (Vertical Standard)
            // type:data (Servicios) ahora PUEDE depender de type:core (donde viven las excepciones)
            {
              sourceTag: 'type:data',
              onlyDependOnLibsWithTags: ['type:schemas', 'type:core', 'type:logic'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags:['type:ui', 'type:schemas', 'type:core', 'type:shared'],
            },
            {
              sourceTag: 'type:logic',
              onlyDependOnLibsWithTags:['type:core', 'type:schemas', 'type:logic'],
            }
          ],
        },
      ],

      /**
       * 👨‍💻 REGLAS DE PROGRAMADOR PROFESIONAL (Rigor Técnico)
       */
      // Prohíbe el uso de console.log (Solo se permite GlobalTelemetryManager)
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // Fuerza el uso de tipos explícitos en miembros de clase (Public/Private/Protected)
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],

      // Prohíbe el uso de 'any' (Aduana de ADN)
      '@typescript-eslint/no-explicit-any': 'error',

      // Exige igualdad estricta (===)
      'eqeqeq':['error', 'always'],

      // Nomenclatura profesional para tipos, interfaces y variables
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
        // HABILITADO PascalCase PARA VARIABLES (Evita fricción con Zod y React)
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        { selector: 'interface', format: ['PascalCase'], prefix: ['I'] }
      ],

      // Evita variables no usadas pero permite prefijo _ (ej: _request)
      '@typescript-eslint/no-unused-vars':['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],

      // Orden de importación para limpieza visual
      'sort-imports':['error', {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      }],
    },
  },
];
