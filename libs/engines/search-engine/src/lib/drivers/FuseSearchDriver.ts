import Fuse, { IFuseOptions } from 'fuse.js';
import { ISearchableEntity } from '../schemas/SearchEngine.schema';

/**
 * @section Discovery Drivers - Fuse.js Implementation
 * Protocolo OEDP-V13.0 - Resiliencia Técnica e Inmutabilidad.
 * Cumplimiento ISO/IEC 11179 - Nomenclatura Profesional.
 */

/**
 * Configuración técnica inmutable para el algoritmo de búsqueda difusa.
 * Los pesos (weights) están alineados con la estrategia SEO y de conversión social.
 */
const GlobalFuseConfigurationOptions: IFuseOptions<ISearchableEntity> = {
  keys: [
    { name: 'title', weight: 1.0 },           // Máxima prioridad para el título.
    { name: 'keywords', weight: 0.8 },        // Clave para el sistema Contextual Interlinking.
    { name: 'contentSnippet', weight: 0.5 }   // Contexto descriptivo para refinamiento.
  ],
  threshold: 0.35,            // Equilibrio entre precisión y tolerancia a errores tipográficos.
  includeScore: true,         // Vital para la auditoría de relevancia del Neural Sentinel.
  ignoreLocation: true,       // Optimiza la búsqueda en cualquier posición del texto.
  minMatchCharLength: 2,      // Permite búsquedas cortas (ej: "S.O.S").
};

/**
 * Ejecuta la búsqueda técnica purificada utilizando el motor Fuse.js.
 *
 * @param searchQueryLiteral - El término de búsqueda ingresado por el ciudadano.
 * @param searchableEntityCollection - El universo de datos previamente filtrado por RBAC.
 * @returns Una colección de entidades validadas y ordenadas por relevancia técnica.
 */
export const executeTechnicalFuzzySearch = (
  searchQueryLiteral: string,
  searchableEntityCollection: ISearchableEntity[]
): ISearchableEntity[] => {
  // 1. Validación de guardia (Performance First)
  const isSearchQueryEmpty = !searchQueryLiteral.trim();
  if (isSearchQueryEmpty) {
    return [];
  }

  // 2. Instanciación del Motor Atómico
  // Nota: En futuras fases de optimización, este objeto podrá ser memoizado
  // si la colección de entidades permanece inmutable durante la sesión.
  const discoveryEngineInstance = new Fuse(
    searchableEntityCollection,
    GlobalFuseConfigurationOptions
  );

  // 3. Ejecución de la Inferencia de Búsqueda
  const technicalSearchResults = discoveryEngineInstance.search(searchQueryLiteral);

  /**
   * 4. Transformación y Limpieza (Data Integrity)
   * Extraemos únicamente el ítem que cumple con el ADN de ISearchableEntity,
   * descartando los metadatos internos del motor Fuse para no polucionar la UI.
   */
  return technicalSearchResults.map((discoveryResult) => discoveryResult.item);
};
