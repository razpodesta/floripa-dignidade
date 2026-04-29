/**
 * @section Identity DNA - Global Verified Identity Schema
 * @description Define o contrato mestre para a identidade cidadã e institucional.
 * Orquestra a convergência entre autenticação social, transparência e privacidade.
 *
 * Protocolo OEDP-V17.0 - High Performance & ISO Technical Naming.
 * SANEADO Zenith: Sincronização com o novo esquema dinâmico de papéis.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';
import { UserAccessRoleSchema } from './UserAccessRole.schema';

/**
 * @section ADN Criptográfico - Tipagem Nominal
 */
export const UserIdentifierSchema = z.string()
  .uuid()
  .brand<'UserIdentifier'>();

/** 🛡️ ADN Tipado para exportação Verbatim */
export type UserIdentifier = z.infer<typeof UserIdentifierSchema>;

/**
 * Catálogo de provedores de identidade externa autorizados pela ONG.
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
 * @name UserIdentitySchema
 * @description Contrato soberano de identidade. SSOT para perfis e auditoria civil.
 */
export const UserIdentitySchema = z.object({

  /** Identificador único e inalterável no enjambre de dados. */
  identityIdentifier: UserIdentifierSchema,

  /** Nome completo capturado do registro civil ou provedor social. */
  fullLegalNameLiteral: z.string()
    .min(3)
    .transform((value) => value.trim())
    .describe('Nome legal completo para processos de transparência.'),

  /**
   * Nome Público Anonimizado (Regra ISO: NOME + INICIAL).
   * Exemplo: "ANALUIZA S."
   */
  anonymizedPublicNameLiteral: z.string()
    .describe('Representação visual segura para proteger a privacidade do cidadão.'),

  /** Endereço de contato principal validado. */
  electronicMailAddressLiteral: z.string()
    .email()
    .transform((value) => value.toLowerCase().trim())
    .describe('Endereço de e-mail vinculado à conta soberana.'),

  /** URL física do avatar recuperada do provedor social. */
  avatarSourceUrl: z.string()
    .url()
    .nullable()
    .describe('Link para o recurso visual de identidade para transparência pública.'),

  /** Identificador do provedor OAuth2 utilizado. */
  socialProviderIdentifier: SocialIdentityProviderSchema
    .default('INTERNAL_INFRASTRUCTURE'),

  /**
   * NÍVEL DE AUTORIDADE PONDERADA (Bayesian Confidence Level).
   * Determina o peso do cidadão nos algoritmos de impacto social.
   */
  identityTrustWeightScoreNumeric: z.number()
    .min(0)
    .max(1)
    .default(0.1)
    .describe('Coeficiente algorítmico de credibilidade bayesiana.'),

  /**
   * Papel de autoridade institucional (RBAC).
   * Sincronizado com USER_ACCESS_ROLES_COLLECTION.
   */
  assignedAuthorityRoleLiteral: UserAccessRoleSchema
    .default('CITIZEN_ANONYMOUS'),

  /** Estado de verificação documental (SRE Audit). */
  isIdentityLegallyVerifiedBoolean: z.boolean()
    .default(false)
    .describe('Indica se o perfil passou pela auditoria documental humana.'),

  /** Registro inalterável de nascimento da identidade na rede. */
  occurrenceTimestampISO: z.string()
    .datetime()
    .describe('Marca temporal da criação da conta no ecossistema.'),

}).readonly();

/** 🛡️ ADN Tipado para exportação Verbatim */
export type IUserIdentity = z.infer<typeof UserIdentitySchema>;
