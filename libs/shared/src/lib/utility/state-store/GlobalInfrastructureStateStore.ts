/**
 * @section Infrastructure Logic - Global State Swarm Orchestrator
 * @description Punto de ensamblaje maestro para el enjambre de memoria institucional.
 * Orquesta la fusión de rebanadas lógicas (Slices) y aplica políticas de
 * persistencia soberana.
 *
 * Protocolo OEDP-V17.0 - High Performance, SRE Resilience & ISO Standards.
 * SANEADO Zenith: Resolución de error 'sort-imports' y atomización de lógica.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/* 1. Enjambre de Rebanadas Lógicas (Slices) */
import { createGovernanceSlice, type TGovernanceSlice } from './slices/createGovernanceSlice';
import { createPresenceSlice, type TPresenceSlice } from './slices/createPresenceSlice';
import { createReputationSlice, type TReputationSlice } from './slices/createReputationSlice';
import { createSyncSentrySlice, type TSyncSentrySlice } from './slices/createSyncSentrySlice';
import { createUiSlice, type TUiSlice } from './slices/createUiSlice';

/* 2. Átomos de Lógica y Persistencia (Sovereign Swarm) */
import { StatePersistenceFilter } from './logic/StatePersistenceFilter';
import { StateHydrationAuditor } from './logic/StateHydrationAuditor';

/**
 * @interface IGlobalSovereignStore
 * @description Unión inmutable de todos los contratos lógicos del enjambre.
 */
export type IGlobalSovereignStore =
  TUiSlice &
  TReputationSlice &
  TSyncSentrySlice &
  TPresenceSlice &
  TGovernanceSlice;

/**
 * @name useGlobalStateStore
 * @description Única Fuente de Verdad (SSOT) para el estado cognitivo del ecosistema.
 * Implementa persistencia multinivel basada en el Estándar de Soberanía ADR 0025.
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
      /** Identificador físico del búnker de memoria en el hardware local. */
      name: 'fd-sovereign-vault-v1',

      /** 🛡️ SANEADO Zenith: Miembros de importación ordenados alfabéticamente. */
      storage: createJSONStorage(() => localStorage),

      /** 🛡️ SANEADO Zenith: Delegación de auditoría al átomo especializado. */
      onRehydrateStorage: StateHydrationAuditor,

      /** 🛡️ SANEADO Zenith: Delegación del filtro de soberanía al átomo lógico. */
      partialize: StatePersistenceFilter,
    }
  )
);
