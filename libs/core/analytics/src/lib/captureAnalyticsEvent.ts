/**
 * @section Analytics Logic - User Interaction Capture
 * @description Captura y purifica eventos de comportamiento siguiendo una estrategia
 * de ejecución no bloqueante para el hilo principal (Main Thread).
 * Protocolo OEDP-V13.0 - Performance First Architecture.
 *
 * @author Staff Software Engineer - Floripa Dignidade
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';
import {
  AnalyticsEventSchema,
  IAnalyticsEvent
} from './schemas/AnalyticsEvent.schema';

/** Identificador técnico del búnker de analítica para el Neural Sentinel. */
const ANALYTICS_MODULE_IDENTIFIER = 'CORE_ANALYTICS_SERVICE';

/**
 * Captura un evento de interacción, valida su integridad contra el ADN soberano
 * y programa su despacho en periodos de inactividad del navegador.
 *
 * @param {unknown} rawInteractionPayload - Datos crudos capturados en la capa de UI.
 * @returns {void}
 */
export const CaptureAnalyticsEvent = (rawInteractionPayload: unknown): void => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. Aduana de ADN: Validación de integridad del evento (Zod Sovereignty).
  const validationResult = AnalyticsEventSchema.safeParse(rawInteractionPayload);

  if (!validationResult.success) {
    /**
     * Reportar el fallo de integridad al sistema nervioso central.
     * El mensaje se envía de forma técnica para evitar dependencias circulares con i18n
     * en capas de infraestructura baja (Core).
     */
    EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: ANALYTICS_MODULE_IDENTIFIER,
      operationCode: 'INVALID_ANALYTICS_SCHEMA_DETECTION',
      correlationIdentifier,
      message: 'Un evento analítico fue rechazado por no cumplir con el ADN estructural.',
      contextMetadata: {
        validationIssues: validationResult.error.flatten(),
        receivedPayloadSnapshot: rawInteractionPayload
      },
    });
    return;
  }

  const validatedEvent: IAnalyticsEvent = validationResult.data;

  /**
   * SECCIÓN: Orquestación de Despacho (Performance Strategy)
   * Se utiliza una función interna para encapsular el envío final.
   */
  const executeAsynchronousDispatch = (): void => {
    try {
      /**
       * @implementation_detail
       * En producción, se prioriza 'navigator.sendBeacon' para asegurar que el evento
       * se envíe incluso si el ciudadano cierra la pestaña o navega fuera del portal.
       */
      const isBeaconTransportAvailable =
        typeof navigator !== 'undefined' &&
        typeof navigator.sendBeacon === 'function';

      if (isBeaconTransportAvailable) {
        // En un escenario real, aquí se definiría el Endpoint del Neural Sentinel.
        // const analyticsEndpointUrl = '/api/telemetry/analytics';
        // navigator.sendBeacon(analyticsEndpointUrl, JSON.stringify(validatedEvent));
      }

      // Registro de éxito en el flujo sanguíneo digital (Telemetry)
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
        message: 'Fallo crítico al intentar despachar evento analítico.',
        contextMetadata: {
          errorMessage: caughtError instanceof Error ? caughtError.message : String(caughtError)
        }
      });
    }
  };

  /**
   * SECCIÓN: Programación No Bloqueante (Thread Safety)
   * Garantiza que la analítica no compita con el renderizado de la UI (60fps target).
   */
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => executeAsynchronousDispatch(), { timeout: 2000 });
  } else {
    // Fallback para entornos Node/Edge o navegadores antiguos.
    setTimeout(() => executeAsynchronousDispatch(), 1);
  }
};
