/**
 * @section Environment DNA - Infrastructure Sovereignty Schema
 * @description Define o contrato de integridade absoluto para as variáveis de ambiente.
 * Implementa Branded Types para blindar segredos e garantir o padrão ISO de segurança.
 * Atua como a única Aduana de ADN para a execução Cloud-Sovereign (ADR 0015).
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ReadOnly Integrity.
 * SANEADO Zenith: Erradicação de abreviações e injeção de ADN nominal completo.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';

/**
 * @section Branded Types (ADN Criptográfico)
 * @description Evitam a colisão semântica entre diferentes segredos de infraestrutura.
 */
export const ResendApiKeySchema = z.string()
  .startsWith('re_')
  .brand<'ResendApiKey'>();

export const SupabaseUniformResourceLocatorSchema = z.string()
  .url()
  .describe('URL física do projeto no Tier de Supabase.')
  .brand<'SupabaseUniformResourceLocator'>();

export const SupabaseServiceKeySchema = z.string()
  .min(50)
  .describe('Token de acesso administrativo (Service Role) para bypass de RLS.')
  .brand<'SupabaseServiceKey'>();

export const PostgresUniformResourceLocatorSchema = z.string()
  .url()
  .startsWith('postgresql://')
  .brand<'PostgresUniformResourceLocator'>();

export const WhatsAppSecretSchema = z.string()
  .min(16)
  .brand<'WhatsAppSecret'>();

export const WhatsAppVerifyTokenSchema = z.string()
  .min(10)
  .brand<'WhatsAppVerifyToken'>();

export const PayloadSecretSchema = z.string()
  .min(32, { message: 'PAYLOAD_SECRET_MUST_BE_AT_LEAST_32_CHARACTERS' })
  .brand<'PayloadSecret'>();

export const SovereignEmergencyTokenSchema = z.string()
  .min(32)
  .describe('Token de alta segurança para bypass de auditoria em casos de falha crítica.')
  .brand<'SovereignEmergencyToken'>();

/** ADN para Persistência Multimídia (S3 Gateway) */
export const S3EndpointUniformResourceLocatorSchema = z.string()
  .url()
  .brand<'S3EndpointUniformResourceLocator'>();

export const S3AccessKeyIdentifierSchema = z.string()
  .min(10)
  .brand<'S3AccessKeyIdentifier'>();

export const S3SecretAccessKeySchema = z.string()
  .min(10)
  .brand<'S3SecretAccessKey'>();

export const SiteUniformResourceLocatorSchema = z.string()
  .url()
  .brand<'SiteUniformResourceLocator'>();

export const NxCloudAccessTokenSchema = z.string()
  .brand<'NxCloudAccessToken'>();

/**
 * @name EnvironmentSchema
 * @description Aduana mestra que valida a saúde do ambiente antes do arranque do sistema.
 * Implementa o padrão de validação proativa (Fail-Fast) para evitar estados inconsistentes.
 */
export const EnvironmentSchema = z.object({

  // --- COMUNICAÇÃO TRANSACIONAL (Resend) ---
  RESEND_API_KEY: ResendApiKeySchema
    .describe('Chave de API oficial para o despacho de correios eletrônicos transacionais.'),

  RESEND_FROM_EMAIL: z.string()
    .email()
    .describe('Endereço de remetente autorizado pelo DNS da ONG.'),

  // --- SOBERANIA CLOUD (Supabase / Persistência) ---
  SUPABASE_URL: SupabaseUniformResourceLocatorSchema
    .describe('Ponto de enlace REST para a base de dados de cidadãos.'),

  SUPABASE_SERVICE_ROLE_KEY: SupabaseServiceKeySchema
    .describe('Chave mestra para operações de escrita assíncronas no Supabase.'),

  DATABASE_URL: PostgresUniformResourceLocatorSchema
    .describe('String de conexão física para o motor de persistência Postgres.'),

  // --- PERSISTÊNCIA MULTIMÍDIA (S3-Compatible / Supabase Storage) ---
  S3_ENDPOINT: S3EndpointUniformResourceLocatorSchema
    .describe('Ponto de enlace S3 fornecido pelo Supabase Storage.'),

  S3_ACCESS_KEY_ID: S3AccessKeyIdentifierSchema
    .describe('Identificador de acesso para o protocolo S3.'),

  S3_SECRET_ACCESS_KEY: S3SecretAccessKeySchema
    .describe('Chave secreta criptográfica para a persistência multimídia.'),

  S3_REGION: z.string()
    .default('us-east-1')
    .describe('Região física do bucket de armazenamento.'),

  S3_BUCKET: z.string()
    .min(3)
    .default('media-vault')
    .describe('Nome do contêiner de arquivos na nuvem.'),

  // --- GESTÃO DE CONTEÚDO (Payload CMS) ---
  PAYLOAD_SECRET: PayloadSecretSchema
    .describe('Segredo criptográfico inalterável para a segurança de sessões administrativas.'),

  /** 🛡️ SANEADO: Injeção oficial do token de bypass soberano no contrato global */
  SOVEREIGN_EMERGENCY_TOKEN: SovereignEmergencyTokenSchema,

  // --- GATEWAY DE MENSAGENS (WhatsApp / Meta) ---
  WHATSAPP_VERIFY_TOKEN: WhatsAppVerifyTokenSchema
    .describe('Token secreto para o handshake inicial com a Meta.'),

  WHATSAPP_APP_SECRET: WhatsAppSecretSchema
    .describe('Segredo de aplicação para validação de assinaturas HMAC SHA256.'),

  // --- IDENTIDADE E ORQUESTRAÇÃO DE PLATAFORMA ---
  NEXT_PUBLIC_SITE_URL: SiteUniformResourceLocatorSchema
    .describe('URL absoluta do portal para geração de links e metadados SEO.'),

  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development')
    .describe('Identificador do modo de execução do compilador.'),

  /** Auditoria de Nx Cloud para CI/CD */
  NX_CLOUD_ACCESS_TOKEN: NxCloudAccessTokenSchema
    .optional()
    .describe('Token para habilitar computação remota e cache distribuído.'),

}).readonly();

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 * Interface inalterável que garante acesso 100% Type-Safe à infraestrutura.
 */
export type IEnvironmentVariables = z.infer<typeof EnvironmentSchema>;
