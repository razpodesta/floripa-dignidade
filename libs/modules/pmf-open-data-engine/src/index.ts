/**
 * @section PMF Open Data Engine - Package Entry Point (Barrel)
 * @description Único punto de exportación autorizado para el búnker de inteligencia
 * de datos abiertos. Orquesta la visibilidad de los contratos de ADN, la lógica de
 * orquestación y las almas lingüísticas para el ecosistema Floripa Dignidade.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & ISO Technical Naming.
 * Vision: Government Data as a Scalable Microservice.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @version 1.2.0
 * Estatus: Nivelación Zenith completada. Soporte para Ingesta Híbrida y
 * Persistencia con Detección de Mutación SHA-256.
 */
export const MODULE_PMF_OPEN_DATA_ENGINE_VERSION = '1.2.0';

/**
 * @section ADN Estructural (Schemas & Interfaces)
 */

// 1. Contratos de Protocolo (Crudos)
export {
  EPublicaExpenseSchema,
  EPublicaApiResponseSchema
} from './lib/schemas/protocol/EPublicaExpense.schema';

export type {
  IEPublicaExpenseRaw,
  IEPublicaApiResponse
} from './lib/schemas/protocol/EPublicaExpense.schema';

// 2. Contratos Soberanos (Homogenizados)
export {
  PublicExpenditureSchema,
  ExpenditureIdentifierSchema,
  ProviderCnpjSchema
} from './lib/schemas/sovereign/PublicExpenditure.schema';

export type {
  IPublicExpenditure,
  ExpenditureIdentifier,
  ProviderCnpj
} from './lib/schemas/sovereign/PublicExpenditure.schema';

/**
 * @section Almas Lingüísticas (i18n)
 */
export { PmfOpenDataI18nSchema } from './lib/i18n/PmfOpenDataI18n.schema';
export type { IPmfOpenDataI18n } from './lib/i18n/PmfOpenDataI18n.schema';

/**
 * @section Motores de Inteligencia (Orchestrators & Logic)
 */

// Orquestador Híbrido (Procesa API o Archivos Manuales)
export { IngestMunicipalityData } from './lib/logic/orchestrators/MunicipalityDataIngestor';

// Sincronizador Automático (Legacy Wrapper)
export { SyncMunicipalityExpenditure } from './lib/logic/orchestrators/SyncMunicipalityExpenditure';

// Centinela de Persistencia (Acceso directo para reparaciones de base de datos)
export { SovereignPersistenceSentry } from './lib/logic/orchestrators/SovereignPersistenceSentry';

// Fetcher Atómico (I/O de Red)
export { FetchRawEPublicaData } from './lib/logic/atomic/fetchers/FetchRawEPublicaData';

// Interfaces de Parametrización
export type { ISyncExpenditureParameters } from './lib/logic/orchestrators/SyncMunicipalityExpenditure';
export type { IEPublicaFetchParameters } from './lib/logic/atomic/fetchers/FetchRawEPublicaData';
