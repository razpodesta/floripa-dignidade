/**
 * @section State Slice - Reputation & Impact Cache
 * @description Orquesta la identidad bayesiana del actor y la memoria de corto 
 * plazo para evitar pantallas en blanco mediante 'Stale-While-Revalidate'.
 * 
 * Protocolo OEDP-V16.0 - High Performance & Bayesian Context.
 */

import type { StateCreator } from 'zustand';
import type { IGlobalStateADN } from '../schemas/GlobalState.schema';

export interface IReputationActions {
  readonly UpdateActorAuthorityWeight: (weightNumeric: number) => void;
  readonly CacheImpactIndicatorAction: (entityIdentifier: string, trustScore: number, consensusIndex: number) => void;
}

export type TReputationSlice = IGlobalStateADN['identity'] & IGlobalStateADN['impactCache'] & IReputationActions;

export const createReputationSlice: StateCreator<TReputationSlice, [], [], TReputationSlice> = (set) => ({
  // --- ESTADO INICIAL ---
  actorAuthorityWeightNumeric: 0.1,
  isVerifiedHumanBoolean: false,
  lastViewedIndicatorsMapping: {},

  // --- ACCIONES ---
  UpdateActorAuthorityWeight: (weightNumeric) => set({ 
    actorAuthorityWeightNumeric: weightNumeric,
    isVerifiedHumanBoolean: weightNumeric >= 0.5 
  }),

  CacheImpactIndicatorAction: (entityIdentifier, trustScore, consensusIndex) => 
    set((state) => ({
      lastViewedIndicatorsMapping: {
        ...state.lastViewedIndicatorsMapping,
        [entityIdentifier]: { trustScore, consensusIndex }
      }
    }))
});