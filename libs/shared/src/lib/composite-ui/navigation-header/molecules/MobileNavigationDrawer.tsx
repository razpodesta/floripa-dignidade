/**
 * @section UI Molecule - Mobile Navigation Drawer
 * @description Orquestador del menú colapsable para dispositivos móviles.
 * Implementa animaciones de Framer Motion y triaje de acciones de emergencia.
 *
 * Protocolo OEDP-V16.0 - Mobile First & Performance.
 * SANEADO Zenith: Resolución de error TS2307 (Path Depth Correction).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

/* 1. Primitivos de Interfaz (Salto de 3 niveles para llegar a lib/ui-primitives) */
import { GlobalActionButton } from '../../../ui-primitives';

/* 2. ADN Lingüístico (Salto de 2 niveles para llegar a composite-ui/i18n) */
import type { IMainNavigationHeaderI18n } from '../../i18n/MainNavigationHeaderI18n.schema';

interface IMobileNavigationDrawerProperties {
  readonly isOpenBoolean: boolean;
  readonly translationDictionary: IMainNavigationHeaderI18n;
}

export const MobileNavigationDrawer: React.FC<IMobileNavigationDrawerProperties> = ({
  isOpenBoolean,
  translationDictionary,
}) => (
  <AnimatePresence mode="wait">
    {isOpenBoolean && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: '100vh' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed inset-0 top-[60px] bg-white z-[90] p-6 flex flex-col lg:hidden overflow-hidden"
      >
        {/* NAVEGACIÓN LOCALIZADA */}
        <nav className="flex flex-col gap-8 text-2xl font-bold text-navy-900 mt-8">
          <MobileLink href="/identidad">
            {translationDictionary.navigationPaths.identity}
          </MobileLink>
          <MobileLink href="/transparencia">
            {translationDictionary.navigationPaths.transparency}
          </MobileLink>
          <MobileLink href="/prensa">
            {translationDictionary.navigationPaths.press}
          </MobileLink>
        </nav>

        {/* ACCIONES DE CONVERSIÓN Y EMERGENCIA */}
        <div className="mt-auto pb-20 flex flex-col gap-4">
          <GlobalActionButton visualIntentConfiguration="CONVERSION" className="w-full text-lg py-4">
            {translationDictionary.actions.donateCallToAction}
          </GlobalActionButton>

          <GlobalActionButton
            visualIntentConfiguration="OUTLINE"
            className="w-full text-red-600 border-red-200 bg-red-50/30"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>{translationDictionary.actions.reportEmergencyLabel}</span>
          </GlobalActionButton>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * @private Component: MobileLink
 * @description Átomo local para enlaces de navegación móvil con feedback táctil.
 */
const MobileLink: React.FC<{ readonly href: string; readonly children: React.ReactNode }> = ({
  href,
  children
}) => (
  <a
    href={href}
    className="flex justify-between items-center border-b pb-4 border-slate-100 active:text-amber-600 transition-colors"
  >
    {children}
  </a>
);
