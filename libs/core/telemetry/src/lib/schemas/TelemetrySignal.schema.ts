/**
 * @section Telemetry DNA - Sovereign Signal Schema (Next-Gen)
 * @description Define el contrato de integridad absoluto para las señales del
 * sistema nervioso central. Implementa soporte para encadenamiento criptográfico
 * (Merkle Chain), rastro de cifrado y etiquetado semántico para IA.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & Cryptographic Integrity.
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';

/**
 * @section ADN Criptográfico (Branded Types)
 */
export const CorrelationIdentifierSchema = z.string().uuid().brand<'CorrelationIdentifier'>();
export type CorrelationIdentifier = z.infer<typeof CorrelationIdentifierSchema>;

export const ModuleIdentifierSchema = z.string().min(3).brand<'ModuleIdentifier'>();
export type ModuleIdentifier = z.infer<typeof ModuleIdentifierSchema>;

export const OperationCodeSchema = z.string().min(3).brand<'OperationCode'>();
export type OperationCode = z.infer<typeof OperationCodeSchema>;

/** 🛡️ SANEADO Zenith: Firma criptográfica para la inalterabilidad Merkle */
export const ContentFingerprintSchema = z.string().length(64).brand<'ContentFingerprint'>();
export type ContentFingerprint = z.infer<typeof ContentFingerprintSchema>;

/**
 * @section Taxonomía de Severidad
 */
export const SeverityLevelSchema = z.enum([
  'DEBUG',
  'INFO',
  'WARNING',
  'ERROR',
  'CRITICAL'
]).describe('Niveles de prioridad para el triaje en el Neural Sentinel.');

export type SeverityLevel = z.infer<typeof SeverityLevelSchema>;

/**
 * @name TelemetrySignalSchema
 * @description Contrato maestro de un pulso telemétrico de alta fidelidad.
 */
export const TelemetrySignalSchema = z.object({
  /** Marca temporal inmutable del evento (ISO 8601). */
  occurrenceTimestampISO: z.string().datetime()
    .describe('Marca de tiempo exacta de la interacción física.'),

  /** Prioridad técnica del evento. */
  severityLevelLiteral: SeverityLevelSchema,

  /** Identificador nominal del búnker emisor. */
  moduleIdentifierLiteral: ModuleIdentifierSchema,

  /** Código semántico de la acción. */
  operationCodeLiteral: OperationCodeSchema,

  /** Rastro forense cross-module que vincula toda la transacción. */
  correlationIdentifier: CorrelationIdentifierSchema,

  /** Mensaje descriptivo o clave de diccionario i18n. */
  messageContentLiteral: z.string()
    .describe('Representación textual del evento capturado.'),

  /**
   * @section Capa Merkle (Inalterabilidad)
   * Firma del evento anterior en la cadena para asegurar la no-manipulación.
   */
  previousEventHashFingerprint: ContentFingerprintSchema.optional()
    .describe('Huella digital del log anterior (Cadena de Custodia).'),

  /** Firma SHA-256 del contenido actual del log. */
  contentHashFingerprint: ContentFingerprintSchema.optional()
    .describe('Firma de integridad del paquete actual.'),

  /**
   * @section Capa de Privacidad y IA
   */
  isEncryptedPayloadBoolean: z.boolean().default(false)
    .describe('Indica si el contenido del snapshot ha sido cifrado para seguridad PII.'),

  semanticIntentTag: z.string().optional()
    .describe('Etiqueta ontológica para entrenamiento y diagnóstico de IA (ej: "ADR_0015").'),

  /** Métrica de rendimiento en tiempo real. */
  executionLatencyInMillisecondsQuantity: z.number()
    .nonnegative()
    .optional()
    .describe('Tiempo de ejecución medido por el hardware.'),

  /** Captura de estado adicional (Contextual Snapshot). */
  contextMetadataSnapshot: z.record(z.string(), z.unknown())
    .optional()
    .describe('Diccionario inmutable de metadatos de entorno.'),

}).readonly();

/** 🛡️ ADN Tipado para el Enjambre de Telemetría Zenith */
export type ITelemetrySignal = z.infer<typeof TelemetrySignalSchema>;
