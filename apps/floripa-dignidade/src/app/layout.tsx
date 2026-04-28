/**
 * @section Application Root Layout - Global Shell
 * @description Ancestro supremo de la aplicación. Orquesta la inyección de 
 * estilos globales y el búnker de persistencia de estado.
 * 
 * SANEADO Zenith: Resolución de TS2882 y activación del PersistenceGuardian.
 */

import './global.css';
import React from 'react';
import { PersistenceGuardian } from '@floripa-dignidade/shared';

interface IRootLayoutProperties {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: IRootLayoutProperties) {
  return (
    /** 
     * SANEADO: suppressHydrationWarning es vital para Zustand/LocalStorage 
     * para evitar discrepancias de tiempo entre servidor y cliente.
     */
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <PersistenceGuardian>
          {children}
        </PersistenceGuardian>
      </body>
    </html>
  );
}