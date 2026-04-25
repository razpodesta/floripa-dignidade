/**
 * @section Identity Logic - Infrastructure Sovereign Authority Validator
 * @description Aparato de lógica atómica que valida la activación de privilegios
 * de auditoría máxima basados en secretos de entorno.
 *
 * Protocolo OEDP-V13.0 - Security First & Zero Abbreviations.
 * @author Raz  Podestá - MetaShark Tech
 */

/**
 * Evalúa si la solicitud de poder soberano es legítima comparando el token
 * recibido con la configuración de seguridad del servidor.
 *
 * @param administrativeSecurityTokenLiteral - Secreto proporcionado en el proceso de auditoría.
 * @returns {boolean} Verdadero si la simetría con la infraestructura es absoluta.
 */
export const ValidateInfrastructureSovereignAuthority = (
  administrativeSecurityTokenLiteral: string
): boolean => {
  /**
   * Captura del secreto inyectado en el entorno de ejecución (Vercel / Docker).
   * ISO Compliance: Uso de nombres descriptivos para variables de sistema.
   */
  const infrastructureSovereignSecretLiteral = process.env['SOVEREIGN_EMERGENCY_TOKEN'];

  if (!infrastructureSovereignSecretLiteral) {
    return false;
  }

  /**
   * Verificación de simetría criptográfica simple.
   * En futuras iteraciones, esto podría evolucionar a una firma JWE.
   */
  const isAuthoritySovereignMatchBoolean =
    administrativeSecurityTokenLiteral === infrastructureSovereignSecretLiteral;

  return isAuthoritySovereignMatchBoolean;
};
