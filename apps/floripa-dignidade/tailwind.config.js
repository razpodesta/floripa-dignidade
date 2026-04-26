/**
 * @section Style Architecture - Tailwind CSS Configuration
 * Protocolo OEDP-V16.0 - ESM-First Architecture.
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import tailwindTypographyPlugin from '@tailwindcss/typography';
import tailwindAnimatePlugin from 'tailwindcss-animate';

const currentFilePathLiteral = fileURLToPath(import.meta.url);
const currentDirectoryLiteral = dirname(currentFilePathLiteral);

/** @type {import('tailwindcss').Config} */
export default {
  content:[
    join(currentDirectoryLiteral, 'src/**/!(*.spec|*.test).{ts,tsx,html}'),
    join(currentDirectoryLiteral, '../../libs/shared/src/**/!(*.spec|*.test).{ts,tsx,html}'),
    join(currentDirectoryLiteral, '../../libs/modules/**/src/**/!(*.spec|*.test).{ts,tsx,html}'),
  ],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#003366', 800: '#002852', 700: '#001E3D' },
        amber: { 500: '#F5A623', 600: '#D48806', 400: '#F7B84B' },
        bridge: { blue: '#4A90E2' },
        slate: { 950: '#0F172A', 900: '#1E293B', 600: '#64748B', 50: '#F8FAFC' }
      },
      fontFamily: {
        sans:['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-lexend)', 'Lexend', 'sans-serif'],
      },
      spacing: { '18': '4.5rem', '22': '5.5rem' },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins:[
    tailwindTypographyPlugin,
    tailwindAnimatePlugin,
  ],
};
