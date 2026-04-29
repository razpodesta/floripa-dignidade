/**
 * @section PMF Engine Logic - Expenditure Record Processor
 * @description Átomo encargado de coordinar la transformación de un único registro
 * crudo de la Prefeitura. Integra el cálculo financiero, el hashing determinista
 * y la vinculación territorial en una única operación atómica.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & ISO Technical Naming.
 * @author Raz Podestá - MetaShark Tech
 */

import { GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';

/* 1. ADN del Dominio */
import type { IEPublicaExpenseRaw } from '../../../schemas/protocol/EPublicaExpense.schema';
import type { IPublicExpenditure } from '../../../schemas/sovereign/PublicExpenditure.schema';

/* 2. Enjambre Atómico de Soporte */
import { MapEPublicaToSovereign } from './MapEPublicaToSovereign';
import { LinkExpenditureToTerritory } from '../cross-reference/LinkExpenditureToTerritory';
import { GenerateExpenditureHashIdentifier } from './GenerateExpenditureHashIdentifier';
import { CalculateExecutedFinancialBalance } from './CalculateExecutedFinancialBalance';

/**
 * Procesa un registro individual inyectando integridad forense y contexto geográfico.
 *
 * @param rawRecord - El registro crudo capturado de la API.
 * @param municipalitySlugLiteral - Identificador de la ciudad para el Hash.
 * @param correlationIdentifier - ID de trazabilidad.
 */
export const ProcessExpenditureRecord = async (
  rawRecord: IEPublicaExpenseRaw,
  municipalitySlugLiteral: string,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<IPublicExpenditure> => {

  // 1. Inferencia Geográfica (Cruzamiento con Territorial-Engine)
  const detectedTerritoryId = await LinkExpenditureToTerritory(
    rawRecord.registro.empenho.objetoResumido,
    correlationIdentifier
  );

  // 2. Cálculo de Precisión Financiera
  const executedBalanceNumeric = CalculateExecutedFinancialBalance(
    rawRecord.registro.listMovimentos,
    correlationIdentifier
  );

  // 3. Generación de Firma de Integridad (SHA-256)
  const fiscalYearNumeric = new Date(rawRecord.registro.empenho.emissao).getFullYear();
  const sovereignId = await GenerateExpenditureHashIdentifier({
    municipalitySlugLiteral,
    fiscalYearNumeric,
    governmentReferenceLiteral: rawRecord.registro.empenho.numero.toString()
  }, correlationIdentifier);

  // 4. Mapeo final al ADN Soberano
  const baseMappedEntity = await MapEPublicaToSovereign(rawRecord, correlationIdentifier);

  return {
    ...baseMappedEntity,
    expenditureIdentifier: sovereignId,
    totalExecutedAmountNumeric: executedBalanceNumeric,
    targetTerritoryIdentifier: detectedTerritoryId
  };
};
