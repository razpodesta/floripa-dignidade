/**
 * @section Discovery Drivers - Fuse.js Implementation
 * @description Ejecuta el algoritmo de búsqueda difusa utilizando el motor Fuse.js.
 *
 * Protocolo OEDP-V14.0 - Verbatim Module Syntax.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';

/** 🛡️ SANEAMIENTO Zenith: Importación de ADN estructural como tipo */
import type { ISearchableEntity } from '../schemas/SearchEngine.schema';

const GlobalFuseConfigurationOptions: IFuseOptions<ISearchableEntity> = {
  keys: [
    { name: 'title', weight: 1.0 },
    { name: 'keywords', weight: 0.8 },
    { name: 'contentSnippet', weight: 0.5 }
  ],
  threshold: 0.35,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/**
 * Ejecuta la búsqueda técnica purificada.
 *
 * @param searchQueryLiteral - Término de búsqueda.
 * @param searchableEntityCollection - Universo de datos autorizado.
 * @returns Colección de entidades ordenadas por relevancia.
 */
export const executeTechnicalFuzzySearch = (
  searchQueryLiteral: string,
  searchableEntityCollection: ISearchableEntity[]
): ISearchableEntity[] => {
  if (!searchQueryLiteral.trim()) {
    return [];
  }

  const discoveryEngineInstance = new Fuse(
    searchableEntityCollection,
    GlobalFuseConfigurationOptions
  );

  const technicalSearchResults = discoveryEngineInstance.search(searchQueryLiteral);

  return technicalSearchResults.map((discoveryResult) => discoveryResult.item);
};
