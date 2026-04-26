'use client';

/**
 * @section UI Orchestrator - Global Search Widget
 * @description Punto de ensamblaje soberano para el descubrimiento instantáneo.
 * SANEADO: Atomización completa. Lógica delegada al enjambre de sub-aparatos.
 *
 * Protocolo OEDP-V16.0 - Swiss-Watch Architecture & ISO Standards.
 */

import React, { useRef, useState } from 'react';
import { SearchInputBox } from './search-widget/components/SearchInputBox';
import { GlobalSearchWidgetPropertiesSchema } from './schemas/GlobalSearchWidget.schema';
import { useSearchInteractionOrchestrator } from './search-widget/hooks/useSearchInteractionOrchestrator';
import type { IGlobalSearchWidgetProperties } from './schemas/GlobalSearchWidget.schema';

interface IGlobalSearchWidgetExtendedProperties extends Partial<IGlobalSearchWidgetProperties> {
  readonly labels?: {
    readonly inputPlaceholderLiteral: string;
    readonly accessibilityLabelLiteral: string;
    readonly searchingStatusLiteral: string;
  };
  readonly externalClassName?: string;
}

export const GlobalSearchWidget: React.FC<IGlobalSearchWidgetExtendedProperties> = (
  rawUserProperties
) => {
  // 1. ADUANA DE ADN
  const componentConfiguration = GlobalSearchWidgetPropertiesSchema.parse(rawUserProperties);
  const inputElementReference = useRef<HTMLInputElement>(null);

  // 2. INYECCIÓN DE LÓGICA DE INTERACCIÓN
  const {
    isInputFocusedBoolean,
    handleInputFocusAction,
    handleInputBlurAction
  } = useSearchInteractionOrchestrator({
    isKeyboardShortcutEnabled: componentConfiguration.isKeyboardShortcutEnabled,
    inputElementReference
  });

  // 3. GESTIÓN DE ESTADO DE BÚSQUEDA
  const [activeSearchQueryLiteral, setActiveSearchQueryLiteral] = useState('');
  const isAlgorithmExecutingBoolean = activeSearchQueryLiteral.length > 0;

  return (
    <div className={rawUserProperties.externalClassName} role="search">
      <SearchInputBox
        inputReference={inputElementReference}
        isFocusedBoolean={isInputFocusedBoolean}
        isExecutingBoolean={isAlgorithmExecutingBoolean}
        valueLiteral={activeSearchQueryLiteral}
        placeholderLiteral={rawUserProperties.labels?.inputPlaceholderLiteral ?? componentConfiguration.placeholderTextLiteral}
        accessibilityLabelLiteral={rawUserProperties.labels?.accessibilityLabelLiteral ?? "Búsqueda universal"}
        onValueChangeAction={setActiveSearchQueryLiteral}
        onFocusAction={handleInputFocusAction}
        onBlurAction={handleInputBlurAction}
      />

      {/* PANEL DE HALLAZGOS (Atomic Injection Point) */}
      {isInputFocusedBoolean && activeSearchQueryLiteral.length >= componentConfiguration.minimumCharacterQuantityToSearch && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[110] animate-in fade-in zoom-in-95 duration-200">
           {/* TODO: Inyectar molecule SearchResultsPortal.tsx */}
           <div className="p-10 text-center text-slate-400 text-xs font-bold">
              {rawUserProperties.labels?.searchingStatusLiteral ?? "EXPLORANDO REGISTROS SOBERANOS..."}
           </div>
        </div>
      )}
    </div>
  );
};
