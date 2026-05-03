/**
 * @section Messaging Logic - Presence Sovereign Signature Atom
 * @description Genera un rastro determinístico (Fingerprint) del estado de presencia.
 * Permite la detección de mutaciones y previene la saturación del Ledger por redundancia.
 * 
 * Protocolo OEDP-V17.0 - Functional Atomicity & High Performance.
 */

import type { TAvailabilityStatus } from '../../schemas/UserPresence.schema';

/**
 * Snapshot de identidad para el cálculo de soberanía.
 * 🛡️ SANEADO: Soporte explícito para tipos opcionales bajo rigor de TS.
 */
export interface IPresenceSovereignSnapshot {
  readonly status: TAvailabilityStatus;
  readonly customMessage: string | undefined;
  readonly pushToken: string | undefined;
}

/**
 * Transforma el snapshot de presencia en una firma textual inalterable y ultra-ligera.
 * ⚡ OPTIMIZACIÓN: Sustitución de JSON.stringify por concatenación determinística.
 * 
 * @param snapshot - Datos actuales del pulso de vida.
 * @returns {string} Firma de soberanía para validación de idempotencia.
 */
export const CalculatePresenceSovereignSignature = (
  snapshot: IPresenceSovereignSnapshot
): string => {
  /**
   * Generación de huella digital mediante concatenación de fronteras.
   * Usamos separadores '|' para evitar colisiones semánticas.
   */
  const statusLiteral = snapshot.status;
  const messageLiteral = snapshot.customMessage ?? 'NO_MSG';
  const tokenLiteral = snapshot.pushToken ?? 'NO_TOKEN';

  return `${statusLiteral}|${messageLiteral}|${tokenLiteral}`;
};