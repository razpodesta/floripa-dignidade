/**
 * @section Interaction Engine - Package Entry Point
 * @description Orquestador del búnker de sentimientos e interacciones sociales.
 * Protocolo OEDP-V16.0 - Single Source Resolution.
 */

export * from './lib/schemas/PublicReaction.schema';
export * from './lib/i18n/InteractionEngineI18n.schema';
export { ProcessPublicReactionTransaction } from './lib/logic/ProcessPublicReactionTransaction';
