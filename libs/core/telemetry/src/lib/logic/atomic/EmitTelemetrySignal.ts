/**
 * @section Telemetry Logic - Atomic Signal Dispatcher
 * @description Ponto de despacho único e soberano para sinais de telemetría.
 * Valida a integridade da sinal contra o contrato de ADN (Zod) e delega
 * o transporte físico ao orquestrador de despacho asimétrico.
 *
 * Protocolo OEDP-V17.0 - High Performance & Swarm Intelligence.
 * SANEADO Zenith: Resolução de TS2724 (Sincronização com QueueTelemetrySignalForTransportAction).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { TelemetrySignalSchema } from '../../schemas/TelemetrySignal.schema';
import type { ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';

/* 1. Motores de Transporte (Drivers) */
/** 🛡️ SANEADO Zenith: Nome da ação sincronizado com a refatoração do LogTransportDriver */
import { QueueTelemetrySignalForTransportAction } from '../drivers/LogTransportDriver';

/* 2. Átomos de Detecção de Entorno (Isomorphic Swarm) */
import { DetermineDevelopmentEnvironment } from './DetermineDevelopmentEnvironment';

/**
 * Valida o contrato de integridade da sinal entrante e coordena sua
 * persistência asíncrona no bus de dados institucional.
 *
 * @param unvalidatedTelemetrySignalPayload - Dados brutos do evento capturado.
 * @returns {void}
 */
export const EmitTelemetrySignal = (unvalidatedTelemetrySignalPayload: unknown): void => {
  const telemetrySignalValidationResult = TelemetrySignalSchema.safeParse(
    unvalidatedTelemetrySignalPayload
  );

  if (!telemetrySignalValidationResult.success) {
    const isDevelopmentActiveBoolean = DetermineDevelopmentEnvironment();

    if (isDevelopmentActiveBoolean) {
      const validationIssuesMetadataCollection = telemetrySignalValidationResult.error.format();

      console.warn(
        '[CRITICAL_TELEMETRY_INTEGRITY_VIOLATION]: O pacote de telemetria viola o contrato soberano.',
        {
          receivedPayloadSnapshot: unvalidatedTelemetrySignalPayload,
          structuralIssuesCollection: validationIssuesMetadataCollection,
        },
      );
    }
    return;
  }

  const validatedTelemetrySignalSnapshot: ITelemetrySignal = telemetrySignalValidationResult.data;

  /**
   * @section Despacho SRE
   * 🛡️ SANEADO Zenith: Chamada da ação asíncrona marcada com 'void' para cumprir
   * a regra de 'no-floating-promises' do Linter.
   */
  void QueueTelemetrySignalForTransportAction(validatedTelemetrySignalSnapshot);
};
