/**
 * @section Discovery Logic - Universal Discovery Orchestrator
 * @description Orquestador de búsqueda institucional con soporte para control de acceso.
 *
 * Protocolo OEDP-V14.0 - Verbatim Module Syntax.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import {
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/** 🛡️ SANEAMIENTO Zenith: Separación de ADN (tipos) y Lógica (esquemas) */
import type {
  ISearchableEntity,
  SearchAuthorityRole,
} from '../schemas/SearchEngine.schema';

import {
  SearchResponseSchema
} from '../schemas/SearchEngine.schema';

import { executeTechnicalFuzzySearch } from '../drivers/FuseSearchDriver';

const SEARCH_ENGINE_IDENTIFIER = 'UNIVERSAL_SEARCH_ENGINE';

/**
 * Ejecuta la búsqueda difusa respetando la jerarquía de autoridad.
 *
 * @param searchQueryLiteral - Cadena ingresada por el ciudadano.
 * @param completeIndexCollection - Índice total de contenidos.
 * @param authenticatedUserAuthorityRole - Rango de autoridad (Default: CITIZEN_ANONYMOUS).
 */
export const ExecuteFuzzySearch = async (
  searchQueryLiteral: string,
  completeIndexCollection: ISearchableEntity[],
  authenticatedUserAuthorityRole: SearchAuthorityRole = 'CITIZEN_ANONYMOUS'
): Promise<ISearchableEntity[]> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  if (!searchQueryLiteral.trim()) {
    return [];
  }

  return await TraceExecutionTime(
    SEARCH_ENGINE_IDENTIFIER,
    'EXECUTE_SEARCH_OPERATION',
    correlationIdentifier,
    async () => {
      const authorizedEntityCollection = completeIndexCollection.filter((entity) => {
        const hasAdministrativeBypassBoolean =
          authenticatedUserAuthorityRole === 'INFRASTRUCTURE_SOVEREIGN_AUDITOR' ||
          authenticatedUserAuthorityRole === 'PLATFORM_GLOBAL_MANAGER';

        if (hasAdministrativeBypassBoolean) return true;

        if (entity.requiredAuthorityRole === 'CITIZEN_ANONYMOUS') return true;

        return entity.requiredAuthorityRole === authenticatedUserAuthorityRole;
      });

      const rawDiscoveryResults = executeTechnicalFuzzySearch(
        searchQueryLiteral,
        authorizedEntityCollection
      );

      const validatedDiscoveryResults = SearchResponseSchema.parse(rawDiscoveryResults);

      return [...validatedDiscoveryResults];
    }
  );
};
