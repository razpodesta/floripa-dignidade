/**
 * @section Environment DNA - Infrastructure Sovereignty Schema
 * @description Define el contrato de integridad absoluto para las variables de entorno.
 * Implementa Branded Types para blindar secretos y asegurar el formato ISO.
 * Actúa como la Aduana de ADN para la ejecución Cloud-Sovereign (ADR 0015).
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & ReadOnly Integrity.
 * SANEADO Zenith: Inyección de persistencia S3-Compatible y auditoría de Nx Cloud.
 *
 * @author Engineering Department - Floripa Dignidade (Super AI Orchestrator)
 */

import { z } from 'zod';

/**
 * @section Branded Types (ADN Criptográfico)
 * @description Evitan la colisión semántica entre diferentes secretos de infraestructura.
 */
export const ResendApiKeySchema = z.string()
  .startsWith('re_')
  .brand<'ResendApiKey'>();

export const SupabaseUrlSchema = z.string()
  .url()
  .describe('URL física del proyecto en el Tier de Supabase.')
  .brand<'SupabaseUrl'>();

export const SupabaseServiceKeySchema = z.string()
  .min(50)
  .describe('Token de acceso administrativo (Service Role) para bypass de RLS.')
  .brand<'SupabaseServiceKey'>();

export const PostgresUrlSchema = z.string()
  .url()
  .startsWith('postgresql://')
  .brand<'PostgresUrl'>();

export const WhatsAppSecretSchema = z.string()
  .min(16)
  .brand<'WhatsAppSecret'>();

export const PayloadSecretSchema = z.string()
  .min(32, { message: 'PAYLOAD_SECRET_MUST_BE_AT_LEAST_32_CHARACTERS' })
  .brand<'PayloadSecret'>();

/** 🛡️ NUEVO: ADN para Persistencia Multimedia (S3 Gateway) */
export const S3EndpointSchema = z.string().url().brand<'S3Endpoint'>();
export const S3AccessKeyIdSchema = z.string().min(10).brand<'S3AccessKeyId'>();
export const S3SecretAccessKeySchema = z.string().min(10).brand<'S3SecretAccessKey'>();

/**
 * @name EnvironmentSchema
 * @description Aduana maestra que valida la salud del entorno antes del arranque.
 * Implementa un patrón de validación proactiva (Fail-Fast) para evitar "Zombie States".
 */
export const EnvironmentSchema = z.object({

  // --- COMUNICACIÓN TRANSACCIONAL (Resend) ---
  RESEND_API_KEY: ResendApiKeySchema
    .describe('Clave de API oficial para el despacho de correos electrónicos transaccionales.'),

  RESEND_FROM_EMAIL: z.string()
    .email()
    .describe('Dirección de remitente autorizada por el DNS de la ONG.'),

  // --- SOBERANÍA CLOUD (Supabase / Persistence) ---
  SUPABASE_URL: SupabaseUrlSchema
    .describe('Punto de enlace REST para la base de datos de ciudadanos.'),

  SUPABASE_SERVICE_ROLE_KEY: SupabaseServiceKeySchema
    .describe('Llave maestra para operaciones de escritura asíncronas en Supabase.'),

  DATABASE_URL: PostgresUrlSchema
    .describe('Cadena de conexión física para el motor de persistencia Postgres.'),

  // --- PERSISTENCIA MULTIMEDIA (S3-Compatible / Supabase Storage) ---
  /** 🛡️ SANEADO Zenith: Soporte para almacenamiento stateless a costo cero */
  S3_ENDPOINT: S3EndpointSchema
    .describe('Punto de enlace S3 proporcionado por Supabase Storage.'),

  S3_ACCESS_KEY_ID: S3AccessKeyIdSchema
    .describe('Identificador de acceso para el protocolo S3.'),

  S3_SECRET_ACCESS_KEY: S3SecretAccessKeySchema
    .describe('Clave secreta criptográfica para la persistencia multimedia.'),

  S3_REGION: z.string()
    .default('us-east-1')
    .describe('Región física del bucket de almacenamiento.'),

  S3_BUCKET: z.string()
    .min(3)
    .default('media-vault')
    .describe('Nombre del contenedor de archivos en la nube.'),

  // --- GESTIÓN DE CONTENIDOS (Payload CMS) ---
  PAYLOAD_SECRET: PayloadSecretSchema
    .describe('Secreto criptográfico inalterable para la seguridad de sesiones administrativas.'),

  // --- GATEWAY DE MENSAJERÍA (WhatsApp / Meta) ---
  WHATSAPP_VERIFY_TOKEN: z.string()
    .min(10)
    .describe('Token secreto para el apretón de manos inicial (Handshake) con Meta.'),

  WHATSAPP_APP_SECRET: WhatsAppSecretSchema
    .describe('Secreto de aplicación para la validación de firmas HMAC SHA256.'),

  // --- IDENTIDAD Y ORQUESTACIÓN DE PLATAFORMA ---
  NEXT_PUBLIC_SITE_URL: z.string()
    .url()
    .describe('URL absoluta del portal para generación de enlaces y metadatos SEO.'),

  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development')
    .describe('Identificador del modo de ejecución del compilador.'),

  /** 🛡️ SANEADO: Auditoría de Nx Cloud para CI/CD */
  NX_CLOUD_ACCESS_TOKEN: z.string()
    .optional()
    .describe('Token para habilitar cómputo remoto y caché distribuida.'),

}).readonly();

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 * Interfaz inmutable que garantiza un acceso 100% Type-Safe a la infraestructura.
 */
export type IEnvironmentVariables = z.infer<typeof EnvironmentSchema>;
