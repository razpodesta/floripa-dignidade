/**
 * @section Utility Logic - Presence Sentry Hook (Sensor)
 * @description Orquestador sensorial encargado de monitorear la actividad física
 * del ciudadano mediante eventos del navegador. Sincroniza los latidos (Heartbeats)
 * con el State Store soberano.
 *
 * Protocolo OEDP-V17.0 - High Performance, SRE Resilience & ISO Standards.
 * SANEADO Zenith: Resolución de error 'sort-imports' y atomización de lógica.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { useCallback, useEffect } from 'react';
import { useGlobalStateStore } from '../state-store';
import { DetermineTargetPresenceStatus } from '../logic/DetermineTargetPresenceStatus';

/**
 * @interface IUsePresenceSentryResult
 * @description Contrato de salida inmutable para la auditoría del sensor.
 */
interface IUsePresenceSentryResult {
  /** Indica si el sistema de vigilancia sensorial está operativo. */
  readonly isSentryActiveBoolean: boolean;
}

/**
 * Hook de élite para la gestión automatizada de presencia ciudadana.
 * Implementa una estrategia de "Passive Listening" para optimizar el Main Thread.
 *
 * @returns {IUsePresenceSentryResult} Estado de activación del sensor.
 */
export const usePresenceSentry = (): IUsePresenceSentryResult => {
  const {
    SetAvailabilityStatusAction,
    availabilityStatus
  } = useGlobalStateStore((state) => ({
    SetAvailabilityStatusAction: state.SetAvailabilityStatusAction,
    availabilityStatus: state.availabilityStatus
  }));

  /**
   * @section Sincronización de Señales
   * Transfiere el estado detectado por el hardware al búnker de memoria.
   */
  const executePresenceSynchronizationAction = useCallback(() => {
    // 1. Captura de señales físicas del dispositivo
    const targetStatus = DetermineTargetPresenceStatus({
      isNavigatorOnlineBoolean: navigator.onLine,
      documentVisibilityStateLiteral: document.visibilityState
    });

    // 2. Commmit selectivo (Evita mutaciones redundantes)
    if (targetStatus !== availabilityStatus) {
      SetAvailabilityStatusAction(targetStatus);
    }
  }, [availabilityStatus, SetAvailabilityStatusAction]);

  useEffect(() => {
    /**
     * @section Registro de Sensores (Hardware Listeners)
     * Utilizamos eventos de enfoque y visibilidad para detectar el rastro humano.
     */
    window.addEventListener('focus', executePresenceSynchronizationAction);
    window.addEventListener('blur', executePresenceSynchronizationAction);
    window.addEventListener('online', executePresenceSynchronizationAction);
    window.addEventListener('offline', executePresenceSynchronizationAction);
    document.addEventListener('visibilitychange', executePresenceSynchronizationAction);

    /**
     * @section Heartbeat Preventivo (Keep-Alive)
     * Sincronización forzada para mitigar sesiones 'zombie'.
     * @constant HEARTBEAT_INTERVAL_MILLISECONDS - 120,000 (2 Minutos).
     */
    const HEARTBEAT_INTERVAL_MILLISECONDS_QUANTITY = 120000;
    const heartbeatTimerReference = setInterval(
      executePresenceSynchronizationAction,
      HEARTBEAT_INTERVAL_MILLISECONDS_QUANTITY
    );

    // Inferencia de estado inmediata al montaje del sensor.
    executePresenceSynchronizationAction();

    return () => {
      window.removeEventListener('focus', executePresenceSynchronizationAction);
      window.removeEventListener('blur', executePresenceSynchronizationAction);
      window.removeEventListener('online', executePresenceSynchronizationAction);
      window.removeEventListener('offline', executePresenceSynchronizationAction);
      document.removeEventListener('visibilitychange', executePresenceSynchronizationAction);
      clearInterval(heartbeatTimerReference);
    };
  }, [executePresenceSynchronizationAction]);

  return {
    isSentryActiveBoolean: true
  };
};
