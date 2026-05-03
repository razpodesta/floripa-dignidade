/**
 * @section Messaging Logic - Presence Signature Atom
 * @description Átomo de lógica pura encargado de generar una huella digital 
 * determinística del estado de presencia. Permite al sistema detectar 
 * cambios reales y evitar tráfico de red redundante hacia el Ledger Cloud.
 * 
 * Protocolo OEDP-V17.0 - Functional Atomicity & Pure Logic.
 * SANEADO Zenith: Sincronización de Identidad ISO (DO_NOT_DISTURB).
 * 
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import type { TAvailabilityStatus } from '@floripa-dignidade/shared';

/**
 * @interface IPresenceIdentitySnapshot
 * @description Contrato inmutable para la generación de la firma de estado.
 * 🛡️ SANEADO Zenith: Se sincroniza el tipo 'status' con la fuente de verdad 
 * de 'shared' para erradicar el error TS2322.
 */
interface IPresenceIdentitySnapshot {
  readonly status: TAvailabilityStatus;
  readonly customMessage: string;
  readonly pushToken?: string;
}

/**
 * Transforma el snapshot de presencia en una firma de integridad textual inalterable.
 * Implementa una serialización determinística para auditoría de cambios.
 * 
 * @param snapshot - Datos actuales de disponibilidad y hardware.
 * @returns {string} Cadena JSON normalizada para validación de idempotencia.
 */
export const CalculatePresenceSovereignSignature = (
  snapshot: IPresenceIdentitySnapshot
): string => {
  /**
   * @section Algoritmo de Identidad (Fingerprinting)
   * Normalizamos el contenido eliminando espacios redundantes y utilizando 
   * llaves comprimidas para optimizar el rastro en memoria.
   * 
   * Nomenclatura de Firma:
   * s: Status (ONLINE | AWAY | DO_NOT_DISTURB | OFFLINE)
   * m: Message (Custom status literal)
   * t: Token (Push subscription secret)
   */
  return JSON.stringify({
    s: snapshot.status,
    m: snapshot.customMessage.trim(),
    t: snapshot.pushToken ?? 'NONE'
  });
};