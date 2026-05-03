/**
 * @section PMF Engine Logic - Expenditure Record Processor
 * @description Orquestador atómico que transforma un registro crudo de la PMF
 * en una entidad de Gasto Público soberana con integridad territorial.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Branded Type Integrity.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con Turbopack.
 */

import { GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';

/* 1. ADN del Dominio y Tipos Bridados */
/** 
 * 🛡️ RESOLUCIÓN ZENITH: Se eliminan extensiones .js para permitir 
 * que el Bundler gestione la resolución nativa de TypeScript.
 */
import type { IEPublicaExpenseRaw } from '../../../schemas/protocol/EPublicaExpense.schema';
import type { IPublicExpenditure } from '../../../schemas/sovereign/PublicExpenditure.schema';

/** 
 * 🛡️ IMPORTACIÓN DE SOBERANÍA: Tipos nominales para integridad de datos.
 */
import type { TPublicExpenditureIdentifier } from '../../../schemas/sovereign/PublicExpenditure.schema';
import type { TTerritorialTechnicalIdentifier } from '@floripa-dignidade/territorial-engine';

/* 2. Enjambre Atómico de Soporte */
import { MapEPublicaToSovereign } from './MapEPublicaToSovereign';
import { LinkExpenditureToTerritory } from '../cross-reference/LinkExpenditureToTerritory';
import { GenerateExpenditureHashIdentifier } from './GenerateExpenditureHashIdentifier';
import { CalculateExecutedFinancialBalance } from './CalculateExecutedFinancialBalance';

/**
 * Procesa un registro individual inyectando integridad forense y contexto geográfico.
 * 
 * @param rawRecord - Datos crudos capturados del proveedor E-Publica.
 * @param municipalitySlugLiteral - Slug para la generación del hash determinista.
 * @param correlationIdentifier - ID para el rastro del Neural Sentinel.
 * @returns {Promise<IPublicExpenditure>} Entidad homogenizada y firmada.
 */
export const ProcessExpenditureRecord = async (
  rawRecord: IEPublicaExpenseRaw,
  municipalitySlugLiteral: string,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<IPublicExpenditure> => {

  // 1. INFERENCIA GEOGRÁFICA (Linkage con el Territorial-Engine)
  const detectedTerritoryIdLiteral = await LinkExpenditureToTerritory(
    rawRecord.registro.empenho.objetoResumido,
    correlationIdentifier
  );

  // 2. CÁLCULO DE PRECISIÓN FINANCIERA (Aritmética Protegida)
  const executedBalanceNumeric = CalculateExecutedFinancialBalance(
    rawRecord.registro.listMovimentos,
    correlationIdentifier
  );

  // 3. GENERACIÓN DE FIRMA DE INTEGRIDAD (SHA-256)
  const fiscalYearNumeric = new Date(rawRecord.registro.empenho.emissao).getFullYear();
  const sovereignIdLiteral = await GenerateExpenditureHashIdentifier({
    municipalitySlugLiteral,
    fiscalYearNumeric,
    governmentReferenceLiteral: rawRecord.registro.empenho.numero.toString()
  }, correlationIdentifier);

  // 4. MAPEO INTEGRAL AL ADN SOBERANO
  const baseMappedEntity = await MapEPublicaToSovereign(rawRecord, correlationIdentifier);

  /**
   * 🛡️ ESTRATEGIA DE ÉLITE: Sovereign Casting.
   * Realizamos el cast a los tipos BRANDED para garantizar que el ID 
   * territorial y de gasto sean tratados como identidades únicas.
   */
  return {
    ...baseMappedEntity,
    expenditureIdentifier: sovereignIdLiteral as TPublicExpenditureIdentifier,
    totalExecutedAmountNumeric: executedBalanceNumeric,
    targetTerritoryIdentifier: detectedTerritoryIdLiteral as TTerritorialTechnicalIdentifier
  };
};