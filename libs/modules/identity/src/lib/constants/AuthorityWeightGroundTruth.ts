/**
 * @section Identity DNA - Authority Weight Ground Truth
 * @description Define os pesos e coeficientes inalteráveis para o cálculo da
 * credibilidade bayesiana. Centraliza a inteligência de negócio do búnker.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ISO Standards.
 */

export const AUTHORITY_WEIGHT_GROUND_TRUTH = {
  /** Peso base para identidades não identificadas. */
  BASE_ANONYMOUS_TRUST_WEIGHT_NUMERIC: 0.1,

  /** Bônus por utilizar provedores federados confiáveis (Google, Apple, etc). */
  SOCIAL_FEDERATION_BONUS_NUMERIC: 0.2,

  /** Bônus máximo por validação documental humana (Selo de Verificação). */
  LEGAL_VERIFICATION_BONUS_NUMERIC: 0.5,

  /** Teto máximo de autoridade permitido pelo algoritmo (1.0 = 100%). */
  MAXIMUM_AUTHORITY_THRESHOLD_NUMERIC: 1.0,
} as const;
