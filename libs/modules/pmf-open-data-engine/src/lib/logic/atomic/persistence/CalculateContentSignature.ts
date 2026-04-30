/**
 * @section PMF Engine Logic - Content Signature Orchestrator
 * @description Átomo encargado de generar una huella digital (Fingerprint) SHA-256
 * inalterable basada en el contenido técnico del gasto. Permite detectar
 * mutaciones en los registros gubernamentales garantizando la soberanía del dato.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Cryptographic Integrity.
 * SANEADO Zenith: Normalización de rastro forense y tipado inmutable de entrada.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

import { NormalizeObjectToDeterministicJson } from './NormalizeObjectToDeterministicJson';

/** Identificador técnico del aparato para el Neural Sentinel. */
const CRYPTO_SIGNATURE_IDENTIFIER = 'CONTENT_INTEGRITY_HASHER';

/**
 * Genera una firma criptográfica SHA-256 del contenido técnico proporcionado.
 * Implementa ejecución nativa vía Web Crypto API para máxima eficiencia en el Edge.
 *
 * @param contentPayloadCollection - Diccionario inmutable con los datos sensibles del gasto.
 * @param correlationIdentifier - Identificador de trazabilidad forense (Default: Auto-generated).
 * @returns {Promise<string>} Firma hexadecimal de integridad inalterable.
 */
export const CalculateContentSignature = async (
  contentPayloadCollection: Readonly<Record<string, unknown>>,
  correlationIdentifier: string = GenerateCorrelationIdentifier(),
): Promise<string> => {
  /**
   * @section Fase 1: Normalización de ADN
   * Delegamos en el átomo de serialización para garantizar que el Hash
   * sea determinista independientemente del orden de las llaves del objeto.
   */
  const deterministicJsonLiteral = NormalizeObjectToDeterministicJson(contentPayloadCollection);

  /**
   * @section Fase 2: Procesamiento de Hardware
   * Transformamos el literal de texto en un rastro binario para el motor digest.
   */
  const textEncoderInstance = new TextEncoder();
  const binaryDataBuffer = textEncoderInstance.encode(deterministicJsonLiteral);

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', binaryDataBuffer);

    /**
     * @section Fase 3: Transformación a Firma Legible
     * Convertimos el buffer binario en una cadena hexadecimal técnica.
     */
    const hashArrayCollection = Array.from(new Uint8Array(hashBuffer));

    const finalSignatureHexLiteral = hashArrayCollection
      .map((byteValue) => byteValue.toString(16).padStart(2, '0'))
      .join('');

    /**
     * @section Telemetría Nominal
     * Emitimos señal de éxito para el rastro de auditoría de persistencia.
     */
    void EmitTelemetrySignal({
      severityLevel: 'DEBUG',
      moduleIdentifier: CRYPTO_SIGNATURE_IDENTIFIER,
      operationCode: 'CRYPTOGRAPHIC_SIGNATURE_GENERATED',
      correlationIdentifier,
      message: 'Firma de integridad de contenido generada exitosamente.',
    });

    return finalSignatureHexLiteral;

  } catch (_caughtError: unknown) {
    /**
     * @section Gestión de Colapso Criptográfico (Resilience)
     * SANEADO Zenith: El error se marca con '_' para cumplimiento de ESLint.
     * Se emite señal de prioridad CRITICAL para activar protocolos de sanación.
     */
    void EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: CRYPTO_SIGNATURE_IDENTIFIER,
      operationCode: 'CRYPTOGRAPHIC_ALGORITHM_FAULT',
      correlationIdentifier,
      message: 'Fallo catastrófico al intentar generar la firma de integridad.',
      contextMetadata: {
        errorTypeLiteral: _caughtError instanceof Error ? _caughtError.name : 'UnknownCryptoError',
      },
    });

    /**
     * Fallback de Seguridad: Retornamos un token de falla determinista
     * para forzar una auditoría manual en el motor de persistencia soberana.
     */
    return `SIGNATURE_FAULT_SIGNAL_${correlationIdentifier}`;
  }
};
