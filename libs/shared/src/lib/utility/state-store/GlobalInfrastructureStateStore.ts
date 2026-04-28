/**
 * @section Infrastructure Logic - Global State Swarm Orchestrator
 * @description Punto de ensamblaje maestro para el enjambre de memoria institucional.
 * Orquesta la fusión de rebanadas lógicas (Slices) y aplica políticas de
 * persistencia selectiva basadas en el Manifiesto ADR 0025.
 * 
 * Protocolo OEDP-V16.0 - High Performance, SRE Resilience & Liquid Democracy.
 * SANEADO Zenith: Resolución de error TS6133 (Unused Variable) y rastro forense.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* 1. Infraestructura de Telemetría (Standard PascalCase) */
import { 
  EmitTelemetrySignal, 
  GenerateCorrelationIdentifier 
} from '@floripa-dignidade/telemetry';

/* 2. Enjambre de Rebanadas Lógicas (Atomic Slices) */
import { createUiSlice, type TUiSlice } from './slices/createUiSlice';
import { createReputationSlice, type TReputationSlice } from './slices/createReputationSlice';
import { createSyncSentrySlice, type TSyncSentrySlice } from './slices/createSyncSentrySlice';
import { createPresenceSlice, type TPresenceSlice } from './slices/createPresenceSlice';
import { createGovernanceSlice, type TGovernanceSlice } from './slices/createGovernanceSlice';

/**
 * @interface IGlobalSovereignStore
 * @description Unión inmutable de todos los contratos lógicos del enjambre.
 */
type IGlobalSovereignStore = 
  TUiSlice & 
  TReputationSlice & 
  TSyncSentrySlice & 
  TPresenceSlice & 
  TGovernanceSlice;

/**
 * @name useGlobalStateStore
 * @description Única Fuente de Verdad (SSOT) para el estado cognitivo del ecosistema.
 * Utiliza el patrón de persistencia 'Stale-While-Revalidate' para performance.
 */
export const useGlobalStateStore = create<IGlobalSovereignStore>()(
  persist(
    (...args) => ({
      ...createUiSlice(...args),
      ...createReputationSlice(...args),
      ...createSyncSentrySlice(...args),
      ...createPresenceSlice(...args),
      ...createGovernanceSlice(...args),
    }),
    {
      /** Identificador físico del búnker de memoria en el navegador. */
      name: 'fd-sovereign-vault-v1',
      storage: createJSONStorage(() => localStorage),
      
      /**
       * @section Auditoría SRE (Hydration Guard)
       * SANEADO Zenith: El parámetro inicial se marca como '_' para evitar TS6133.
       */
      onRehydrateStorage: (_state) => {
        const correlationIdentifier = GenerateCorrelationIdentifier();
        
        return (rehydratedState, error) => {
          if (error) {
            void EmitTelemetrySignal({
              severityLevel: 'ERROR',
              moduleIdentifier: 'GLOBAL_STATE_ORCHESTRATOR',
              operationCode: 'STATE_HYDRATION_FAULT',
              correlationIdentifier,
              message: 'Fallo crítico al intentar recuperar la soberanía del disco local.',
              contextMetadata: { errorTrace: String(error) }
            });
            return;
          }

          void EmitTelemetrySignal({
            severityLevel: 'INFO',
            moduleIdentifier: 'GLOBAL_STATE_ORCHESTRATOR',
            operationCode: 'STATE_HYDRATION_NOMINAL',
            correlationIdentifier,
            message: 'Soberanía recuperada: Memoria institucional sincronizada con el disco.',
            contextMetadata: { 
              hasMandatary: !!rehydratedState?.activeMandataryIdentifier,
              isOnline: rehydratedState?.availabilityStatus === 'ONLINE'
            }
          });
        };
      },

      /**
       * @section Filtro de Soberanía (ADR 0025)
       * Seleccionamos exclusivamente qué fragmentos de ADN deben ser 'Inmortales'.
       */
      partialize: (state) => ({
        // Dominio: Identidad & Reputación
        actorAuthorityWeightNumeric: state.actorAuthorityWeightNumeric,
        lastViewedIndicatorsMapping: state.lastViewedIndicatorsMapping,
        
        // Dominio: Gobernanza & Democracia Líquida
        activeMandataryIdentifier: state.activeMandataryIdentifier,
        favoriteGroupsCollection: state.favoriteGroupsCollection,
        communitySeniorityLevelQuantity: state.communitySeniorityLevelQuantity,
        
        // Dominio: Presencia & Hardware
        activePushTokenSecret: state.activePushTokenSecret,
        customStatusMessageLiteral: state.customStatusMessageLiteral,
        
        // Dominio: Resiliencia SRE
        pendingActionsQueueQuantity: state.pendingActionsQueueQuantity,
        lastSuccessfulSyncTimestampISO: state.lastSuccessfulSyncTimestampISO,
      }),
    }
  )
);