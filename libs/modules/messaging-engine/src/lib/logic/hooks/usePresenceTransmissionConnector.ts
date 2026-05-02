'use client';

/**
 * @section Messaging Logic - Presence Transmission Connector (Hook)
 * @description Orquestador de sincronização encarregado de vincular o State Store
 * volátil com o Tier de Dados persistente.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Resolução de TS7006 (Explicit State Typing) e Atomização SRP.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { useEffect, useRef } from 'react';

/* 1. Infraestrutura Shared & Store (Verbatim Module Syntax) */
import { useGlobalStateStore } from '@floripa-dignidade/shared';
import type { IGlobalSovereignStore } from '@floripa-dignidade/shared';

/* 2. Infraestrutura Core & Telemetria */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 3. Motores de Mutação e Átomos Locais */
import { UpdateUserPresence } from '../mutators/UpdateUserPresence';
import { CalculatePresenceStateSignature } from '../atomic/CalculatePresenceStateSignature';
import { DetermineDevicePlatform } from '../atomic/DetermineDevicePlatform';

/** Identificador técnico do sensor para o Neural Sentinel. */
const SENSOR_IDENTIFIER = 'PRESENCE_SYNC_CONNECTOR';

/**
 * Hook orquestador para a persistência automática do pulso de vida cidadão.
 *
 * @param citizenIdentifier - UUID da identidade soberana ativa.
 */
export const usePresenceTransmissionConnector = (
  citizenIdentifier: string | undefined
): void => {
  /**
   * @section Captura de Enxame de Estado
   * 🛡️ SANEADO Zenith: Tipagem explícita '(state: IGlobalSovereignStore)'
   * resolve o erro TS7006 e garante inteligência total do IDE.
   */
  const presenceSnapshot = useGlobalStateStore((state: IGlobalSovereignStore) => ({
    availabilityStatus: state.availabilityStatus,
    customStatusMessageLiteral: state.customStatusMessageLiteral,
    activePushTokenSecret: state.activePushTokenSecret,
    lastHeartbeatTimestampISO: state.lastHeartbeatTimestampISO
  }));

  const lastSynchronizedSignatureReference = useRef<string>('');

  useEffect(() => {
    if (!citizenIdentifier) return;

    const correlationIdentifier = GenerateCorrelationIdentifier();

    // 1. CÁLCULO DE ASSINATURA (Delegación Atômica)
    const currentSignatureLiteral = CalculatePresenceStateSignature({
      status: presenceSnapshot.availabilityStatus,
      message: presenceSnapshot.customStatusMessageLiteral,
      token: presenceSnapshot.activePushTokenSecret
    });

    // Filtro de idempotência: Evita tráfego desnecessário se o estado é idêntico
    if (currentSignatureLiteral === lastSynchronizedSignatureReference.current) {
      return;
    }

    /**
     * @section Execução de Sincronização Cloud (SRE Strategy)
     * Implementa debounce técnico de 1.5s para estabilizar flutuações de rede.
     */
    const synchronizationTimerReference = setTimeout(async () => {
      try {
        const platformLiteral = DetermineDevicePlatform();

        await UpdateUserPresence({
          citizenIdentifier,
          currentAvailabilityStatus: presenceSnapshot.availabilityStatus,
          customStatusMessageLiteral: presenceSnapshot.customStatusMessageLiteral,
          lastActivePlatformLiteral: platformLiteral,
          activePushSubscriptionTokenSecret: presenceSnapshot.activePushTokenSecret,
          lastHeartbeatTimestampISO: presenceSnapshot.lastHeartbeatTimestampISO
        });

        lastSynchronizedSignatureReference.current = currentSignatureLiteral;

        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: SENSOR_IDENTIFIER,
          operationCode: 'PRESENCE_AUTO_SYNC_NOMINAL',
          correlationIdentifier,
          message: 'MESSAGING.LOGS.HEARTBEAT_NOMINAL',
          contextMetadata: { platform: platformLiteral }
        });

      } catch (caughtError: unknown) {
        void EmitTelemetrySignal({
          severityLevel: 'ERROR',
          moduleIdentifier: SENSOR_IDENTIFIER,
          operationCode: 'PRESENCE_AUTO_SYNC_FAULT',
          correlationIdentifier,
          message: 'Falha na persistência automática do pulso de presença.',
          contextMetadata: { errorTrace: String(caughtError) }
        });
      }
    }, 1500);

    return () => clearTimeout(synchronizationTimerReference);
  }, [presenceSnapshot, citizenIdentifier]);
};
