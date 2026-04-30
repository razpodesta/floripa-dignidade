/**
 * @section Utility - State Store Package Entry Point (Barrel)
 * @description Centraliza y expone las capacidades de gestión de estado global,
 * resiliencia offline (SRE) y gobernanza democrática.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & Swarm Intelligence.
 * SANEADO Zenith: Exposición de ADN de presencia consolidado (TAvailabilityStatus).
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @section ADN Estructural (Schemas & Base Types)
 * Exportación de esquemas Zod y tipos nominales para la validación de fronteras.
 */
export * from './schemas/GlobalState.schema';

/**
 * @section Rebanadas Lógicas (Slices & Actions)
 * Exportación de tipos inmutables para la inyección de dependencias en el enjambre.
 */
export type { TUiSlice, IUiActions } from './slices/createUiSlice';
export type { TReputationSlice, IReputationActions } from './slices/createReputationSlice';
export type { TSyncSentrySlice, ISyncSentryActions } from './slices/createSyncSentrySlice';
export type { TPresenceSlice, IPresenceActions } from './slices/createPresenceSlice';
export type { TGovernanceSlice, IGovernanceActions } from './slices/createGovernanceSlice';

/**
 * @section Orquestadores y Guardianes
 * Punto de entrada único para el consumo de memoria en la interfaz React.
 */
export { useGlobalStateStore } from './GlobalInfrastructureStateStore';
export { PersistenceGuardian } from './components/PersistenceGuardian';

/**
 * @interface IGlobalSovereignStore
 * @description Exportación del tipo de la tienda completa para lógica atómica externa.
 */
export type { IGlobalSovereignStore } from './GlobalInfrastructureStateStore';

/**
 * @version 1.7.5
 * Estatus: Nivelación Zenith completada. Centralización de Soberanía de Presencia
 * y resolución de colisiones de tipos cross-module.
 */
export const GLOBAL_INFRASTRUCTURE_STATE_VERSION = '1.7.5';
