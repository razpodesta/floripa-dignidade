/**
 * 🔍 Search Engine - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Universal Discovery Bunker
 *
 * Este búnker orquesta la recuperación de información mediante búsqueda difusa,
 * garantizando la seguridad por roles (RBAC) y la trazabilidad forense.
 */

// Exportación de ADN (Esquemas e Interfaces)
export * from './lib/schemas/SearchEngine.schema';

// Exportación de ADN Lingüístico (i18n)
export * from './lib/i18n/SearchEngineI18n.schema';

// Exportación de Lógica Atómica (Cerebro)
export { ExecuteFuzzySearch } from './lib/logic/ExecuteFuzzySearch';
