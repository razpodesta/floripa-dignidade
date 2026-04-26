'use client';

/**
 * @section Composite UI - Main Navigation Header (Orchestrator)
 * @description Punto de ensamblaje soberano para la navegación institucional.
 * Gestiona estados de scroll, visibilidad del enjambre móvil y trazabilidad.
 *
 * Protocolo OEDP-V16.0 - Swiss-Watch Architecture & ISO Standards.
 * SANEADO Zenith: Resolución de error 'sort-imports' y validación de rutas.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React, { useCallback, useEffect, useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

/**
 * 🛡️ SANEADO Zenith: Miembros ordenados alfabéticamente (H < M < X)
 * para cumplimiento estricto de reglas de linter y legibilidad ISO.
 */
import { Heart, Menu, X } from 'lucide-react';

/* 1. Infraestructura Core (Atmos PascalCase) */
import { EmitTelemetrySignal, GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';

/* 2. Primitivos y Utilidades Sincronizadas */
import { GlobalActionButton, GlobalBrandLogo, GlobalSearchWidget } from '../ui-primitives';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/* 3. Átomos y Moléculas Locales (Enjambre Atomizado) */
import { NavigationLink } from './navigation-header/atoms/NavigationLink';
import { MobileNavigationDrawer } from './navigation-header/molecules/MobileNavigationDrawer';
import type { IMainNavigationHeaderI18n } from './i18n/MainNavigationHeaderI18n.schema';

/**
 * @interface IGlobalMainNavigationHeaderProperties
 * @description Contrato de propiedades inmutables para el ensamble de navegación.
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

  // --- ESCUCHA DE SENSORES (Scroll & Lifecycle) ---
  useEffect(() => {
    const correlationIdentifier = GenerateCorrelationIdentifier();

    const handleWindowScrollEvent = () => {
      /** Umbral de activación para el efecto Glassmorphism (30px) */
      const scrollThresholdInPixelsQuantity = 30;
      setHasUserScrolledPastThresholdBoolean(window.scrollY > scrollThresholdInPixelsQuantity);
    };

    /** Optimización de Rendimiento: Passive Listener para evitar bloqueo del Main Thread */
    window.addEventListener('scroll', handleWindowScrollEvent, { passive: true });

    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'MAIN_NAVIGATION_HEADER',
      operationCode: 'HEADER_INITIALIZED',
      correlationIdentifier,
      message: 'Encabezado institucional hidratado y sincronizado con sensores físicos.'
    });

    return () => window.removeEventListener('scroll', handleWindowScrollEvent);
  }, []);

  const toggleMobileMenuAction = useCallback(() => {
    setIsMobileMenuOpenBoolean((previousStateBoolean) => !previousStateBoolean);
  }, []);

  // --- ARQUITECTURA DE ESTILOS SOBERANOS ---
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

        {/* LADO IZQUIERDO: Identidad Institucional */}
        <div className="flex-shrink-0">
          <GlobalBrandLogo
            imageWidthPixelQuantity={hasUserScrolledPastThresholdBoolean ? 130 : 160}
            labels={{
              logoAlternativeTextLiteral: "Floripa Dignidade",
              navigationAriaLabelLiteral: "Volver a la página de inicio"
            }}
          />
        </div>

        {/* CENTRO: Navegación Estratégica (Desktop Only) */}
        <NavigationMenu.Root className="hidden lg:flex relative">
          <NavigationMenu.List className="flex gap-10 items-center">
            <NavigationLink
              hrefLiteral="/identidad"
              labelLiteral={translationDictionary.navigationPaths.identity}
            />
            <NavigationLink
              hrefLiteral="/transparencia"
              labelLiteral={translationDictionary.navigationPaths.transparency}
            />
            <NavigationLink
              hrefLiteral="/prensa"
              labelLiteral={translationDictionary.navigationPaths.press}
            />
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* LADO DERECHO: Herramientas de Conversión (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="w-72">
            <GlobalSearchWidget
              placeholderTextLiteral={translationDictionary.actions.searchPlaceholder}
            />
          </div>
          <GlobalActionButton visualIntentConfiguration="CONVERSION" className="px-8">
            <Heart className="w-4 h-4 fill-current" />
            <span>{translationDictionary.actions.donateCallToAction}</span>
          </GlobalActionButton>
        </div>

        {/* GESTIÓN DE FRONTERA MÓVIL (ISO Accessibility) */}
        <button
          className="lg:hidden p-2 text-navy-900 rounded-lg focus:ring-2 focus:ring-amber-500 transition-all"
          onClick={toggleMobileMenuAction}
          aria-expanded={isMobileMenuOpenBoolean}
          aria-label={translationDictionary.actions.mobileMenuToggle}
        >
          {isMobileMenuOpenBoolean ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* CAJÓN DE NAVEGACIÓN (Drawer) */}
      <MobileNavigationDrawer
        isOpenBoolean={isMobileMenuOpenBoolean}
        translationDictionary={translationDictionary}
      />
    </header>
  );
};
