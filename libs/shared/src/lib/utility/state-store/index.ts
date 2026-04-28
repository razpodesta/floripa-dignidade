/**
 * @section Utility - State Store Package Entry Point (Barrel)
 * @description Centraliza y expone las capacidades de gestión de estado global, 
 * resiliencia offline (SRE) y gobernanza democrática. Actúa como el puente 
 * único entre la memoria volátil y la persistencia institucional.
 * 
 * Protocolo OEDP-V16.0 - Single Source Resolution & Swarm Intelligence.
 * SANEADO Zenith: Sincronización con el motor de hidratación v1.7.0.
 * 
 * @author Raz Podestá - MetaShark Tech
 */

/** 
 * @section ADN Estructural (Schemas)
 * Exportación de esquemas Zod para la validación de fronteras de estado.
 */
export * from './schemas/GlobalState.schema';

/** 
 * @section Rebanadas Lógicas (Slices & Actions)
 * Exportación de tipos inmutables para la inyección de dependencias en Hooks.
 * Se utiliza 'export type' para optimizar el empaquetado final.
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
 * @version 1.7.0
 * Estatus: Nivelación Zenith completada. Soporte para Democracia Líquida, 
 * Matriz de Presencia Experta y Auditoría Forense de Hidratación.
 */
export const GLOBAL_INFRASTRUCTURE_STATE_VERSION = '1.7.0';