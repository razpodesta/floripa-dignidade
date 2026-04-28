/**
 * @section State Slice - Liquid Democracy & Democratic Governance
 * @description Átomo encargado de gestionar la delegación de soberanía de voto,
 * la jerarquía de moderación por mérito y el rastro de favoritos del ciudadano.
 * 
 * Protocolo OEDP-V16.0 - Sovereign Governance & Swarm Intelligence.
 * SANEADO Zenith: Sincronización absoluta con IGlobalStateADN['governance'].
 * 
 * @author Raz Podestá - MetaShark Tech
 */

import type { StateCreator } from 'zustand';
import type { IGlobalStateADN } from '../schemas/GlobalState.schema';

/**
 * @interface IGovernanceActions
 * @description Acciones soberanas para el ejercicio de la democracia digital.
 */
export interface IGovernanceActions {
  /** 
   * Asigna un mandatario temporal o permanente para el ejercicio del voto delegado.
   * Implementa el principio de Democracia Líquida.
   */
  readonly DelegateSovereigntyAction: (mandataryIdentifier: string) => void;
  
  /** 
   * Revoca cualquier delegación activa y recupera el ejercicio directo de la soberanía.
   */
  readonly ReclaimSovereigntyAction: () => void;
  
  /** 
   * Alterna el estado de un Action Hub en la colección de favoritos del ciudadano.
   */
  readonly ToggleFavoriteGroupAction: (groupIdentifier: string) => void;

  /**
   * Actualiza el nivel de antigüedad tras una auditoría del Neural Sentinel.
   */
  readonly UpdateCommunitySeniorityAction: (seniorityLevel: number) => void;
}

/** 
 * @name TGovernanceSlice
 * @description Unión del ADN estructural de gobernanza y sus motores de mutación.
 */
export type TGovernanceSlice = IGlobalStateADN['governance'] & IGovernanceActions;

/**
 * Generador de la rebanada de Gobernanza Democrática.
 */
export const createGovernanceSlice: StateCreator<TGovernanceSlice, [], [], TGovernanceSlice> = (set) => ({
  
  // --- 1. ESTADO INICIAL (ADN Gobernanza) ---
  activeMandataryIdentifier: null,
  isIdentityBiometricallyVerifiedBoolean: false,
  communitySeniorityLevelQuantity: 0,
  favoriteGroupsCollection: [],

  // --- 2. ACCIONES SOBERANAS (Motores de Mutación) ---

  DelegateSovereigntyAction: (mandataryIdentifier) => set({ 
    activeMandataryIdentifier: mandataryIdentifier 
  }),

  ReclaimSovereigntyAction: () => set({ 
    activeMandataryIdentifier: null 
  }),

  ToggleFavoriteGroupAction: (groupIdentifier) => set((state) => ({
    favoriteGroupsCollection: state.favoriteGroupsCollection.includes(groupIdentifier)
      ? state.favoriteGroupsCollection.filter((id) => id !== groupIdentifier)
      : [...state.favoriteGroupsCollection, groupIdentifier]
  })),

  UpdateCommunitySeniorityAction: (seniorityLevel) => set({
    communitySeniorityLevelQuantity: seniorityLevel
  })
});