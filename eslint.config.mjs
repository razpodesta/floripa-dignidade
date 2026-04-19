import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/test-output'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // REGLA 1: CORE (Los Cimientos)
            // Solo pueden depender de otros bloques core. Nunca de módulos o apps.
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:core'],
            },
            // REGLA 2: MODULES (Lógica de Negocio)
            // Pueden usar Core y Shared, y otros submódulos de su propio dominio.
            {
              sourceTag: 'scope:module',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:module'],
            },
            // REGLA 3: SHARED (Utilidades y UI Genérica)
            // Solo dependen de Core para logging/errores.
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared'],
            },
            // REGLA 4: APPS (El Ensamblador / Shell)
            // Puede importar todo para armar el producto final.
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:module'],
            },
            // REGLA 5: RESTRICCIÓN POR CAPA (Lego Vertical)
            // Evita que un componente de UI importe lógica de servidor (Data Access).
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:shared', 'type:core', 'type:schemas'],
            },
            {
              sourceTag: 'type:data',
              onlyDependOnLibsWithTags: ['type:schemas', 'type:core'],
            }
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {
      // Reglas adicionales de calidad
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
