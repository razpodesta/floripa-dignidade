'use client';

/**
 * @section Component: GlobalMainNavigationHeader
 * @description Orquestador superior de navegación, identidad y descubrimiento.
 * Implementa un sistema de 'Sticky Glassmorphism', gestión de menús móviles
 * mediante Framer Motion y trazabilidad forense.
 *
 * Protocolo OEDP-V13.0 - Atomic Visual Architecture & Zero Abbreviations.
 * Saneamiento: Resolución definitiva de errores 'sort-imports' y optimización de renderizado.
 *
 * @author Raz  Podestá - MetaShark Tech
 */

import React, {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  AnimatePresence,
  motion
} from 'framer-motion';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import {
  Heart,
  Menu,
  ShieldAlert,
  X
} from 'lucide-react';

/* 1. Infraestructura de Telemetría (Standard PascalCase) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 2. Primitivos y Utilidades Sincronizadas */
import {
  GlobalActionButton,
  GlobalBrandLogo,
  GlobalSearchWidget
} from '../ui-primitives';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/** 🛡️ SANEAMIENTO Zenith: Importación de ADN como tipo puro */
import type { IMainNavigationHeaderI18n } from './i18n/MainNavigationHeaderI18n.schema';

/**
 * @interface IGlobalMainNavigationHeaderProperties
 * @description Contrato de propiedades para el ensamble de navegación.
 */
interface IGlobalMainNavigationHeaderProperties {
  /** Diccionario de traducciones inyectado desde el orquestador de página. */
  readonly translationDictionary: IMainNavigationHeaderI18n;
  /** Identificador de ruta activa para resaltado visual. */
  readonly currentActivePathLiteral?: string;
  /** Clase externa para ajustes de z-index o posicionamiento. */
  readonly externalClassName?: string;
}

export const GlobalMainNavigationHeader: React.FC<IGlobalMainNavigationHeaderProperties> = ({
  translationDictionary,
  externalClassName,
}) => {
  // --- ESTADOS ATÓMICOS ---
  const [isMobileMenuOpenBoolean, setIsMobileMenuOpenBoolean] = useState(false);
  const [hasUserScrolledPastThresholdBoolean, setHasUserScrolledPastThresholdBoolean] = useState(false);

  // --- LÓGICA DE OBSERVABILIDAD Y EVENTOS ---
  useEffect(() => {
    const correlationIdentifier = GenerateCorrelationIdentifier();

    const handleWindowScrollEvent = () => {
      const scrollThresholdInPixelsQuantity = 30;
      setHasUserScrolledPastThresholdBoolean(window.scrollY > scrollThresholdInPixelsQuantity);
    };

    /**
     * Optimización de Rendimiento:
     * El uso de { passive: true } mejora el FPS del hilo principal durante el scroll.
     */
    window.addEventListener('scroll', handleWindowScrollEvent, { passive: true });

    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'MAIN_NAVIGATION_HEADER',
      operationCode: 'HEADER_INITIALIZED',
      correlationIdentifier,
      message: 'Encabezado global desplegado y sincronizado con el motor de scroll.'
    });

    return () => window.removeEventListener('scroll', handleWindowScrollEvent);
  }, []);

  const toggleMobileMenuAction = useCallback(() => {
    setIsMobileMenuOpenBoolean((previousState) => !previousState);
  }, []);

  // --- ARQUITECTURA DE ESTILOS (Sovereign Merger) ---
  const headerContainerStylesLiteral = GlobalStyleClassMerger(
    "fixed top-0 w-full z-[100] transition-all duration-500 border-b",
    hasUserScrolledPastThresholdBoolean
      ? "bg-white/80 backdrop-blur-xl py-2 shadow-lg border-slate-200"
      : "bg-transparent py-5 border-transparent",
    externalClassName
  );

  return (
    <header className={headerContainerStylesLiteral} role="banner">
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* LADO IZQUIERDO: Identidad Forense */}
        <div className="flex-shrink-0">
          <GlobalBrandLogo
            imageWidthPixelQuantity={hasUserScrolledPastThresholdBoolean ? 130 : 160}
            isNavigationLinkEnabled={true}
            labels={{
              logoAlternativeTextLiteral: "Floripa Dignidade Logo",
              navigationAriaLabelLiteral: "Ir al inicio"
            }}
          />
        </div>

        {/* CENTRO: Navegación Institucional (Desktop) */}
        <NavigationMenu.Root className="hidden lg:flex relative">
          <NavigationMenu.List className="flex gap-10 items-center">
            <HeaderNavLink
              href="/identidad"
              label={translationDictionary.navigationPaths.identity}
            />
            <HeaderNavLink
              href="/transparencia"
              label={translationDictionary.navigationPaths.transparency}
            />
            <HeaderNavLink
              href="/prensa"
              label={translationDictionary.navigationPaths.press}
            />
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* LADO DERECHO: Descubrimiento y Conversión */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="w-72">
            <GlobalSearchWidget
              placeholderTextLiteral={translationDictionary.actions.searchPlaceholder}
              minimumCharacterQuantityToSearch={3}
            />
          </div>

          <GlobalActionButton visualIntentConfiguration="CONVERSION" className="px-8">
            <Heart className="w-4 h-4 fill-current text-white" />
            <span>{translationDictionary.actions.donateCallToAction}</span>
          </GlobalActionButton>
        </div>

        {/* INTERRUPTOR MÓVIL (ISO Accessibility) */}
        <button
          className="lg:hidden p-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
          onClick={toggleMobileMenuAction}
          aria-expanded={isMobileMenuOpenBoolean}
          aria-label={translationDictionary.actions.mobileMenuToggle}
        >
          {isMobileMenuOpenBoolean ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MENÚ MÓVIL: SISTEMA DE CAPAS (AnimatePresence) */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpenBoolean && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 top-[60px] bg-white z-[90] p-6 flex flex-col lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col gap-8 text-2xl font-bold text-navy-900 mt-8">
              <a
                href="/identidad"
                className="flex justify-between items-center border-b pb-4 border-slate-100"
              >
                {translationDictionary.navigationPaths.identity}
              </a>
              <a
                href="/transparencia"
                className="flex justify-between items-center border-b pb-4 border-slate-100"
              >
                {translationDictionary.navigationPaths.transparency}
              </a>
              <a
                href="/prensa"
                className="flex justify-between items-center border-b pb-4 border-slate-100"
              >
                {translationDictionary.navigationPaths.press}
              </a>
            </nav>

            <div className="mt-auto pb-20 flex flex-col gap-4">
              <GlobalActionButton visualIntentConfiguration="CONVERSION" className="w-full text-lg py-4">
                {translationDictionary.actions.donateCallToAction}
              </GlobalActionButton>
              <GlobalActionButton
                visualIntentConfiguration="OUTLINE"
                className="w-full text-red-600 border-red-200 bg-red-50/30"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>{translationDictionary.navigationPaths.complaint}</span>
              </GlobalActionButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/**
 * @private Component: HeaderNavLink
 * @description Sub-aparato atómico para la renderización de enlaces de navegación.
 */
const HeaderNavLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <NavigationMenu.Item>
    <NavigationMenu.Link
      href={href}
      className="text-slate-700 hover:text-amber-600 font-bold transition-all duration-300 relative group text-sm uppercase tracking-widest"
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full" />
    </NavigationMenu.Link>
  </NavigationMenu.Item>
);
