/**
 * @section CMS Infrastructure - GraphQL Engine Orchestrator
 * @description Túnel de entrada para consultas y mutaciones GraphQL.
 * Permite una recuperación de datos optimizada y tipada, reduciendo
 * el 'over-fetching' en el portal principal de Floripa Dignidade.
 *
 * Protocolo OEDP-V16.0 - Optimized Data Fetching & Query Integrity.
 * Vision: High-Efficiency Interlinking for NGOs.
 *
 * SANEADO Zenith: Remoción de GRAPHQL_GET (Obsoleto en la API estable 3.x).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { GRAPHQL_POST } from '@payloadcms/next/routes';

/* 1. Configuración Soberana (Única Fuente de Verdad) */
import config from '../../../../payload.config';

/**
 * @section Exportación de Handlers de Motor
 * SANEADO: Se conserva únicamente el método POST, que es el estándar de
 * comunicación para el motor de ejecución de esquemas de Payload 3.0.
 */
export const POST = GRAPHQL_POST(config);
