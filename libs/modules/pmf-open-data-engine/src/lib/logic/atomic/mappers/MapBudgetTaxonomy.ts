/**
 * @section PMF Engine Logic - Budget Taxonomy Mapper
 * @description Átomo encargado de homogenizar la jerarquía funcional del gasto.
 */

interface IBudgetTaxonomy {
  readonly functionNameLiteral: string;
  readonly subFunctionNameLiteral: string;
  readonly programNameLiteral: string;
}

export const MapBudgetTaxonomy = (
  rawFunctionLiteral: string,
  rawSubFunctionLiteral: string,
  rawProgramLiteral: string,
): IBudgetTaxonomy => ({
  functionNameLiteral: rawFunctionLiteral.trim(),
  subFunctionNameLiteral: rawSubFunctionLiteral.trim(),
  programNameLiteral: rawProgramLiteral.trim(),
});
