/**
 * @section Discovery Logic - Universal Discovery Orchestrator
 * @description Orquestador soberano de búsqueda con soporte de Roles (RBAC).
 * Integra trazabilidad forense y medición de rendimiento cognitivo.
 *
 * Protocolo OEDP-V13.0 - Atomic Functional Architecture.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import {
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';
import { UserAccessRole } from '@floripa-dignidade/identity';
import {
  ISearchableEntity,
  SearchResponseSchema
} from '../schemas/SearchEngine.schema';
import { executeTechnicalFuzzySearch } from '../drivers/FuseSearchDriver';

/** Identificador del aparato para el Neural Sentinel. */
const SEARCH_ENGINE_IDENTIFIER = 'UNIVERSAL_SEARCH_ENGINE';

/**
 * Orquestador principal de búsqueda difusa.
 *
 * @param searchQueryLiteral - Cadena de texto a buscar ingresada por el ciudadano.
 * @param completeIndexCollection - El índice total de contenidos (estáticos + dinámicos).
 * @param authenticatedUserRole - El nivel de autoridad de quien busca (para filtrado RBAC).
 * @returns Promesa con la colección de resultados purificados y autorizados.
 */
export const ExecuteFuzzySearch = async (
  searchQueryLiteral: string,
  completeIndexCollection: ISearchableEntity[],
  authenticatedUserRole: UserAccessRole = 'ANONYMOUS_USER'
): Promise<ISearchableEntity[]> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // Guard de Rendimiento: Si la búsqueda está vacía, evitamos activar el motor.
  if (!searchQueryLiteral.trim()) {
    return [];
  }

  return await TraceExecutionTime(
    SEARCH_ENGINE_IDENTIFIER,
    'EXECUTE_SEARCH_OPERATION',
    correlationIdentifier,
    async () => {
      /**
       * 1. APLICACIÓN DE RBAC (Security First)
       * Filtramos el universo de datos antes de que lleguen al driver técnico.
       * Un ciudadano nunca debe "buscar" lo que no tiene permiso de "ver".
       */
      const authorizedEntityCollection = completeIndexCollection.filter((entity) => {
        // Acceso Total: Administradores del sistema.
        if (authenticatedUserRole === 'SYSTEM_ADMINISTRATOR') return true;

        // Acceso Público: Entidades marcadas para usuarios anónimos.
        if (entity.requiredAccessRole === 'ANONYMOUS_USER') return true;

        /**
         * Acceso Específico: Verificación de coincidencia de autoridad.
         * Nota: En futuras fases se podría implementar una jerarquía (ej: LEGAL_AUDITOR > CONTENT_MANAGER).
         */
        return entity.requiredAccessRole === authenticatedUserRole;
      });

      /**
       * 2. EJECUCIÓN TÉCNICA (Fuzzy Search Driver)
       * Invocación al algoritmo purificado de Fuse.js.
       */
      const rawDiscoveryResults = executeTechnicalFuzzySearch(
        searchQueryLiteral,
        authorizedEntityCollection
      );

      /**
       * 3. ADUANA DE ADN (Data Integrity)
       * Validación de salida mediante Zod para garantizar que no se fuguen datos
       * sensibles o estructuras corruptas hacia la UI.
       */
      const validatedDiscoveryResults = SearchResponseSchema.parse(rawDiscoveryResults);

      return [...validatedDiscoveryResults];
    }
  );
};
