/**
 * @section Environment Logic - Hardware Metadata Sensor
 * @description Átomo de lógica pura encargado de la extracción física de variables
 * de entorno desde el contexto global de ejecución. Actúa como el sensor primario
 * de hardware, aislando el acceso a 'process.env' para garantizar la
 * interoperabilidad entre Node.js, Docker y Edge Runtimes.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Hardware Isolation.
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

/**
 * @interface IGlobalExecutionContext
 * @description Puente de tipos soberano para el acceso seguro al objeto de proceso
 * del sistema operativo o entorno de ejecución cloud.
 */
interface IGlobalExecutionContext {
  readonly process?: {
    readonly env: Record<string, string | undefined>;
  };
}

/**
 * @name IEnvironmentMetadataSnapshot
 * @description Representación física de la colección de metadatos capturados.
 */
export type IEnvironmentMetadataSnapshot = Record<string, string | undefined>;

/**
 * Recolecta las variables de entorno inyectadas en el pod de ejecución.
 * Implementa una estrategia de captura pasiva sin mutaciones.
 *
 * @returns {IEnvironmentMetadataSnapshot} Colección inmutable de metadatos crudos.
 */
export const GatherEnvironmentMetadata = (): IEnvironmentMetadataSnapshot => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  /**
   * @section Captura Isomórfica
   * SANEADO Zenith: El uso de 'globalThis' como raíz garantiza que el sensor
   * no colapse en entornos donde 'window' o 'process' no están definidos globalmente.
   */
  const globalExecutionContextReference = globalThis as unknown as IGlobalExecutionContext;

  const environmentVariablesCollection = globalExecutionContextReference.process?.env ?? {};

  // REPORTE DE ACTIVACIÓN DE SENSOR (SRE Visibility)
  void EmitTelemetrySignal({
    severityLevel: 'DEBUG',
    moduleIdentifier: 'ENVIRONMENT_HARDWARE_SENSOR',
    operationCode: 'HARDWARE_METADATA_EXTRACTED',
    correlationIdentifier,
    message: 'Sensor de hardware activado: Captura de variables de entorno finalizada.',
    contextMetadata: {
      variablesCountQuantity: Object.keys(environmentVariablesCollection).length,
    },
  });

  return environmentVariablesCollection;
};
