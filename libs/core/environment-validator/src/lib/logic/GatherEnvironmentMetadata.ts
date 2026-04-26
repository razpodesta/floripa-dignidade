/**
 * @section Environment Logic - Metadata Collector
 * @description Átomo encargado de la extracción física de variables de entorno
 * desde el contexto global de ejecución. Actúa como el sensor de hardware.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Hardware Isolation.
 */

/**
 * @interface IGlobalNodeContext
 * @description Puente de tipos para el acceso seguro al objeto process.
 */
interface IGlobalNodeContext {
  readonly process?: {
    readonly env: Record<string, string | undefined>;
  };
}

/**
 * Recolecta las variables de entorno inyectadas en el pod de ejecución.
 *
 * @returns {Record<string, string | undefined>} Colección de metadatos crudos.
 */
export const GatherEnvironmentMetadata = (): Record<string, string | undefined> => {
  /**
   * SANEADO Zenith: Uso de globalThis para interoperabilidad isomórfica
   * (Node.js, Edge Runtime, Docker).
   */
  const globalContextReference = globalThis as unknown as IGlobalNodeContext;

  return globalContextReference.process?.env ?? {};
};
