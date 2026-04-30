/**
 * @section Identity DNA - Global Verified Identity Schema
 * @description Define o contrato mestre para a identidade cidadã e institucional.
 * Orquestra a convergência entre autenticação social, transparência e privacidade.
 * Atua como a Única Fonte de Verdade (SSOT) para o enjambre de dados.
 *
 * Protocolo OEDP-V17.0 - High Performance & ISO Technical Naming.
 * SANEADO Zenith: Injeção de tipos inferidos e normalização de nomenclatura.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';
import { UserAccessRoleSchema } from './UserAccessRole.schema';

/**
 * @section ADN Criptográfico - Tipagem Nominal
 * @description Garante que um identificador de usuário não seja confundido com
 * outros UUIDs do sistema (News, Organizations, etc).
 */
export const UserIdentifierSchema = z.string()
  .uuid()
  .brand<'UserIdentifier'>();

/** 🛡️ ADN Tipado para exportação Verbatim */
export type UserIdentifier = z.infer<typeof UserIdentifierSchema>;

/**
 * @section Provedores de Identidade Federada
 * Catálogo de entidades externas autorizadas para autenticação no ecossistema.
 */
export const SocialIdentityProviderSchema = z.enum([
  'GOOGLE_IDENTITY',
  'APPLE_ID',
  'INSTAGRAM_GRAPH',
  'FACEBOOK_CONNECT',
  'X_CORP_API',
  'INTERNAL_INFRASTRUCTURE'
]).describe('Identificador técnico do provedor de autenticação federada.');

/**
 * 🛡️ SANEADO Zenith: Exportação de tipo nominal.
 * Resolve o erro TS2724 permitindo que átomos lógicos tipem seus parâmetros.
 */
export type SocialIdentityProvider = z.infer<typeof SocialIdentityProviderSchema>;

/**
 * @name UserIdentitySchema
 * @description Contrato soberano de identidade. Define o perfil completo do cidadão.
 */
export const UserIdentitySchema = z.object({

  /** Identificador único e inalterável no enjambre de dados. */
  identityIdentifier: UserIdentifierSchema,

  /** Nome completo capturado do registro civil ou provedor social. */
  fullLegalNameLiteral: z.string()
    .min(3)
    .transform((value) => value.trim())
    .describe('Nome legal completo para processos de transparência e auditoria.'),

  /**
   * Nome Público Anonimizado (Regra ISO: NOME + INICIAL).
   * Exemplo: "ANALUIZA S."
   */
  anonymizedPublicNameLiteral: z.string()
    .describe('Representação visual segura para proteger a privacidade do cidadão em áreas públicas.'),

  /** Endereço de contato principal validado. */
  electronicMailAddressLiteral: z.string()
    .email()
    .transform((value) => value.toLowerCase().trim())
    .describe('Endereço de correio eletrônico vinculado à conta soberana.'),

  /**
   * URL física do avatar institucional.
   * SANEADO: 'Url' transmutado para 'UniformResourceLocator' seguindo a norma ISO de zero abreviaturas.
   */
  avatarImageUniformResourceLocator: z.string()
    .url()
    .nullable()
    .describe('Endereço físico do recurso visual de identidade.'),

  /** Identificador do provedor de autenticação utilizado. */
  socialProviderIdentifier: SocialIdentityProviderSchema
    .default('INTERNAL_INFRASTRUCTURE'),

  /**
   * NÍVEL DE AUTORIDADE PONDERADA (Bayesian Confidence Level).
   * Coeficiente calculado que determina o peso do cidadão nos algoritmos de impacto.
   */
  identityTrustWeightScoreNumeric: z.number()
    .min(0)
    .max(1)
    .default(0.1)
    .describe('Coeficiente algorítmico de credibilidade bayesiana baseada em comportamento ético.'),

  /**
   * Papel de autoridade institucional (RBAC).
   * Sincronizado com a hierarquia global de acesso.
   */
  assignedAuthorityRoleLiteral: UserAccessRoleSchema
    .default('CITIZEN_ANONYMOUS'),

  /** Estado de verificação documental (SRE Audit). */
  isIdentityLegallyVerifiedBoolean: z.boolean()
    .default(false)
    .describe('Indica se o perfil passou pela auditoria documental humana e governamental.'),

  /** Registro inalterável de ativação da identidade. */
  occurrenceTimestampISO: z.string()
    .datetime()
    .describe('Marca temporal da criação da conta na infraestrutura soberana.'),

}).readonly();

/** 🛡️ ADN Tipado para exportação Verbatim */
export type IUserIdentity = z.infer<typeof UserIdentitySchema>;
