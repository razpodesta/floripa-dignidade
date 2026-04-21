import { AnalyticsEventSchema, IAnalyticsEvent } from './schemas/AnalyticsEvent.schema.js';

/**
 * Captura y procesa un evento analítico siguiendo la estrategia de ejecución no bloqueante.
 * Utiliza 'requestIdleCallback' para asegurar que el seguimiento de métricas no compita
 * con el hilo principal del navegador, protegiendo los Core Web Vitals (LCP, INP, CLS).
 *
 * @param {unknown} rawEventData - Datos crudos del evento capturados en el cliente.
 * @returns {void}
 * @throws {void} - Las fallas de validación se descartan silenciosamente para proteger la UX.
 */
export const captureAnalyticsEvent = (rawEventData: unknown): void => {
  // 1. Aduana de ADN: Validación Semántica estricta vía Zod
  const validationResult = AnalyticsEventSchema.safeParse(rawEventData);

  if (!validationResult.success) {
    // La falla de validación analítica no debe interrumpir el flujo del usuario.
    return;
  }

  const validatedEvent: IAnalyticsEvent = validationResult.data;

  /**
   * Lógica interna de despacho para ser ejecutada durante periodos de inactividad del navegador.
   */
  const dispatchAnalyticsPayload = (): void => {
    // 2. Higiene de Datos (Soberanía de Privacidad): Anonimización Absoluta.
    // Se asegura que los datos que salen del búnker no contengan trazas de identidad directa.
    const _sanitizedPayload = {
      ...validatedEvent,
      userIdentifier: validatedEvent.userIdentifier ? 'ANONYMIZED_CITIZEN' : 'GUEST'
    };

    // TODO: Implementar Transport Layer final (Ej: navigator.sendBeacon)
  };

  // 3. Orquestación de Performance: Delegación al periodo de inactividad (Idle)
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => dispatchAnalyticsPayload());
  } else {
    // Fallback para navegadores sin soporte de Idle API o entornos Node (SSR)
    setTimeout(() => dispatchAnalyticsPayload(), 0);
  }
};
