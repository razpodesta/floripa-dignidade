/**
 * @section PMF Engine Logic - Provider Identity Mapper
 * @description Átomo de lógica pura encargado de transformar los datos crudos
 * del beneficiario en una estructura de identidad fiscal purificada y tipada.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & ISO Standards.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con Turbopack
 * y alineación con la estrategia de Rutas Limpias (Clean Paths).
 *
 * @author Raz Podestá - MetaShark Tech
 */

/* 1. ADN Estructural y Tipos Nominales (RUTAS LIMPIAS) */
/** 
 * 🛡️ RESOLUCIÓN ZENITH: Se purga el rastro .js para que el Bundler 
 * gestione la resolución nativa de TypeScript.
 */
import type { TProviderCnpj } from '../../../schemas/sovereign/PublicExpenditure.schema';
import { SanitizeProviderTaxIdentifier } from './SanitizeProviderTaxIdentifier';

/**
 * @interface IProviderMetadata
 * @description Contrato inmutable para la identidad legal del proveedor.
 */
interface IProviderMetadata {
  /** Razón social normalizada (Upper Case). */
  readonly legalNameLiteral: string;
  /** Identificador fiscal purificado y sellado (Branded Type). */
  readonly taxIdentificationNumber: TProviderCnpj;
}

/**
 * Mapea y purifica la identidad del proveedor gubernamental.
 * ⚡ PERFORMANCE: Función pura de alta velocidad para procesamiento masivo.
 * 
 * @param rawNameLiteral - Nombre crudo del proveedor.
 * @param rawCpfCnpjLiteral - Identificador fiscal con posibles ruidos visuales.
 * @returns {IProviderMetadata} Snapshot de identidad purificado.
 */
export const MapProviderIdentity = (
  rawNameLiteral: string,
  rawCpfCnpjLiteral: string,
): IProviderMetadata => {
  return {
    /** 
     * @section Saneamiento de Identidad
     * Normalizamos a mayúsculas y eliminamos espacios redundantes.
     */
    legalNameLiteral: rawNameLiteral.toUpperCase().trim(),

    /** 🛡️ SANEADO Zenith: Delegación al átomo de saneamiento fiscal sin rastro .js */
    taxIdentificationNumber: SanitizeProviderTaxIdentifier(rawCpfCnpjLiteral),
  };
};