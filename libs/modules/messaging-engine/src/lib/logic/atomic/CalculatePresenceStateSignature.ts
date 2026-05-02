/**
 * @section Messaging Logic - Presence Signature Atom
 * @description Gera uma assinatura determinística do estado de presença para
 * detecção de mudanças e prevenção de re-sincronizações redundantes.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity.
 */

interface IPresenceStateSnapshot {
  readonly status: string;
  readonly message: string;
  readonly token?: string;
}

/**
 * Transforma o snapshot de presença em um rastro textual inalterável.
 */
export const CalculatePresenceStateSignature = (
  snapshot: IPresenceStateSnapshot
): string => {
  return JSON.stringify({
    s: snapshot.status,
    m: snapshot.message,
    t: snapshot.token ?? 'NONE'
  });
};
