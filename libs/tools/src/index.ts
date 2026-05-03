/**
 * @section Tools & Automation - Package Entry Point (Barrel)
 * @description Centraliza las herramientas de soporte al desarrollo,
 * compilación de activos y auditoría automática del monorepo.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & ESM Strict.
 * SANEADO Zenith: Inyección de extensiones '.js' para compatibilidad Node16.
 *
 * @author Raz Podestá - MetaShark Tech
 */

export const TOOLS_BUNKER_VERSION = '1.2.0';

/**
 * 🛡️ FIX TS2835: Resolución explícita con extensión .js
 * Permite la transpilación y typechecking seguros en entornos CLI Node.js.
 */
export { BuildInternationalizationDictionaries } from './lib/i18n-builder/InternationalizationDictionaryBuilder.js';