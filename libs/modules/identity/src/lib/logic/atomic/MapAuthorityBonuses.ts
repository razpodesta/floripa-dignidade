/**
 * @section Identity Logic - Authority Bonuses Mapper
 * @description Átomo de lógica pura encarregado de calcular a soma de benefícios
 * institucionais baseados no perfil e soberania do cidadão. Isola a lógica de
 * negócios do orquestrador estatístico.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Pure Logic.
 * SANEADO Zenith: Resolução de erro TS2724 e normalização de ADN.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { AUTHORITY_WEIGHT_GROUND_TRUTH } from '../../constants/AuthorityWeightGroundTruth';

/** 🛡️ SANEADO Zenith: Importação de tipo nominal validado após correção do esquema */
import type { SocialIdentityProvider } from '../../schemas/UserIdentity.schema';

/**
 * @interface IMapAuthorityBonusesParameters
 * @description Contrato de entrada inalterável para a avaliação de mérito.
 */
interface IMapAuthorityBonusesParameters {
  /** Identificador do provedor de origem (Federado vs Interno). */
  readonly socialProviderIdentifier: SocialIdentityProvider;

  /** Estado da auditoria documental física. */
  readonly isIdentityLegallyVerifiedBoolean: boolean;
}

/**
 * Calcula o total de pontos extras acumulados por mérito institucional.
 * Implementa uma função pura e determinística.
 *
 * @param parameters - Snapshot de condições da identidade cidadã.
 * @returns {number} Coeficiente de bonificação resultante (Float).
 */
export const MapAuthorityBonuses = (
  parameters: IMapAuthorityBonusesParameters
): number => {
  let accumulatedBonusesNumeric = 0;

  /**
   * @section Avaliação 1: Federação Social
   * Identidades validadas por grandes provedores (Google/Apple) recebem
   * um bônus inicial por possuírem rastro digital externo.
   */
  const isFederatedIdentityBoolean =
    parameters.socialProviderIdentifier !== 'INTERNAL_INFRASTRUCTURE';

  if (isFederatedIdentityBoolean) {
    accumulatedBonusesNumeric += AUTHORITY_WEIGHT_GROUND_TRUTH.SOCIAL_FEDERATION_BONUS_NUMERIC;
  }

  /**
   * @section Avaliação 2: Soberania Legal (Validação Documental)
   * O maior peso de confiança é atribuído a cidadãos que passaram
   * pela auditoria de documentos físicos da ONG.
   */
  if (parameters.isIdentityLegallyVerifiedBoolean) {
    accumulatedBonusesNumeric += AUTHORITY_WEIGHT_GROUND_TRUTH.LEGAL_VERIFICATION_BONUS_NUMERIC;
  }

  return accumulatedBonusesNumeric;
};
