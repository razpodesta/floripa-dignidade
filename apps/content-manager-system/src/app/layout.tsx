/**
 * @section CMS Infrastructure - Root Administrative Layout
 * @description Carcasa estructural primaria para el sistema de gestión de contenidos.
 * Proporciona el contexto global de renderizado y soporte de hidratación para Payload 3.0.
 *
 * Protocolo OEDP-V16.0 - High Performance, Type Safety & Zero CLS.
 * SANEADO Zenith: Resolución de TS2882 mediante purificación de importación.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import type { Metadata, Viewport } from 'next';

/* 1. Infraestructura de Estilos (Global Reset) */
/**
 * 🛡️ SANEADO Zenith: Importación de efectos secundarios purificada.
 * Si el error persiste, verifique que 'apps/content-manager-system/tsconfig.json'
 * incluya "index.d.ts" en su sección 'include'.
 */
import './global.css';

/* 2. ADN Tipográfico (Separado para cumplimiento de SRP) */
import { fontDisplay, fontSans } from './fonts';

/**
 * @section Gobernanza de Metadatos
 * Define la identidad del búnker administrativo y bloquea el rastro de robots.
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Admin Floripa Dignidade',
    default: 'Panel de Control | Floripa Dignidade',
  },
  description: 'Infraestrutura soberana para a gestão de direitos humanos.',
  icons: {
    icon: '/brand/favicon.ico',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

/**
 * @section Configuración de Viewport
 */
export const viewport: Viewport = {
  themeColor: '#003366', // Azul Hercules Institucional
  width: 'device-width',
  initialScale: 1,
};

/**
 * @interface IRootLayoutProperties
 * @description Contrato de propiedades inmutables para el layout administrativo.
 */
interface IRootLayoutProperties {
  /** Colección de nodos hijos (Panel administrativo o rutas API). */
  readonly children: React.ReactNode;
}

/**
 * Componente de diseño raíz para el Content Manager System.
 *
 * @param {IRootLayoutProperties} properties - Propiedades de renderizado.
 * @returns {React.ReactElement} La estructura HTML base.
 */
export default function RootLayout({
  children
}: IRootLayoutProperties): React.ReactElement {
  return (
    /**
     * 🛡️ SANEADO Zenith: 'pt-BR' como lenguaje soberano del enjambre.
     * Inyección de variables CSS tipográficas y optimización de suavizado.
     */
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
