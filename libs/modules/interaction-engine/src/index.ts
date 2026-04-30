/**
 * @section Interaction Engine - Package Entry Point (Barrel)
 * @description Orquestador del búnker de sentimientos e interacciones sociales.
 * Centraliza los esquemas, procesadores y conectores para la captura del termómetro popular.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & Verbatim Module Syntax.
 * SANEADO Zenith: Inyección del conector de reactividad pública (Hook).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

/**
 * @version 1.1.0
 * Estatus: Nivelación Zenith y soporte para interactividad soberana.
 */
export const MODULE_INTERACTION_ENGINE_VERSION = '1.1.0';

/**
 * @section ADN Estructural (Schemas & Types)
 * Exportación de contratos inmutables para validación de interacciones.
 */
export * from './lib/schemas/PublicReaction.schema';

/**
 * @section Almas Lingüísticas (i18n)
 * Silos de traducción técnica y ciudadana.
 */
export * from './lib/i18n/InteractionEngineI18n.schema';

/**
 * @section Motores de Lógica y Mutación (Processors)
 * Orquestadores que gestionan el rastro forense y la ponderación de la interacción.
 */
export { ProcessPublicReactionTransaction } from './lib/logic/ProcessPublicReactionTransaction';

/**
 * @section Conectores de Interfaz (Hooks)
 * Puentes isomórficos entre la UI React y la lógica de negocio del búnker.
 */
export { usePublicReaction } from './lib/logic/hooks/usePublicReaction';
