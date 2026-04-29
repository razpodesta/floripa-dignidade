/**
 * @section PMF Engine Logic - Expenditure to Territory Interlinking
 * @description Átomo de lógica pura encargado del cruzamiento de datos institucionales.
 * Analiza el rastro textual de los contratos gubernamentales para identificar el
 * impacto geográfico, vinculando el gasto con los identificadores técnicos del IBGE.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Semantic Analysis.
 * Vision: Automated Geographic Impact Mapping.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/** 🛡️ SANEAMIENTO: Importación de utilidad de limpieza del motor territorial */
import { SanitizeTerritoryName } from '@floripa-dignidade/territorial-engine';

/** Identificador técnico del aparato para el Neural Sentinel. */
const INTERLINKING_ATOM_IDENTIFIER = 'TERRITORIAL_INTERLINKING_ENGINE';

/**
 * @interface ITerritorialMappingEntry
 * @description Diccionario local de mapeo semántico (Semántica -> ID IBGE).
 */
interface ITerritorialMappingEntry {
  readonly keywordLiteral: string;
  readonly ibgeIdentifier: string;
}

/**
 * Intenta deducir el territorio de impacto basándose en el análisis del texto.
 *
 * @param sourceTextLiteral - Descripción del gasto o nombre de la unidad gestora.
 * @param correlationIdentifier - Identificador de trazabilidad del hilo superior.
 * @returns {Promise<string>} Identificador técnico del IBGE (Código de Distrito).
 */
export const LinkExpenditureToTerritory = async (
  sourceTextLiteral: string,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<string> => {
  /**
   * @section Configuración de Mapeo (Knowledge Base)
   * TODO: En una fase futura, esta lista se recuperará dinámicamente
   * del 'territorial-engine' sincronizado con el IBGE.
   */
  const florianopolisDistrictsMapping: ITerritorialMappingEntry[] = [
    { keywordLiteral: 'TAPERA', ibgeIdentifier: '420540705' },
    { keywordLiteral: 'LAGOA', ibgeIdentifier: '420540710' },
    { keywordLiteral: 'CENTRO', ibgeIdentifier: '420540701' },
    { keywordLiteral: 'INGLESES', ibgeIdentifier: '420540715' },
    { keywordLiteral: 'CAMPECHE', ibgeIdentifier: '420540720' },
    { keywordLiteral: 'CANASVIEIRAS', ibgeIdentifier: '420540725' },
  ];

  /** ID por defecto: Florianópolis (Global/No especificado) */
  const MUNICIPALITY_FALLBACK_IDENTIFIER = '4205407';

  // 1. NORMALIZACIÓN DEL TEXTO FUENTE
  const sanitizedSearchText = SanitizeTerritoryName(sourceTextLiteral);

  /**
   * 2. ALGORITMO DE COINCIDENCIA (Keyword Extraction)
   * Buscamos si algún barrio conocido es mencionado en el contrato.
   */
  const detectedTerritory = florianopolisDistrictsMapping.find((district) =>
    sanitizedSearchText.includes(district.keywordLiteral)
  );

  const finalTerritoryIdentifier = detectedTerritory
    ? detectedTerritory.ibgeIdentifier
    : MUNICIPALITY_FALLBACK_IDENTIFIER;

  // 3. REPORTE DE INFERENCIA (SRE Visibility)
  if (detectedTerritory) {
    void EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: INTERLINKING_ATOM_IDENTIFIER,
      operationCode: 'TERRITORIAL_INTERLINK_SUCCESS',
      correlationIdentifier,
      message: `Inferencia geográfica exitosa: Gasto vinculado a [${detectedTerritory.keywordLiteral}]`,
      contextMetadata: {
        detectedId: detectedTerritory.ibgeIdentifier,
        matchLiteral: detectedTerritory.keywordLiteral
      }
    });
  }

  return finalTerritoryIdentifier;
};
