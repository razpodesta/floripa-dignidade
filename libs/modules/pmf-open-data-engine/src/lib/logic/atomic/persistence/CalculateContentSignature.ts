/**
 * @section PMF Engine Logic - Content Signature Atom
 * @description Átomo de lógica pura encargado de generar una huella digital (Fingerprint)
 * basada exclusivamente en los datos financieros y técnicos del gasto. Permite detectar
 * mutaciones en el registro gubernamental sin depender de identificadores externos.
 *
 * Protocolo OEDP-V17.0 - Cryptographic Integrity & Change Detection.
 * Vision: Immutable Content Verification.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';

/**
 * Genera un Hash SHA-256 del contenido técnico del gasto.
 *
 * @param contentPayload - Objeto con los datos sensibles (monto, descripción, proveedor).
 * @param correlationIdentifier - ID de trazabilidad.
 * @returns {Promise<string>} Firma de contenido hexadecimal.
 */
export const CalculateContentSignature = async (
  contentPayload: Record<string, unknown>,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<string> => {

  /**
   * @section Normalización de ADN
   * Ordenamos las llaves del objeto para que el hash sea determinista
   * independientemente del orden en que lleguen los datos de la API.
   */
  const sortedContentString = JSON.stringify(contentPayload, Object.keys(contentPayload).sort());

  const encoderInstance = new TextEncoder();
  const dataBuffer = encoderInstance.encode(sortedContentString);

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArrayCollection = Array.from(new Uint8Array(hashBuffer));

    return hashArrayCollection
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

  } catch (caughtError: unknown) {
    /**
     * Fallback preventivo: Si falla la firma, devolvemos un token de error
     * para forzar revisión manual en el Persistence Sentry.
     */
    return `SIGNATURE_FAULT_${correlationIdentifier}`;
  }
};
