/**
 * @section PMF Engine Logic - Provider Tax Identifier Sanitizer
 * @description Átomo de lógica pura encargado de normalizar identificadores
 * fiscales (CNPJ/CPF). Elimina caracteres no numéricos para garantizar
 * la integridad en el cruce de datos y la analítica forense.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & ISO Standards.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con Turbopack
 * y alineación con la estrategia de Rutas Limpias (Clean Paths).
 *
 * @author Raz Podestá - MetaShark Tech
 */

/* 1. ADN Estructural y Tipos Nominales (RUTAS LIMPIAS) */
/** 
 * 🛡️ RESOLUCIÓN ZENITH: Se purga el rastro .js. El Bundler orquestado 
 * por Next.js 16 resolverá los archivos .ts de forma nativa.
 */
import type { TProviderCnpj } from '../../../schemas/sovereign/PublicExpenditure.schema';

/**
 * Purifica un identificador fiscal eliminando ruidos visuales (puntos, guiones, barras).
 * ⚡ PERFORMANCE: Algoritmo de reemplazo por regex de paso único.
 * 
 * @param rawTaxIdentifierLiteral - Cadena cruda proveniente del portal gubernamental.
 * @returns {TProviderCnpj} Identificador purificado y sellado (Branded Type).
 */
export const SanitizeProviderTaxIdentifier = (
  rawTaxIdentifierLiteral: string
): TProviderCnpj => {
  /**
   * @section Normalización de ADN
   * La expresión regular \D captura cualquier carácter que no sea un dígito,
   * garantizando que solo la esencia numérica del ID fiscal persista.
   */
  const purifiedIdentifierLiteral = rawTaxIdentifierLiteral.replace(/\D/g, '');

  /** 
   * 🛡️ SOVEREIGN CASTING: 
   * Elevamos el literal purificado al tipo nominal TProviderCnpj.
   * Esto asegura que el dato no pueda ser confundido con strings genéricos en el Data Lake.
   */
  return purifiedIdentifierLiteral as TProviderCnpj;
};