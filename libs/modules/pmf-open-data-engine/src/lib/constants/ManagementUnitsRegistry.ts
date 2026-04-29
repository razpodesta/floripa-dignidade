/**
 * @section PMF Engine - Management Units Registry
 * @description Única Fuente de Verdad (SSOT) para las entidades administrativas
 * de la Prefeitura de Florianópolis. Vincula los códigos técnicos de E-Pública
 * con la nomenclatura institucional de la ONG.
 *
 * Protocolo OEDP-V17.0 - ISO Standard Naming & Data Sovereignty.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @interface IManagementUnitEntry
 * @description Estructura de identidad para una unidad gestora presupuestaria.
 */
export interface IManagementUnitEntry {
  readonly technicalCodeNumeric: number;
  readonly officialNameLiteral: string;
  readonly categoryIdentifier: 'FUND' | 'FOUNDATION' | 'INSTITUTE' | 'DIRECT_ADMINISTRATION';
}

/**
 * Catálogo maestro de unidades auditables de la PMF.
 * Basado en la documentación oficial de la API v1.0.
 */
export const MANAGEMENT_UNITS_COLLECTION: readonly IManagementUnitEntry[] = [
  { technicalCodeNumeric: 1, officialNameLiteral: 'Prefeitura Municipal de Florianópolis', categoryIdentifier: 'DIRECT_ADMINISTRATION' },
  { technicalCodeNumeric: 2, officialNameLiteral: 'Fundo Municipal de Cinema - FUNCINE', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 4, officialNameLiteral: 'Fundação Cultural de Florianópolis Franklin Cascaes', categoryIdentifier: 'FOUNDATION' },
  { technicalCodeNumeric: 5, officialNameLiteral: 'Fundação Municipal de Esportes', categoryIdentifier: 'FOUNDATION' },
  { technicalCodeNumeric: 6, officialNameLiteral: 'Fundação Municipal do Meio Ambiente', categoryIdentifier: 'FOUNDATION' },
  { technicalCodeNumeric: 7, officialNameLiteral: 'Instituto de Planejamento Urbano - IPUF', categoryIdentifier: 'INSTITUTE' },
  { technicalCodeNumeric: 8, officialNameLiteral: 'Fundo Municipal de Habitação de Interesse Social', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 9, officialNameLiteral: 'Fundo Municipal de Saúde', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 10, officialNameLiteral: 'Fundo Municipal de Assistência Social', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 11, officialNameLiteral: 'Fundo Municipal da Criança e do Adolescente', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 12, officialNameLiteral: 'Autarquia de Melhoramentos da Capital - COMCAP', categoryIdentifier: 'DIRECT_ADMINISTRATION' },
  { technicalCodeNumeric: 13, officialNameLiteral: 'Instituto de Geração de Oportunidades - IGEOF', categoryIdentifier: 'INSTITUTE' },
  { technicalCodeNumeric: 14, officialNameLiteral: 'FUMDESF - Fundo Municipal Promoção Empreendimento', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 16, officialNameLiteral: 'Fundo Municipal de Saneamento', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 17, officialNameLiteral: 'Câmara Municipal de Florianópolis', categoryIdentifier: 'DIRECT_ADMINISTRATION' },
  { technicalCodeNumeric: 19, officialNameLiteral: 'Fundo Municipal de Emergência da Defesa Civil', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 20, officialNameLiteral: 'Fundo Municipal de Turismo', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 21, officialNameLiteral: 'Fundo Municipal do Idoso', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 22, officialNameLiteral: 'Instituto de Previdência Social dos Servidores Públicos', categoryIdentifier: 'INSTITUTE' },
  { technicalCodeNumeric: 23, officialNameLiteral: 'Fundo Municipal de Inovação', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 24, officialNameLiteral: 'Fundo Municipal de Trânsito', categoryIdentifier: 'FUND' },
  { technicalCodeNumeric: 25, officialNameLiteral: 'Fundação Rede Solidária Somar Floripa', categoryIdentifier: 'FOUNDATION' },
  { technicalCodeNumeric: 55, officialNameLiteral: 'IPREF – Instituto de Previdência de Florianópolis', categoryIdentifier: 'INSTITUTE' },
] as const;

/**
 * Recupera una unidad gestora por su código técnico.
 */
export const GetManagementUnitByCode = (code: number): IManagementUnitEntry | undefined => {
  return MANAGEMENT_UNITS_COLLECTION.find(unit => unit.technicalCodeNumeric === code);
};
