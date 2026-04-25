/**
 * @section Style Architecture - Tailwind CSS Configuration
 * @description Orquestador soberano de la identidad visual para el portal.
 * Implementa el escaneo recursivo de búnkeres de UI, integración de Design Tokens
 * y optimización de purga para el motor de renderizado Turbopack.
 *
 * Protocolo OEDP-V13.0 - Atomic Visual DNA & ISO Technical Naming.
 * Estatus: ZENITH - Listo para Producción.
 *
 * @author Raz  Podestá - MetaShark Tech
 */

const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * @section Aduana de Contenidos (Purge Logic)
   * Define las rutas físicas que el motor de Tailwind debe auditar para extraer
   * las clases utilizadas. Incluye la aplicación y todos los búnkeres de lógica visual.
   */
  content: [
    // 1. Aplicación Principal
    join(__dirname, 'src/**/!(*.spec|*.test).{ts,tsx,html}'),

    // 2. Búnker Shared (Componentes Globales, Primitivos y Composite UI)
    join(__dirname, '../../libs/shared/src/**/!(*.spec|*.test).{ts,tsx,html}'),

    // 3. Motores de Negocio con Capa de Presentación
    join(__dirname, '../../libs/modules/**/src/**/!(*.spec|*.test).{ts,tsx,html}'),
  ],

  theme: {
    extend: {
      /**
       * @section Design System Integration (DNA Cromático)
       * Valores técnicos extraídos del Manual de Identidad Visual de la ONG.
       * Sincronizado con: libs/shared/src/lib/design-system/index.ts
       */
      colors: {
        navy: {
          900: '#003366', // Azul Hercules (Autoridad y Confianza)
          800: '#002852',
          700: '#001E3D',
        },
        amber: {
          500: '#F5A623', // Ámbar Acción (Conversión Social y Solidaridad)
          600: '#D48806',
          400: '#F7B84B',
        },
        bridge: {
          blue: '#4A90E2', // Azul Puente (Conexión Territorial)
        },
        slate: {
          950: '#0F172A',
          900: '#1E293B',
          600: '#64748B',
          50: '#F8FAFC',
        }
      },

      /**
       * @section Tipografía Soberana
       */
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-lexend)', 'Lexend', 'sans-serif'],
      },

      /**
       * @section Espaciado ISO (Multiplicador de 4px)
       */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      /**
       * @section Animaciones de Alta Fidelidad
       */
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  /**
   * @section Plugins de Utilidad Técnica
   */
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
