/**
 * @section Identity Sovereignty - Security Infrastructure Configuration
 * @description Constantes de configuração inalteráveis para a governança de segurança,
 * resiliência criptográfica e conformidade com a norma ISO/IEC 27001.
 *
 * Protocolo OEDP-V17.0 - ISO Technical Naming & Zero Abbreviations.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @name IDENTITY_SECURITY_CONFIG
 * @description Definições mestre de segurança para o búnker de identidade.
 */
export const IDENTITY_SECURITY_CONFIG = {
  /**
   * Nível de entropia e complexidade mínima exigida para credenciais cidadãs.
   * Representa o peso algorítmico da senha na escala institucional.
   */
  minimumPasswordStrengthLevelQuantity: 4,

  /**
   * Tempo de vida da sessão ativa no cliente ou edge em minutos.
   * Após este período, o enjambre exige uma re-validação de identidade.
   */
  sessionTimeoutDurationMinutesQuantity: 60,

  /**
   * Atributo booleano que determina a obrigatoriedade de Segundo Fator
   * de Autenticação (2FA) para identidades com papéis administrativos.
   */
  isMultiFactorAuthenticationMandatoryBoolean: true,
} as const;
