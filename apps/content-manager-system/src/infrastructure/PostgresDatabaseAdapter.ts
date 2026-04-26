/**
 * @section CMS Infrastructure - Postgres Database Adapter
 * @description Configura el adaptador de persistencia oficial para Payload 3.0.
 * Implementa optimización de pooling para entornos Cloud-Sovereign (Neon/Supabase).
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Infrastructure Isolation.
 */

import { postgresAdapter } from '@payloadcms/db-postgres';

/**
 * Genera la instancia del adaptador de Postgres purificada.
 *
 * @param databaseUrlLiteral - Cadena de conexión física validada por la aduana.
 * @returns Adaptador configurado para el motor de Payload.
 */
export const CreatePostgresDatabaseAdapter = (databaseUrlLiteral: string) => {
  return postgresAdapter({
    pool: {
      /**
       * SANEADO Zenith: Inyección dentro del pool para cumplimiento de
       * tipos de pg.PoolConfig y resolución de TS2353.
       */
      connectionString: databaseUrlLiteral,
      max: 10, // Límite técnico para Tier gratuito.
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  });
};
