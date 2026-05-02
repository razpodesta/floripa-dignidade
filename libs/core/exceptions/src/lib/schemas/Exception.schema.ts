/**
 * @section Exception DNA - Structural Integrity Schema
 * @description Define el contrato de Verdad Única (SSOT) para la taxonomía de errores.
 * Implementa Branded Types para evitar la polución de códigos y asegurar que
 * solo literales autorizados circulen por el sistema nervioso central.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ISO Standard Naming.
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';

/**
 * @section Tipado Nominal (Branded Types)
 * @description Protege los códigos de error de colisiones semánticas.
 */
export const ErrorCodeSchema = z.enum([
  'VALIDATION_FAILED',
  'UNAUTHORIZED_ACCESS',
  'INTERNAL_SYSTEM_FAILURE',
  'RESOURCE_NOT_FOUND',
  'EXTERNAL_SERVICE_TIMEOUT',
  'INFRASTRUCTURE_BOOTSTRAP_FAULT',
  'CRYPTOGRAPHIC_SIGNATURE_MISMATCH',
  'PAYLOAD_TOO_LARGE',
])
  .describe('Catálogo oficial de códigos operativos soberanos.')
  .brand<'ErrorCode'>();

/** Representación en tiempo de compilación del código de error sellado. */
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

/**
 * @name RuntimeSnapshotSchema
 * @description Aduana de ADN para la captura forense de metadatos en el momento del fallo.
 */
export const RuntimeSnapshotSchema = z.record(z.string(), z.unknown())
  .describe('Snapshot inmutable del contexto de ejecución donde ocurrió la anomalía.');

/** Interfaz inmutable para el rastro forense. */
export type IRuntimeSnapshot = z.infer<typeof RuntimeSnapshotSchema>;

/**
 * @name ExceptionContractSchema
 * @description Esquema de validación para la estructura interna de cualquier excepción.
 */
export const ExceptionContractSchema = z.object({
  operationalErrorCodeLiteral: ErrorCodeSchema,
  httpStatusCodeNumeric: z.number().int().min(400).max(599),
  occurrenceTimestampISO: z.string().datetime(),
  runtimeContextSnapshot: RuntimeSnapshotSchema,
}).readonly();

/** Interfaz de validación interna para el Neural Sentinel. */
export type IExceptionContract = z.infer<typeof ExceptionContractSchema>;