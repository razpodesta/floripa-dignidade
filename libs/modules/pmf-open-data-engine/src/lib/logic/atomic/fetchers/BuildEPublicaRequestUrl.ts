/**
 * @section PMF Engine Logic - Request URL Builder Atom
 * @description Átomo de lógica pura encargado de la construcción determinista
 * de la URL de consulta para la API de E-Pública.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Pure Logic.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @interface IBuildUrlParameters
 * @description Parámetros necesarios para la generación de la URI técnica.
 */
interface IBuildUrlParameters {
  readonly municipalitySlugLiteral: string;
  readonly initialPeriodMonthYearLiteral: string;
  readonly finalPeriodMonthYearLiteral: string;
  readonly managementUnitTechnicalIdentifier?: number;
  readonly startingRecordIndexQuantity?: number;
  readonly recordQuantityLimitQuantity?: number;
}

/**
 * Genera la URL absoluta con parámetros de consulta normalizados para E-Pública.
 *
 * @param parameters - Snapshot de criterios de búsqueda.
 * @returns {string} URL técnica lista para el despacho.
 */
export const BuildEPublicaRequestUrl = (
  parameters: IBuildUrlParameters
): string => {
  const baseApiUrlLiteral = `https://transparencia.e-publica.net/epublica-portal/rest/${parameters.municipalitySlugLiteral}/api/v1/despesa`;

  const queryParametersOrchestrator = new URLSearchParams({
    periodo_inicial: parameters.initialPeriodMonthYearLiteral,
    periodo_final: parameters.finalPeriodMonthYearLiteral,
    ...(parameters.managementUnitTechnicalIdentifier !== undefined && {
        codigo_unidade: parameters.managementUnitTechnicalIdentifier.toString()
    }),
    ...(parameters.startingRecordIndexQuantity !== undefined && {
        inicio_registro: parameters.startingRecordIndexQuantity.toString()
    }),
    ...(parameters.recordQuantityLimitQuantity !== undefined && {
        cantidad_registro: parameters.recordQuantityLimitQuantity.toString()
    }),
  });

  return `${baseApiUrlLiteral}?${queryParametersOrchestrator.toString()}`;
};
