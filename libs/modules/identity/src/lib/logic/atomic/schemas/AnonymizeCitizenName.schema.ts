/**
 * @section Identity DNA - Name Anonymization Contract
 * @description Define a estrutura de validação para o processo de anonimização.
 * Garante que a entrada seja uma string íntegra e não vazia.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @name AnonymizeCitizenNameSchema
 * @description Valida os parâmetros de entrada para o átomo de anonimização.
 */
export const AnonymizeCitizenNameSchema = z.object({
  /** Nome legal completo capturado do registro ou provedor. */
  fullLegalNameLiteral: z.string()
    .min(1, { message: 'IDENTITY.ERRORS.IDENTITY_NOT_FOUND' })
    .transform((value) => value.trim())
    .describe('Nome civil para processamento de privacidade.'),

  /**
   * Fallback linguístico para casos onde o nome é inválido.
   * Injetado pelo orquestador superior (i18n aware).
   */
  anonymousPlaceholderLiteral: z.string()
    .default('CIDADÃO ANÔNIMO')
    .describe('Texto de substituição para identidades não identificáveis.')
}).readonly();

/** 🛡️ ADN Tipado para exportação Verbatim */
export type IAnonymizeCitizenNameParameters = z.infer<typeof AnonymizeCitizenNameSchema>;
