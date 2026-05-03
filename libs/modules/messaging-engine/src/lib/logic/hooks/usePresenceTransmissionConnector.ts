'use client';

/**
 * @section Messaging Logic - Presence Transmission Orchestrator (Hook)
 * @description Orquestador de sincronización de presencia entre el State Store
 * y el Ledger de Persistencia. Gestiona idempotencia y resiliencia SRE.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance.
 */

import { useEffect, useRef } from 'react';
import { useGlobalStateStore } from '@floripa-dignidade/shared';
import type { IGlobalSovereignStore } from '@floripa-dignidade/shared';
import { EmitTelemetrySignal, GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';

/* Enjambre Atómico de Dominio */
import { UpdateUserPresence } from '../mutators/UpdateUserPresence';
import { CalculatePresenceSovereignSignature } from '../atomic/CalculatePresenceSovereignSignature';
import { IdentifyHardwarePlatform } from '../atomic/IdentifyHardwarePlatform';

const SENSOR_IDENTIFIER = 'PRESENCE_SYNC_CONNECTOR_HOOK';

export const usePresenceTransmissionConnector = (
  citizenIdentifierLiteral: string | undefined
): void => {
  /**
   * 🛡️ OPTIMIZACIÓN: Selector granular para evitar re-ejecuciones innecesarias.
   * Extraemos los valores primitivos para que la comparación de dependencias sea estable.
   */
  const availabilityStatus = useGlobalStateStore((state: IGlobalSovereignStore) => state.availabilityStatus);
  const customStatusMessageLiteral = useGlobalStateStore((state: IGlobalSovereignStore) => state.customStatusMessageLiteral);
  const activePushTokenSecret = useGlobalStateStore((state: IGlobalSovereignStore) => state.activePushTokenSecret);
  const lastHeartbeatTimestampISO = useGlobalStateStore((state: IGlobalSovereignStore) => state.lastHeartbeatTimestampISO);

  const lastSynchronizedSignatureReference = useRef<string>('');
  const isComponentMountedReference = useRef<boolean>(true);

  useEffect(() => {
    isComponentMountedReference.current = true;
    
    // 1. ADUANA DE IDENTIDAD
    if (!citizenIdentifierLiteral) return;

    const correlationIdentifier = GenerateCorrelationIdentifier();

    /**
     * 🛡️ FIX TS2379: Saneamiento de nulidad para exactOptionalPropertyTypes.
     * Forzamos a que el token sea un string (aunque sea vacío) para cumplir el contrato del átomo,
     * o aseguramos que el esquema acepte el tipo exacto.
     */
    const currentStatusSignature = CalculatePresenceSovereignSignature({
      status: availabilityStatus,
      customMessage: customStatusMessageLiteral ?? '',
      pushToken: activePushTokenSecret ?? '' // Normalización para evitar el error de asignación
    });

    // 2. FILTRO DE IDEMPOTENCIA: Evita saturación del Data Lake
    if (currentStatusSignature === lastSynchronizedSignatureReference.current) {
      return;
    }

    // 3. ESTRATEGIA DE PERSISTENCIA (Debounce SRE)
    const synchronizationTimerReference = setTimeout(async () => {
      try {
        const platformIdentifierLiteral = IdentifyHardwarePlatform();

        // Verificación de integridad de montaje (Evita fugas de memoria y errores de estado)
        if (!isComponentMountedReference.current) return;

        await UpdateUserPresence({
          citizenIdentifier: citizenIdentifierLiteral,
          currentAvailabilityStatus: availabilityStatus,
          customStatusMessageLiteral,
          lastActivePlatformLiteral: platformIdentifierLiteral,
          activePushSubscriptionTokenSecret: activePushTokenSecret,
          lastHeartbeatTimestampISO
        });

        lastSynchronizedSignatureReference.current = currentStatusSignature;

        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: SENSOR_IDENTIFIER,
          operationCode: 'PRESENCE_SYNC_NOMINAL',
          correlationIdentifier,
          message: 'Sincronización de presencia exitosa.',
          contextMetadataSnapshot: { platformLiteral: platformIdentifierLiteral }
        });

      } catch (caughtError: unknown) {
        if (!isComponentMountedReference.current) return;

        void EmitTelemetrySignal({
          severityLevel: 'ERROR',
          moduleIdentifier: SENSOR_IDENTIFIER,
          operationCode: 'PRESENCE_SYNC_COLLAPSE',
          correlationIdentifier,
          message: 'Fallo en la sincronización de presencia.',
          contextMetadataSnapshot: { 
            errorDescriptionLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError)
          }
        });
      }
    }, 1500);

    return () => {
      clearTimeout(synchronizationTimerReference);
      isComponentMountedReference.current = false;
    };
  }, [
    citizenIdentifierLiteral,
    availabilityStatus,
    customStatusMessageLiteral,
    activePushTokenSecret,
    lastHeartbeatTimestampISO
  ]);
};