/**
 * @section CMS Infrastructure - Typography Foundation
 * @description Centraliza la configuración de fuentes institucionales para el CMS.
 * Implementa optimización de carga vía 'display: swap' y variables CSS.
 *
 * Protocolo OEDP-V16.0 - High Performance & Asset Management.
 */

import { Inter, Lexend } from 'next/font/google';

/**
 * Fuente para lectura y cuerpo de datos (Sans-serif).
 */
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Fuente para titulares e interfaces de control (Display).
 */
export const fontDisplay = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});
