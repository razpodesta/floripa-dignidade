/**
 * @section Analytics Logic - User Interaction Capture
 * @description Captura y purifica eventos de comportamiento siguiendo una estrategia
 * de ejecución no bloqueante para el hilo principal.
 *
 * Protocolo OEDP-V14.0 - Verbatim Module Syntax.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/** 🛡️ SANEAMIENTO Zenith: Separación de ADN (Tipo) y Lógica (Esquema) */
import type { IAnalyticsEvent } from './schemas/AnalyticsEvent.schema';
import { AnalyticsEventSchema } from './schemas/AnalyticsEvent.schema';

const ANALYTICS_MODULE_IDENTIFIER = 'CORE_ANALYTICS_SERVICE';

/**
 * Captura un evento, valida su integridad y programa su despacho.
 *
 * @param rawInteractionPayload - Datos crudos capturados en la interfaz.
 */
export const CaptureAnalyticsEvent = (rawInteractionPayload: unknown): void => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  const validationResult = AnalyticsEventSchema.safeParse(rawInteractionPayload);

  if (!validationResult.success) {
    EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: ANALYTICS_MODULE_IDENTIFIER,
      operationCode: 'INVALID_ANALYTICS_SCHEMA_DETECTION',
      correlationIdentifier,
      message: 'Un evento analítico fue rechazado por fallo de integridad técnica.',
      contextMetadata: {
        validationIssues: validationResult.error.flatten()
      },
    });
    return;
  }

  const validatedEvent: IAnalyticsEvent = validationResult.data;

  const executeAsynchronousDispatch = (): void => {
    try {
      const isBeaconTransportAvailable =
        typeof navigator !== 'undefined' &&
        typeof navigator.sendBeacon === 'function';

      if (isBeaconTransportAvailable) {
        // Implementación futura del canal de transporte
      }

      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: ANALYTICS_MODULE_IDENTIFIER,
        operationCode: 'ANALYTICS_EVENT_DISPATCHED',
        correlationIdentifier,
        message: `Evento capturado: ${validatedEvent.eventName}`,
        contextMetadata: { eventName: validatedEvent.eventName }
      });

    } catch (caughtError) {
      EmitTelemetrySignal({
        severityLevel: 'ERROR',
        moduleIdentifier: ANALYTICS_MODULE_IDENTIFIER,
        operationCode: 'ANALYTICS_DISPATCH_FAILURE',
        correlationIdentifier,
        message: 'Fallo crítico al despachar evento analítico.',
        contextMetadata: {
          errorMessage: caughtError instanceof Error ? caughtError.message : String(caughtError)
        }
      });
    }
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => executeAsynchronousDispatch(), { timeout: 2000 });
  } else {
    setTimeout(() => executeAsynchronousDispatch(), 1);
  }
};
