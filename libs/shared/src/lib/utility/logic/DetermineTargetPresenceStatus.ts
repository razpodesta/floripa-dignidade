/**
 * @section Utility Logic - Presence Determination Atom
 * @description Átomo de lógica pura encargado de resolver el estado ontológico
 * de presencia ciudadana basado en señales físicas del hardware y conectividad.
 * Isola la matriz de decisión de la infraestructura de React y Zustand.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Pure Logic.
 * SANEADO Zenith: Resolución de error TS2305 mediante nivelación de SSOT en Shared.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * 🛡️ SANEADO Zenith: Importación de ADN nominal inmutable.
 * Tras la nivelación del paso 1, este tipo ahora es legítimo en el búnker 'state-store'.
 */
import type { TAvailabilityStatus } from '../state-store';

/**
 * @interface IPresenceSignals
 * @description Snapshot de las señales físicas capturadas del entorno del navegador.
 */
interface IPresenceSignals {
  /** Estado de conectividad reportado por el sensor 'navigator.onLine'. */
  readonly isNavigatorOnlineBoolean: boolean;

  /** Estado de visibilidad de la pestaña reportado por 'document.visibilityState'. */
  readonly documentVisibilityStateLiteral: DocumentVisibilityState;
}

/**
 * Determina el siguiente estado de disponibilidad sin efectos secundarios (Función Pura).
 *
 * @param signals - Colección de señales de hardware capturadas.
 * @returns {TAvailabilityStatus} El estado calculado para la sincronización del State Store.
 */
export const DetermineTargetPresenceStatus = (
  signals: IPresenceSignals
): TAvailabilityStatus => {
  /**
   * @section Matriz de Decisión de Presencia
   * Prioridad 1: Interrupción física de red (Soberanía de Conexión).
   */
  if (!signals.isNavigatorOnlineBoolean) {
    return 'OFFLINE';
  }

  /**
   * Prioridad 2: Inactividad por pérdida de foco o minimización (Visibility API).
   */
  if (signals.documentVisibilityStateLiteral === 'hidden') {
    return 'AWAY';
  }

  /**
   * Prioridad 3: Estado nominal activo (Ciudadano presente e interactuando).
   */
  return 'ONLINE';
};
