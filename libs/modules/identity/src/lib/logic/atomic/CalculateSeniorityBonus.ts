/**
 * @section Identity Logic - Seniority Bonus Atom
 * @description Átomo de lógica pura encarregado de calcular o bônus de antiguidade.
 * Isola a complexidade aritmética de datas da lógica de negócio.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Pure Logic.
 */

/**
 * @section Definições Estatísticas
 */
const SENIORITY_MAXIMUM_BONUS_NUMERIC = 0.2; // 20% de bônus máximo.
const FULL_TRUST_CYCLE_DAYS_QUANTITY = 365;   // 1 ano para atingir o teto.

/**
 * Calcula o bônus de autoridade baseado no tempo de permanência ética na rede.
 *
 * @param activationTimestampISO - Data de nascimento da identidade na rede.
 * @returns { daysSinceActivationQuantity: number, seniorityBonusNumeric: number }
 */
export const CalculateSeniorityBonus = (
  activationTimestampISO: string
): { daysSinceActivationQuantity: number; seniorityBonusNumeric: number } => {
  const activationDate = new Date(activationTimestampISO);
  const currentDate = new Date();

  // Cálculo de delta temporal em milissegundos
  const timeDifferenceMillisecondsQuantity = currentDate.getTime() - activationDate.getTime();

  // Conversão para dias inteiros (Norma ISO)
  const daysSinceActivationQuantity = Math.floor(
    timeDifferenceMillisecondsQuantity / (1000 * 3600 * 24)
  );

  /**
   * @section Algoritmo de Escalabilidade
   * O bônus cresce linearmente até o teto de 365 dias.
   */
  const seniorityMultiplierNumeric = Math.min(
    daysSinceActivationQuantity / FULL_TRUST_CYCLE_DAYS_QUANTITY,
    1
  );

  const seniorityBonusNumeric = seniorityMultiplierNumeric * SENIORITY_MAXIMUM_BONUS_NUMERIC;

  return {
    daysSinceActivationQuantity,
    seniorityBonusNumeric
  };
};
