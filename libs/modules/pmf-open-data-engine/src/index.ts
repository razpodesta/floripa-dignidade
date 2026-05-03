/**
 * @section PMF Open Data Engine - Package Entry Point (Barrel)
 * @description Único punto de exportación autorizado para el búnker de inteligencia
 * de datos abiertos. Orquesta la visibilidad de los contratos de ADN.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & Bundler-Ready Syntax.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con Turbopack,
 * alineación de nomenclatura ISO y soberanía de tipos bridados.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @version 1.2.3
 * Estatus: Nivelación Zenith completada. Resolución de colisiones con Next.js 16.
 * Sincronización de Identificadores Bridados y Limpieza de Rastro ESM.
 */
export const MODULE_PMF_OPEN_DATA_ENGINE_VERSION = '1.2.3';

/**
 * @section Capa 1: ADN Estructural (Schemas & Types)
 * Exportación de contratos inmutables para la validación y tipado.
 */

// 1.1. Protocolo de Red Gubernamental (E-Pública Raw)
export {
  EPublicaApiResponseSchema,
  EPublicaExpenseSchema,
  EPublicaMovementSchema,
} from './lib/schemas/protocol/EPublicaExpense.schema';

export type {
  IEPublicaApiResponse,
  IEPublicaExpenseRaw,
  IEPublicaMovementSnapshot,
} from './lib/schemas/protocol/EPublicaExpense.schema';

// 1.2. Contratos Soberanos (Sovereign Data Normalized)
/**
 * 🛡️ INTEGRIDAD SOBERANA: Sincronización de Identidades (Branded Types).
 * Los nombres reflejan la jerarquía de tipado nominal del ecosistema.
 */
export {
  PublicExpenditureIdentifierSchema,
  ProviderCnpjSchema,
  PublicExpenditureSchema,
  TerritorialTechnicalIdentifierSchema,
} from './lib/schemas/sovereign/PublicExpenditure.schema';

export type {
  TPublicExpenditureIdentifier,
  IPublicExpenditure,
  TProviderCnpj,
  TTerritorialTechnicalIdentifier,
} from './lib/schemas/sovereign/PublicExpenditure.schema';

/**
 * @section Capa 2: Almas Lingüísticas (i18n)
 */
export { PmfOpenDataI18nSchema } from './lib/i18n/PmfOpenDataI18n.schema';
export type { IPmfOpenDataI18n } from './lib/i18n/PmfOpenDataI18n.schema';

/**
 * @section Capa 3: Motores de Lógica y Orquestadores (Swarm Intelligence)
 */
export { IngestMunicipalityData } from './lib/logic/orchestrators/MunicipalityDataIngestor';
export { SyncMunicipalityExpenditure } from './lib/logic/orchestrators/SyncMunicipalityExpenditure';
export { SovereignPersistenceSentry } from './lib/logic/orchestrators/SovereignPersistenceSentry';
export { FetchRawEPublicaData } from './lib/logic/atomic/fetchers/FetchRawEPublicaData';

/**
 * @section Capa 4: Interfaces de Parametrización
 */
export type { IEPublicaFetchParameters } from './lib/logic/atomic/fetchers/FetchRawEPublicaData';
export type { ISyncExpenditureParameters } from './lib/logic/orchestrators/SyncMunicipalityExpenditure';