/**
 * @section Telemetry Logic - Atomic Signal Dispatcher
 * @description Punto de despacho único y soberano para señales de telemetría.
 * Valida la integridad de la señal contra el contrato de ADN y delega el
 * transporte físico al driver especializado.
 *
 * Protocolo OEDP-V16.0 - High Performance & Separation of Concerns (SRP).
 * SANEADO Zenith: Atomización de la lógica de transporte hacia 'LogTransportDriver'.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { TelemetrySignalSchema } from '../../schemas/TelemetrySignal.schema';
import type { ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';
import {
  isDevelopmentEnvironmentActiveBoolean,
  QueueTelemetrySignalForTransport
} from '../drivers/LogTransportDriver';

/**
 * Valida el contrato de integridad de la señal entrante y coordina su
 * persistencia asíncrona en el bus de datos institucional.
 *
 * @param rawTelemetrySignalPayload - Datos crudos del evento capturado en el sistema.
 * @returns {void} No retorna valor para garantizar latencia cero en el llamante.
 */
export const EmitTelemetrySignal = (rawTelemetrySignalPayload: unknown): void => {

  // 1. ADUANA DE INTEGRIDAD: Validación estricta mediante Esquema Soberano
  const signalValidationResult = TelemetrySignalSchema.safeParse(rawTelemetrySignalPayload);

  if (!signalValidationResult.success) {
    /**
     * @section Gestión de Fallo de ADN (Audit Trail)
     * Si la señal está corrupta, se reporta exclusivamente mediante 'warn'
     * para cumplimiento de la regla ESLint 'no-console'.
     */
    if (isDevelopmentEnvironmentActiveBoolean()) {
      const validationIssuesMetadata = signalValidationResult.error.format();

      console.warn(
        '[CRITICAL_TELEMETRY_INTEGRITY_VIOLATION]: El paquete de telemetría no cumple el contrato.',
        {
          receivedPayloadSnapshot: rawTelemetrySignalPayload,
          structuralIssuesCollection: validationIssuesMetadata
        }
      );
    }
    return;
  }

  const validatedSignalPayload: ITelemetrySignal = signalValidationResult.data;

  // 2. DELEGACIÓN AL MOTOR DE TRANSPORTE (SRE Logic)
  QueueTelemetrySignalForTransport(validatedSignalPayload);
};
