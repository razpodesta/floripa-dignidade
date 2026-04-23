/**
 * @section Application Root Layout
 * @description Carcasa soberana de la aplicación.
 * Este layout es el ancestro de todas las rutas, incluyendo las localizadas.
 *
 * Protocolo OEDP-V13.0 - Structural Integrity.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import './global.css';
import { Metadata } from 'next';

/**
 * @section SEO Strategy: Metadata Foundation
 * Definición de metadatos base para el rastro de los motores de búsqueda.
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Floripa Dignidade',
    default: 'Floripa Dignidade - Defensa de los Derechos Humanos',
  },
  description: 'Plataforma tecnológica para la transparencia y acción social en Florianópolis.',
  /**
   * Canonical & Alternates: Clave para el Pilar Técnico del Manifiesto SEO.
   * Evita penalizaciones por contenido duplicado en rutas multilingües.
   */
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt-BR',
      'es-ES': '/es-ES',
      'en-US': '/en-US',
    },
  },
};

interface IRootLayoutProperties {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: IRootLayoutProperties) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
