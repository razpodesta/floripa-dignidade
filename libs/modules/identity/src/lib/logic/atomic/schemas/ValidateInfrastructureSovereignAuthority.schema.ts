/**
 * @section Identity DNA - Sovereign Power Validation Contract
 * @description Define os requisitos para o desafio de autoridade máxima.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @name ValidateInfrastructureSovereignAuthoritySchema
 * @description Valida a entrada do token de segurança para ativação de poder.
 */
export const ValidateInfrastructureSovereignAuthoritySchema = z.object({
  /** Token fornecido pelo auditor ou sistema em caso de emergência. */
  administrativeSecurityTokenLiteral: z.string()
    .min(32, { message: 'SECURITY_TOKEN_TOO_SHORT' })
    .describe('Token de segurança para bypass de infraestrutura.'),
}).readonly();

/** 🛡️ ADN Tipado para exportação Verbatim */
export type IValidateInfrastructureSovereignAuthorityParameters = z.infer<
  typeof ValidateInfrastructureSovereignAuthoritySchema
>;
