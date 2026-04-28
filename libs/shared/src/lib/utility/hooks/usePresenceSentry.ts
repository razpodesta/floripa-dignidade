/**
 * @section Utility Logic - Presence Sentry Hook
 * @description Sensor de frontera encargado de monitorear la actividad física del
 * ciudadano. Utiliza la Visibility API para detectar estados 'AWAY' y sincroniza
 * los latidos (Heartbeats) con el State Store soberano.
 * 
 * Protocolo OEDP-V16.0 - High Performance, SRE Resilience & Privacy by Design.
 * Vision: Expert Presence Tracking (Better than WhatsApp).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { useEffect, useCallback } from 'react';
import { useGlobalStateStore } from '../state-store';

/**
 * @interface IUsePresenceSentryResult
 * @description Contrato de salida para la auditoría de presencia en la interfaz.
 */
interface IUsePresenceSentryResult {
  /** Indica si el sistema está capturando señales de vida actualmente. */
  readonly isSentryActiveBoolean: boolean;
}

/**
 * Hook de élite para la gestión automatizada de presencia ciudadana.
 * Implementa detección de inactividad por desenfoque de pestaña y desconexión de red.
 *
 * @returns {IUsePresenceSentryResult} Estado del sensor.
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
   * @section Lógica de Inferencia de Estado
   * SANEADO Zenith: Traducción de señales físicas a estados ontológicos.
   */
  const synchronizePhysicalPresenceAction = useCallback(() => {
    // CASO 1: Dispositivo Offline
    if (!navigator.onLine) {
      if (availabilityStatus !== 'OFFLINE') {
        SetAvailabilityStatusAction('OFFLINE');
      }
      return;
    }

    // CASO 2: Pestaña en segundo plano (Inactividad detectada)
    if (document.visibilityState === 'hidden') {
      SetAvailabilityStatusAction('AWAY');
      return;
    }

    // CASO 3: Actividad plena
    SetAvailabilityStatusAction('ONLINE');
  }, [availabilityStatus, SetAvailabilityStatusAction]);

  useEffect(() => {
    /** 🛡️ SANEADO: Suscripción a eventos del sistema operativo y navegador */
    window.addEventListener('focus', synchronizePhysicalPresenceAction);
    window.addEventListener('blur', synchronizePhysicalPresenceAction);
    document.addEventListener('visibilitychange', synchronizePhysicalPresenceAction);

    /** 
     * Heartbeat Preventivo:
     * Sincronización forzada cada 2 minutos para evitar sesiones zombie
     * en el Tier de Datos (Supabase).
     */
    const heartbeatIntervalQuantity = 120000;
    const heartbeatTimerReference = setInterval(
      synchronizePhysicalPresenceAction, 
      heartbeatIntervalQuantity
    );

    // Sincronización inicial al montar el aparato
    synchronizePhysicalPresenceAction();

    return () => {
      window.removeEventListener('focus', synchronizePhysicalPresenceAction);
      window.removeEventListener('blur', synchronizePhysicalPresenceAction);
      document.removeEventListener('visibilitychange', synchronizePhysicalPresenceAction);
      clearInterval(heartbeatTimerReference);
    };
  }, [synchronizePhysicalPresenceAction]);

  return {
    isSentryActiveBoolean: true
  };
};