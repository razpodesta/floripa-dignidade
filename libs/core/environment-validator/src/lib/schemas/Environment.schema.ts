/**
 * @section Environment DNA - Infrastructure Sovereignty Schema
 * @description Define el contrato de integridad absoluto para las variables de entorno.
 * Implementa Branded Types para proteger secretos y asegurar el formato ISO.
 * Actúa como la Aduana de ADN para la ejecución Cloud-Sovereign (ADR 0015).
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & ReadOnly Integrity.
 * @author Engineering Department - Floripa Dignidade
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

/**
 * @name EnvironmentSchema
 * @description Aduana maestra que valida la salud del entorno antes del arranque.
 */
export const EnvironmentSchema = z.object({

  // --- COMUNICACIÓN TRANSACCIONAL (Resend) ---
  RESEND_API_KEY: ResendApiKeySchema
    .describe('Clave de API oficial para el despacho de correos electrónicos.'),

  RESEND_FROM_EMAIL: z.string()
    .email()
    .describe('Dirección de remitente autorizada por el DNS de la ONG.'),

  // --- SOBERANÍA CLOUD (Supabase) ---
  /** 🛡️ SANEADO: Inyección de llaves para sanar TS2339 en Newsletter */
  SUPABASE_URL: SupabaseUrlSchema,

  SUPABASE_SERVICE_ROLE_KEY: SupabaseServiceKeySchema,

  // --- GATEWAY DE MENSAJERÍA (WhatsApp / Meta) ---
  WHATSAPP_VERIFY_TOKEN: z.string()
    .min(10)
    .describe('Token secreto para el apretón de manos inicial con Meta.'),

  WHATSAPP_APP_SECRET: z.string()
    .min(10)
    .describe('Secreto de aplicación para la validación de firmas HMAC SHA256.'),

  // --- PERSISTENCIA DE DATOS (Neon / Postgres) ---
  DATABASE_URL: PostgresUrlSchema
    .describe('Cadena de conexión física a la base de datos de producción.'),

  // --- IDENTIDAD DE PLATAFORMA ---
  NEXT_PUBLIC_SITE_URL: z.string()
    .url()
    .describe('URL absoluta del portal para la generación de enlaces localized.'),

  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development')
    .describe('Identificador del modo de ejecución del compilador.'),

}).readonly();

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 * Interfaz inmutable que será consumida por todos los búnkeres de lógica.
 */
export type IEnvironmentVariables = z.infer<typeof EnvironmentSchema>;
