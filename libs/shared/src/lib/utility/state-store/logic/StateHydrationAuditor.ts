/**
 * @section State Store Logic - Hydration Auditor
 * @description Átomo encargado de la vigilancia forense durante la recuperación 
 * del estado desde el almacenamiento físico. Emite señales al Neural Sentinel.
 */

import { 
  EmitTelemetrySignal, 
  GenerateCorrelationIdentifier 
} from '@floripa-dignidade/telemetry';
import type { IGlobalSovereignStore } from '../GlobalInfrastructureStateStore';

/**
 * Genera el callback de auditoría para el middleware de persistencia.
 * 
 * @param _ignoredInitialState - Estado antes de la hidratación (Ignorado por diseño).
 * @returns Función que procesa el resultado de la hidratación.
 */
export const StateHydrationAuditor = (_ignoredInitialState: unknown) => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return (rehydratedState: IGlobalSovereignStore | undefined, caughtError: unknown): void => {
    if (caughtError) {
      void EmitTelemetrySignal({
        severityLevel: 'ERROR',
        moduleIdentifier: 'GLOBAL_STATE_ORCHESTRATOR',
        operationCode: 'STATE_HYDRATION_FAULT',
        correlationIdentifier,
        message: 'Fallo crítico al intentar recuperar la soberanía del disco local.',
        contextMetadata: { errorTraceLiteral: String(caughtError) }
      });
      return;
    }

    void EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'GLOBAL_STATE_ORCHESTRATOR',
      operationCode: 'STATE_HYDRATION_NOMINAL',
      correlationIdentifier,
      message: 'Soberanía recuperada: Memoria institucional sincronizada con el hardware local.',
      contextMetadata: { 
        hasActiveMandataryBoolean: !!rehydratedState?.activeMandataryIdentifier,
        isNetworkOnlineBoolean: rehydratedState?.isNetworkOnlineBoolean
      }
    });
  };
};