/**
 * @section Telemetry Logic - Mode Discovery Atom
 * @description Átomo encargado de verificar si el sistema opera en modo de
 * depuración técnica basándose en los metadatos de infraestructura.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Metadata Isolation.
 */

import { ExtractTelemetryInfrastructureConfiguration } from '../drivers/ExtractTelemetryInfrastructureConfiguration';

/**
 * Determina si el entorno activo es de desarrollo.
 *
 * @returns {boolean} Verdadero si NODE_ENV es 'development'.
 */
export const DetermineDevelopmentEnvironment = (): boolean => {
  const configuration = ExtractTelemetryInfrastructureConfiguration();

  return configuration.nodeExecutionEnvironmentLiteral === 'development';
};
