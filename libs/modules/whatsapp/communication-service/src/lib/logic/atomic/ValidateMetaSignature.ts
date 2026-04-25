/**
 * @section WhatsApp Logic - Meta Criptographic Validator
 * @description Valida la autenticidad de los paquetes entrantes mediante el
 * algoritmo SHA256 HMAC provisto por Meta.
 *
 * Protocolo OEDP-V15.0 - Security First & Functional Atomicity.
 * @author Raz Podestá - MetaShark Tech
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/** Identificador técnico del aparato para el Neural Sentinel. */
const SECURITY_ATOM_IDENTIFIER = 'WHATSAPP_SECURITY_ADUANA';

/**
 * Compara la firma recibida con la firma calculada localmente.
 *
 * @param rawRequestBodyLiteral - El cuerpo de la petición sin procesar (Buffer/String).
 * @param xHubSignatureHeaderLiteral - La cabecera 'X-Hub-Signature-256' de Meta.
 * @returns {boolean} Verdadero si la identidad de Meta es legítima.
 */
export const ValidateMetaSignature = (
  rawRequestBodyLiteral: string,
  xHubSignatureHeaderLiteral: string
): boolean => {
  const correlationIdentifier = GenerateCorrelationIdentifier();
  const metaAppSecretLiteral = process.env['WHATSAPP_APP_SECRET'] || '';

  try {
    // 1. LIMPIEZA DE PREFIJO
    // Meta envía la firma como 'sha256=hash_result'
    const signaturePrefixLiteral = 'sha256=';
    const receivedHashLiteral = xHubSignatureHeaderLiteral.replace(signaturePrefixLiteral, '');

    // 2. CÁLCULO DE FIRMA LOCAL (HMAC SHA256)
    const calculatedHashLiteral = createHmac('sha256', metaAppSecretLiteral)
      .update(rawRequestBodyLiteral)
      .digest('hex');

    // 3. COMPARACIÓN SEGURA (Constant-time comparison)
    // timingSafeEqual previene ataques de análisis de tiempo de ejecución.
    const isIdentityMatchBoolean = timingSafeEqual(
      Buffer.from(receivedHashLiteral, 'hex'),
      Buffer.from(calculatedHashLiteral, 'hex')
    );

    if (!isIdentityMatchBoolean) {
      EmitTelemetrySignal({
        severityLevel: 'CRITICAL',
        moduleIdentifier: SECURITY_ATOM_IDENTIFIER,
        operationCode: 'META_SIGNATURE_MISMATCH',
        correlationIdentifier,
        message: 'Fallo de integridad criptográfica: Intento de suplantación de Webhook detectado.'
      });
    }

    return isIdentityMatchBoolean;

  } catch (caughtError) {
    EmitTelemetrySignal({
      severityLevel: 'ERROR',
      moduleIdentifier: SECURITY_ATOM_IDENTIFIER,
      operationCode: 'SIGNATURE_CALCULATION_FAULT',
      correlationIdentifier,
      message: 'No se pudo verificar la firma debido a un error técnico interno.',
      contextMetadata: { errorTrace: String(caughtError) }
    });
    return false;
  }
};
