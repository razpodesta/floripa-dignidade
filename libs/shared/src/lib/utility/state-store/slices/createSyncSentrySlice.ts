/**
 * @section State Slice - Sync Sentry (SRE Connectivity)
 * @description Sensor de resiliencia encargado de monitorear el estado de la red 
 * y gestionar la cola de acciones pendientes de sincronización. Garantiza 
 * la integridad de la experiencia en escenarios offline.
 * 
 * Protocolo OEDP-V16.0 - Functional Atomicity & Forensic Traceability.
 * @author Raz Podestá - MetaShark Tech
 */

import type { StateCreator } from 'zustand';
import { 
  EmitTelemetrySignal, 
  GenerateCorrelationIdentifier 
} from '@floripa-dignidade/telemetry';
import type { IGlobalStateADN } from '../schemas/GlobalState.schema';

/**
 * @interface ISyncSentryActions
 * @description Acciones atómicas para la gobernanza de la sincronización.
 */
export interface ISyncSentryActions {
  /** Actualiza el estado físico de la conexión detectado por el navegador. */
  readonly UpdateNetworkStatusAction: (isOnlineBoolean: boolean) => void;
  
  /** Registra una nueva acción en la cola de espera por falta de red. */
  readonly IncrementPendingQueueAction: () => void;
  
  /** Notifica la finalización de un despacho físico exitoso. */
  readonly MarkSuccessfulSyncAction: () => void;
}

export type TSyncSentrySlice = IGlobalStateADN['sync'] & ISyncSentryActions;

/**
 * Generador de la rebanada de Sincronización SRE.
 */
export const createSyncSentrySlice: StateCreator<TSyncSentrySlice, [], [], TSyncSentrySlice> = (set, get) => ({
  // --- ESTADO INICIAL ---
  isNetworkOnlineBoolean: true,
  pendingActionsQueueQuantity: 0,
  lastSuccessfulSyncTimestampISO: undefined,

  // --- ACCIONES DE ÉLITE ---
  
  UpdateNetworkStatusAction: (isOnlineBoolean) => {
    const previousStatusBoolean = get().isNetworkOnlineBoolean;
    
    /** 
     * @section Telemetría de Frontera 
     * Emitimos señal solo si hay un cambio real en el estado de red.
     */
    if (previousStatusBoolean !== isOnlineBoolean) {
      void EmitTelemetrySignal({
        severityLevel: isOnlineBoolean ? 'INFO' : 'WARNING',
        moduleIdentifier: 'SYNC_SENTRY_SLICE',
        operationCode: isOnlineBoolean ? 'NETWORK_RESTORED' : 'NETWORK_LOST',
        correlationIdentifier: GenerateCorrelationIdentifier(),
        message: isOnlineBoolean 
          ? 'Conexión recuperada. Iniciando enjambre de sincronización.' 
          : 'Se ha perdido la conexión. Activando modo de resiliencia local.',
        contextMetadata: {
          pendingActionsQuantity: get().pendingActionsQueueQuantity
        }
      });
      
      set({ isNetworkOnlineBoolean: isOnlineBoolean });
    }
  },

  IncrementPendingQueueAction: () => {
    set((state) => ({ 
      pendingActionsQueueQuantity: state.pendingActionsQueueQuantity + 1 
    }));
  },

  MarkSuccessfulSyncAction: () => {
    set((state) => ({
      pendingActionsQueueQuantity: Math.max(0, state.pendingActionsQueueQuantity - 1),
      lastSuccessfulSyncTimestampISO: new Date().toISOString()
    }));
  }
});