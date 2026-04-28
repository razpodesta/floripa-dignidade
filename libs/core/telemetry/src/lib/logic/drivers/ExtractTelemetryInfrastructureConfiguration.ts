/**
 * @section Telemetry Drivers - Infrastructure Configurator
 * @description Átomo encargado de la extracción segura y tipada de los secretos
 * de infraestructura necesarios para el transporte de señales. Aísla el acceso
 * al hardware (process.env) de la lógica de red.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Hardware Isolation.
 */

/**
 * @interface ITelemetryInfrastructureConfiguration
 * @description Contrato inmutable para la parametrización del transporte cloud.
 */
export interface ITelemetryInfrastructureConfiguration {
  readonly nodeExecutionEnvironmentLiteral: string;
  readonly cloudStorageUrlLiteral: string | undefined;
  readonly cloudStorageSecurityKeySecret: string | undefined;
}

/**
 * @interface IGlobalNodeContext
 * @description Puente de tipos para el acceso isomórfico al entorno.
 */
interface IGlobalNodeContext {
  readonly process?: {
    readonly env: Record<string, string | undefined>;
  };
}

/**
 * Extrae los metadatos de infraestructura desde el contexto global de ejecución.
 *
 * @returns {ITelemetryInfrastructureConfiguration} Configuración purificada.
 */
export const ExtractTelemetryInfrastructureConfiguration = (): ITelemetryInfrastructureConfiguration => {
  const globalContextReference = globalThis as unknown as IGlobalNodeContext;

  return {
    nodeExecutionEnvironmentLiteral: globalContextReference.process?.env['NODE_ENV'] ?? 'development',
    cloudStorageUrlLiteral: globalContextReference.process?.env['SUPABASE_URL'],
    cloudStorageSecurityKeySecret: globalContextReference.process?.env['SUPABASE_SERVICE_ROLE_KEY'],
  };
};
