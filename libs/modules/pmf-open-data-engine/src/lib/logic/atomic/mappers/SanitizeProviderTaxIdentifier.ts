/**
 * @section PMF Engine Logic - Provider Tax Identifier Sanitizer
 * @description Átomo de lógica pura encargado de normalizar identificadores
 * fiscales (CNPJ/CPF). Elimina caracteres no numéricos para garantizar
 * la integridad en el cruce de datos.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & ISO Standards.
 */

import type { ProviderCnpj } from '../../../schemas/sovereign/PublicExpenditure.schema';

/**
 * Purifica un identificador fiscal eliminando ruidos visuales (puntos, guiones, barras).
 *
 * @param rawTaxIdentifierLiteral - Cadena cruda proveniente del portal gubernamental.
 * @returns {ProviderCnpj} Identificador purificado de 14 dígitos (o 11 para CPF).
 */
export const SanitizeProviderTaxIdentifier = (
  rawTaxIdentifierLiteral: string
): ProviderCnpj => {
  /**
   * @section Normalización de ADN
   * La expresión regular \D captura cualquier carácter que no sea un dígito.
   */
  const purifiedIdentifierLiteral = rawTaxIdentifierLiteral.replace(/\D/g, '');

  return purifiedIdentifierLiteral as ProviderCnpj;
};
