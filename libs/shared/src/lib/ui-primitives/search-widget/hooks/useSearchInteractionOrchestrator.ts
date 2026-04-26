/**
 * @section UI Logic - Search Interaction Orchestrator Hook
 * @description Centraliza la lógica de atajos de teclado globales (CMD+K),
 * gestión de estados de enfoque y rastro telemétrico de intención.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Performance.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

interface IUseSearchInteractionOrchestratorProperties {
  readonly isKeyboardShortcutEnabled: boolean;
  readonly inputElementReference: React.RefObject<HTMLInputElement | null>;
}

export const useSearchInteractionOrchestrator = ({
  isKeyboardShortcutEnabled,
  inputElementReference
}: IUseSearchInteractionOrchestratorProperties) => {
  const [isInputFocusedBoolean, setIsInputFocusedBoolean] = useState(false);

  const handleKeyboardGlobalShortcut = useCallback((event: KeyboardEvent) => {
    const isModifierPressedBoolean = event.metaKey || event.ctrlKey;
    const isKeyMatchBoolean = event.key.toLowerCase() === 'k';

    if (isModifierPressedBoolean && isKeyMatchBoolean) {
      event.preventDefault();
      inputElementReference.current?.focus();

      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: 'SEARCH_WIDGET_LOGIC',
        operationCode: 'KEYBOARD_SHORTCUT_ACTIVATED',
        correlationIdentifier: GenerateCorrelationIdentifier(),
        message: 'Acceso rápido activado mediante comando de teclado.'
      });
    }
  }, [inputElementReference]);

  useEffect(() => {
    if (isKeyboardShortcutEnabled) {
      window.addEventListener('keydown', handleKeyboardGlobalShortcut);
      return () => window.removeEventListener('keydown', handleKeyboardGlobalShortcut);
    }
    return;
  }, [isKeyboardShortcutEnabled, handleKeyboardGlobalShortcut]);

  /**
   * Gestión de desenfoque con retardo técnico para permitir la
   * captura de eventos de clic en el portal de resultados.
   */
  const handleInputBlurAction = () => {
    const blurDelayInMillisecondsQuantity = 200;
    setTimeout(() => setIsInputFocusedBoolean(false), blurDelayInMillisecondsQuantity);
  };

  return {
    isInputFocusedBoolean,
    handleInputFocusAction: () => setIsInputFocusedBoolean(true),
    handleInputBlurAction
  };
};
