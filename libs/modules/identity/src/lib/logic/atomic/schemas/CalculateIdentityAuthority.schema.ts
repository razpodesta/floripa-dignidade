/**
 * @section Identity DNA - Authority Calculation Contract
 * @description Define o contrato de integridade para o motor de credibilidade bayesiana.
 * SANEADO Zenith: Resolução de erro TS2339 (ZodReadonly pick failure) através da
 * definição explícita via esquemas atômicos.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';
import {
  SocialIdentityProviderSchema,
  UserIdentifierSchema
} from '../../../schemas/UserIdentity.schema';

/**
 * @name CalculateIdentityAuthoritySchema
 * @description Aduana de ADN para os parâmetros de entrada do cálculo.
 * Utiliza validadores atômicos para garantir a simetria com a identidade global.
 */
export const CalculateIdentityAuthoritySchema = z.object({
  /** Identificador único do cidadão com tipagem nominal. */
  identityIdentifier: UserIdentifierSchema,

  /** Provedor de origem da identidade (OAuth2 ou Interno). */
  socialProviderIdentifier: SocialIdentityProviderSchema,

  /** Estado da auditoria documental humana. */
  isIdentityLegallyVerifiedBoolean: z.boolean()
    .describe('Indica se o cidadão possui selo de verificação legal.'),

  /** Marca temporal ISO de criação da conta para cálculo de antiguidade. */
  occurrenceTimestampISO: z.string().datetime()
    .describe('Timestamp inalterável de ativação da identidade.'),

}).readonly();

/**
 * @name IdentityAuthorityResultSchema
 * @description Contrato de saída para o coeficiente de autoridade gerado.
 */
export const IdentityAuthorityResultSchema = z.object({
  /**
   * Score final ponderado (0.1 para anônimos, até 1.0 para verificados antigos).
   */
  authorityCoefficientNumeric: z.number().min(0).max(1)
    .describe('Coeficiente final de peso bayesiano.'),

  /** Delta temporal calculado pelo átomo matemático. */
  daysSinceActivationQuantity: z.number().int().nonnegative()
    .describe('Quantidade total de dias de existência da identidade na rede.'),

  /** Snapshot do estado de verificação no momento do processamento. */
  isVerifiedHumanBoolean: z.boolean()
    .describe('Reflexo do estado de validação documental no momento do cálculo.')
}).readonly();

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 * Exportação de interfaces inmutáveis para o orquestrador de autoridade.
 */
export type ICalculateIdentityAuthorityParameters = z.infer<typeof CalculateIdentityAuthoritySchema>;
export type IIdentityAuthorityResult = z.infer<typeof IdentityAuthorityResultSchema>;
