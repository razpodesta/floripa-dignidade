'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Command, Loader2 } from 'lucide-react';

/* 1. Infraestructura de Telemetría (Standard PascalCase) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 2. ADN Estructural y Utilidades Sincronizadas */
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';
import {
  GlobalSearchWidgetPropertiesSchema,
  IGlobalSearchWidgetProperties
} from './schemas/GlobalSearchWidget.schema';

/**
 * @section Component: GlobalSearchWidget
 * @description Orquestador visual de descubrimiento instantáneo para el ecosistema.
 * Implementa acceso rápido vía teclado (CMD+K), gestión de estados de enfoque,
 * animaciones de alta fidelidad y validación de ADN mediante Zod.
 *
 * Protocolo OEDP-V13.0 - Atomic Visual Consistency & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

interface IGlobalSearchWidgetExtendedProperties extends Partial<IGlobalSearchWidgetProperties> {
  /** Diccionario de etiquetas para soporte multi-idioma (i18n). */
  readonly labels?: {
    readonly inputPlaceholder: string;
    readonly searchingStatus: string;
    readonly keyboardShortcutHint: string;
    readonly accessibilityLabel: string;
  };
  /** Clase externa para ajustes de posicionamiento en el layout superior. */
  readonly externalClassName?: string;
}

export const GlobalSearchWidget: React.FC<IGlobalSearchWidgetExtendedProperties> = (rawUserProperties) => {
  // 1. ADUANA DE ADN (Contract Validation)
  const componentConfiguration = GlobalSearchWidgetPropertiesSchema.parse(rawUserProperties);
  const inputReference = useRef<HTMLInputElement>(null);

  // 2. GESTIÓN DE ESTADOS ATÓMICOS
  const [activeSearchQueryLiteral, setActiveSearchQueryLiteral] = useState('');
  const [isInputFocusedBoolean, setIsInputFocusedBoolean] = useState(false);
  const [isAlgorithmExecutingBoolean, setIsAlgorithmExecutingBoolean] = useState(false);

  // 3. LÓGICA DE ATAJO DE TECLADO (UX de Élite)
  const handleKeyboardGlobalShortcut = useCallback((event: KeyboardEvent) => {
    const isModifierPressedBoolean = event.metaKey || event.ctrlKey;
    const isKeyMatchBoolean = event.key.toLowerCase() === 'k';

    if (isModifierPressedBoolean && isKeyMatchBoolean) {
      event.preventDefault();
      inputReference.current?.focus();

      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: 'GLOBAL_SEARCH_WIDGET',
        operationCode: 'KEYBOARD_SHORTCUT_ACTIVATED',
        correlationIdentifier: GenerateCorrelationIdentifier(),
        message: 'El ciudadano activó la búsqueda universal mediante atajo de teclado.'
      });
    }
  }, []);

  useEffect(() => {
    if (componentConfiguration.isKeyboardShortcutEnabled) {
      window.addEventListener('keydown', handleKeyboardGlobalShortcut);
      return () => window.removeEventListener('keydown', handleKeyboardGlobalShortcut);
    }
    return;
  }, [componentConfiguration.isKeyboardShortcutEnabled, handleKeyboardGlobalShortcut]);

  // 4. ARQUITECTURA DE ESTILOS (Sovereign Style Merger)
  const containerStyleLiteral = GlobalStyleClassMerger(
    "relative flex items-center w-full transition-all duration-500 rounded-xl border-2 overflow-hidden",
    isInputFocusedBoolean
      ? "border-amber-500 bg-white shadow-lg ring-4 ring-amber-500/10"
      : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300",
    rawUserProperties.externalClassName
  );

  return (
    <div className="flex flex-col w-full group">
      <div className={containerStyleLiteral}>

        {/* ICONOGRAFÍA DE INTENCIÓN */}
        <div className="pl-4 text-slate-400 group-hover:text-amber-600 transition-colors">
          {isAlgorithmExecutingBoolean ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputReference}
          id="global-search-input"
          type="text"
          autoComplete="off"
          className="w-full py-3 px-4 bg-transparent outline-none text-slate-800 font-medium placeholder:text-slate-400 text-sm"
          placeholder={rawUserProperties.labels?.inputPlaceholder ?? componentConfiguration.placeholderTextLiteral}
          value={activeSearchQueryLiteral}
          onFocus={() => setIsInputFocusedBoolean(true)}
          onBlur={() => setTimeout(() => setIsInputFocusedBoolean(false), 200)}
          onChange={(event) => {
            setActiveSearchQueryLiteral(event.target.value);
            // Simulación de activación del motor (A ser conectado con @floripa-dignidade/search-engine)
            setIsAlgorithmExecutingBoolean(event.target.value.length > 0);
          }}
          aria-label={rawUserProperties.labels?.accessibilityLabel ?? "Campo de búsqueda universal"}
        />

        {/* INDICADOR DE ATAJO (ISO: Eficiencia de Usuario) */}
        <div className="hidden md:flex items-center pr-3 gap-1">
          <kbd className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-slate-500 bg-white border border-slate-300 rounded-md shadow-sm">
            <Command size={10} />
            <span>K</span>
          </kbd>
        </div>
      </div>

      {/* PANEL DE RESULTADOS (Atomic Overlay) */}
      {isInputFocusedBoolean && activeSearchQueryLiteral.length >= componentConfiguration.minimumCharacterQuantityToSearch && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {rawUserProperties.labels?.searchingStatus ?? "Explorando Ecosistema"}
            </span>
            <span className="text-[10px] text-amber-600 font-mono font-bold">
              "{activeSearchQueryLiteral}"
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
             <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
               <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-amber-500 w-6 h-6" />
               </div>
               <p className="text-slate-600 text-sm font-medium">
                 Iniciando motor de búsqueda difusa...
               </p>
               <p className="text-slate-400 text-xs mt-1">
                 Consultando registros de transparencia y artículos de prensa.
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
