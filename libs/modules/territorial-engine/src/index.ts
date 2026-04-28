/**
 * @section Territorial Engine - Package Entry Point
 * Protocolo OEDP-V16.0 - Single Source Resolution.
 */

/** @section ADN Estructural */
export * from './lib/schemas/TerritorialEntity.schema';
export * from './lib/schemas/IbgeTerritorialProtocols.schema';
export * from './lib/i18n/TerritorialEngineI18n.schema';

/** @section Motores de Lógica */
export { SyncFlorianopolisTerritorialData } from './lib/logic/SyncFlorianopolisTerritorialData';

export const TERRITORIAL_ENGINE_VERSION = '1.1.0';
