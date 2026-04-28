/**
 * @section Routing - Swarm Sensor Registry
 * @description Punto de configuración para el orden de ejecución de los
 * sensores de frontera. Permite la expansión plug-and-play del middleware.
 */

import type { IMiddlewareHandler } from '../handlers/MiddlewareHandler.schema';
import { ApplyLinguisticRedirection } from '../handlers/ApplyLinguisticRedirection';
import { FilterAutomatedInterference } from '../handlers/FilterAutomatedInterference';

/**
 * Colección ordenada de sensores cognitivos.
 * SRE: El filtro de bots se ejecuta antes que la redirección para ahorrar cómputo.
 */
export const SWARM_SENSORS_PIPELINE: readonly IMiddlewareHandler[] = [
  FilterAutomatedInterference,
  ApplyLinguisticRedirection,
] as const;
