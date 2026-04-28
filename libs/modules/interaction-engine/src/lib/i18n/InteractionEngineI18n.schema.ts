import { z } from 'zod';

/**
 * @section Interaction DNA - Linguistic Schema
 * @description Define el contrato para las traducciones de interacciones sociales.
 */
export const InteractionEngineI18nSchema = z.object({
  logs: z.object({
    REACTION_RECEIVED: z.string().describe('Señal de interacción capturada.'),
    ANONYMOUS_REACTION_PONDERED: z.string().describe('Aviso de peso reducido por anonimato.'),
  }),
  errors: z.object({
    REACTION_ADN_CORRUPT: z.string().describe('Fallo en el esquema de la reacción.'),
    DUPLICATE_REACTION_BLOCKED: z.string().describe('Prevención de SPAM de likes.'),
  })
}).readonly();

export type IInteractionEngineI18n = z.infer<typeof InteractionEngineI18nSchema>;
