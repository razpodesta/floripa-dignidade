/**
 * @section Messaging Logic - Presence Transmission Connector (Hook)
 * @description Orquestador de sincronización encargado de vincular el State Store 
 * volátil con el Tier de Datos persistente. Detecta cambios de disponibilidad 
 * y rastro de hardware, ejecutando mutaciones asíncronas con telemetría integrada.
 * 
 * Protocolo OEDP-V16.0 - High Performance SRE & Cross-Module Synchronization.
 * Vision: Real-time Presence Convergence (Cloud-Sovereign).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { useEffect, useRef } from 'react';

/** 1. Infraestructura de Memoria Global (Capa Shared) */
import { useGlobalStateStore } from '@floripa-dignidade/shared';

/** 2. Infraestructura Core & Telemetría */
import { 
  EmitTelemetrySignal, 
  GenerateCorrelationIdentifier 
} from '@floripa-dignidade/telemetry';

/** 3. Motores de Mutación Locales */
import { UpdateUserPresence } from '../mutators/UpdateUserPresence';

/**
 * Hook orquestador para la persistencia automática del pulso de vida ciudadano.
 * 
 * @param citizenIdentifier - UUID de la identidad soberana activa.
 */
export const usePresenceTransmissionConnector = (
  citizenIdentifier: string | undefined
): void => {
  /**
   * @section Captura de Enjambre de Estado
   * Escuchamos exclusivamente los cambios en el dominio de presencia.
   */
  const presenceSnapshot = useGlobalStateStore((state) => ({
    availabilityStatus: state.availabilityStatus,
    customStatusMessageLiteral: state.customStatusMessageLiteral,
    activePushTokenSecret: state.activePushTokenSecret,
    lastHeartbeatTimestampISO: state.lastHeartbeatTimestampISO
  }));

  /** Referencia para evitar sincronizaciones redundantes (Same-state filter) */
  const lastSynchronizedStateReference = useRef<string>('');

  useEffect(() => {
    /** Bloqueo de seguridad: No hay identidad para sincronizar */
    if (!citizenIdentifier) return;

    const correlationIdentifier = GenerateCorrelationIdentifier();

    /**
     * @section Algoritmo de Estabilización (SRE Optimization)
     * Calculamos una firma del estado actual para detectar cambios reales.
     */
    const currentStateSignatureLiteral = JSON.stringify({
      status: presenceSnapshot.availabilityStatus,
      msg: presenceSnapshot.customStatusMessageLiteral,
      token: presenceSnapshot.activePushTokenSecret
    });

    if (currentStateSignatureLiteral === lastSynchronizedStateReference.current) {
      return;
    }

    /**
     * @section Ejecución de Sincronización Cloud
     * Implementamos un pequeño retardo (Debounce) de 1.5s para asegurar que
     * el estado del usuario sea estable (ej: no disparar si solo pasó rápido por la pestaña).
     */
    const synchronizationTimerReference = setTimeout(async () => {
      try {
        // Determinamos la plataforma de origen mediante el sensor de hardware nativo
        const isMobileBoolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const platformLiteral = isMobileBoolean ? 'PWA_MOBILE_ANDROID' : 'WEB_DESKTOP';

        await UpdateUserPresence({
          citizenIdentifier,
          currentAvailabilityStatus: presenceSnapshot.availabilityStatus,
          customStatusMessageLiteral: presenceSnapshot.customStatusMessageLiteral,
          lastActivePlatformLiteral: platformLiteral,
          activePushSubscriptionTokenSecret: presenceSnapshot.activePushTokenSecret,
          lastHeartbeatTimestampISO: presenceSnapshot.lastHeartbeatTimestampISO
        });

        lastSynchronizedStateReference.current = currentStateSignatureLiteral;

        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: 'PRESENCE_CONNECTOR_HOOK',
          operationCode: 'PRESENCE_CLOUD_SYNC_SUCCESS',
          correlationIdentifier,
          message: 'MESSAGING.LOGS.HEARTBEAT_NOMINAL',
          contextMetadata: { 
            status: presenceSnapshot.availabilityStatus,
            platform: platformLiteral 
          }
        });

      } catch (caughtError: unknown) {
        void EmitTelemetrySignal({
          severityLevel: 'ERROR',
          moduleIdentifier: 'PRESENCE_CONNECTOR_HOOK',
          operationCode: 'PRESENCE_CLOUD_SYNC_FAULT',
          correlationIdentifier,
          message: 'Fallo al sincronizar el pulso de vida con la infraestructura soberana.',
          contextMetadata: { errorTrace: String(caughtError) }
        });
      }
    }, 1500);

    return () => clearTimeout(synchronizationTimerReference);
  }, [presenceSnapshot, citizenIdentifier]);
};