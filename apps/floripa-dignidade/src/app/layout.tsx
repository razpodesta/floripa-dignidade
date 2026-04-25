/**
 * @section Application Root Layout
 * @description Carcasa estructural de la aplicación. Actúa como el ancestro
 * común para todas las rutas del portal, gestionando fuentes y SEO base.
 *
 * Protocolo OEDP-V15.0 - Single Source Resolution.
 * @author Raz Podestá - MetaShark Tech
 */

import './global.css';
import React from 'react';

/** 🛡️ SANEAMIENTO Zenith: Importación exclusiva de ADN como tipo */
import type { Metadata } from 'next';

/**
 * @section SEO Strategy - Metadata Foundation
 * Configuración soberana para el rastro de motores de búsqueda.
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Floripa Dignidade',
    default: 'Floripa Dignidade - Defensa de los Derechos Humanos',
  },
  description: 'Plataforma tecnológica para la transparencia y acción social en Florianópolis.',
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt-BR',
      'es-ES': '/es-ES',
      'en-US': '/en-US',
    },
  },
  robots: {
    index: true,
    follow: true,
  }
};

interface IRootLayoutProperties {
  readonly children: React.ReactNode;
}

/**
 * Componente raíz inmutable.
 * Implementa 'suppressHydrationWarning' para permitir extensiones de navegador (DarkReader, etc).
 */
export default function RootLayout({ children }: IRootLayoutProperties) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
