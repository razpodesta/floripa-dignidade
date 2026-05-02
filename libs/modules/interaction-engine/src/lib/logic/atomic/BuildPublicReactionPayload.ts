/**
 * @section Interaction Logic - Payload Builder Atom
 * @description Átomo de lógica pura encargado de ensamblar el ADN de una reacción
 * ciudadana antes de su procesamiento. Aísla la construcción de datos del entorno React.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Pure Logic.
 * @author Raz Podestá - MetaShark Tech
 */

import type { IUserIdentity } from '@floripa-dignidade/identity';

/**
 * Ensambla el diccionario de datos crudo para una interacción social.
 *
 * @param targetEntityIdentifier - UUID de la entidad destino.
 * @param polarityNumeric - 1 (Like), -1 (Unlike), 0 (Neutral).
 * @param activeCitizenIdentitySnapshot - Contexto de identidad ciudadana.
 * @param emoticonIntentionLiteral - Semántica visual (Opcional).
 * @returns {Record<string, unknown>} Payload listo para la Aduana Zod.
 */
export const BuildPublicReactionPayload = (
  targetEntityIdentifier: string,
  polarityNumeric: number,
  activeCitizenIdentitySnapshot?: IUserIdentity,
  emoticonIntentionLiteral?: string
): Record<string, unknown> => {
  return {
    interactionIdentifier: crypto.randomUUID(),
    targetEntityIdentifier,
    evaluatorIdentityIdentifier: activeCitizenIdentitySnapshot?.identityIdentifier ?? null,
    interactionPolarityNumeric: polarityNumeric,
    semanticEmoticonIntention: emoticonIntentionLiteral,
    evaluatorPublicAliasLiteral: activeCitizenIdentitySnapshot?.anonymizedPublicNameLiteral ?? 'Cidadão Anônimo',
    evaluatorAvatarSourceUrl: activeCitizenIdentitySnapshot?.avatarImageUniformResourceLocator ?? null,
    territorialContextLiteral: 'FLORIANÓPOLIS_GLOBAL',
    occurrenceTimestampISO: new Date().toISOString()
  };
};
