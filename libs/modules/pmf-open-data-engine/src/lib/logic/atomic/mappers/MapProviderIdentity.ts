/**
 * @section PMF Engine Logic - Provider Identity Mapper
 * @description Átomo de lógica pura que transforma los datos crudos del beneficiario
 * en una estructura de identidad fiscal purificada y tipada.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & ISO Standards.
 */

import type { ProviderCnpj } from '../../../schemas/sovereign/PublicExpenditure.schema';
import { SanitizeProviderTaxIdentifier } from './SanitizeProviderTaxIdentifier';

interface IProviderMetadata {
  readonly legalNameLiteral: string;
  readonly taxIdentificationNumber: ProviderCnpj;
}

/**
 * Mapea y purifica la identidad del proveedor gubernamental.
 */
export const MapProviderIdentity = (
  rawNameLiteral: string,
  rawCpfCnpjLiteral: string,
): IProviderMetadata => {
  return {
    legalNameLiteral: rawNameLiteral.toUpperCase().trim(),
    /** 🛡️ SANEADO Zenith: Delegación al átomo de saneamiento fiscal */
    taxIdentificationNumber: SanitizeProviderTaxIdentifier(rawCpfCnpjLiteral),
  };
};
