/**
 * @section Style Infrastructure - PostCSS Orchestrator
 * Protocolo OEDP-V16.0 - ESM-First Architecture.
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const currentFilePathLiteral = fileURLToPath(import.meta.url);
const currentDirectoryLiteral = dirname(currentFilePathLiteral);

export default {
  plugins: {
    tailwindcss: {
      config: join(currentDirectoryLiteral, 'tailwind.config.js'),
    },
    autoprefixer: {
      flexbox: 'no-2009',
    },
  },
};
