/**
 * @section Telemetry Logic - LocalStorage Safe Reference
 * @description Proporciona un acceso seguro e isomórfico al objeto de almacenamiento
 * del hardware del ciudadano. Implementa un puente estructural para garantizar
 * la compilación en entornos de servidor (Node.js) donde los tipos de DOM
 * no están presentes.
 *
 * Protocolo OEDP-V17.0 - Hardware Isolation & Isomorphic Integrity.
 * SANEADO Zenith: Erradicación del error TS2304 mediante el patrón 'Bridge Interface'.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

/**
 * @interface IStorageHardwareBridge
 * @description Definición técnica de la forma física del almacenamiento local.
 * Este puente permite que el búnker sea agnóstico a la presencia de la
 * librería "DOM" durante la compilación de motores de servidor.
 */
interface IStorageHardwareBridge {
  readonly getItem: (keyLiteral: string) => string | null;
  readonly setItem: (keyLiteral: string, valueLiteral: string) => void;
  readonly removeItem: (keyLiteral: string) => void;
  readonly clear: () => void;
  readonly length: number;
}

/**
 * @interface IGlobalEnvironmentContext
 * @description Representación del contexto global (globalThis) con soporte
 * para la detección pasiva de capacidades de navegador.
 */
interface IGlobalEnvironmentContext {
  readonly localStorage?: IStorageHardwareBridge;
}

/**
 * Recupera una referencia segura al motor de persistencia del hardware si está disponible.
 * Implementa el patrón 'Return Early' para evitar accesos nulos en el servidor.
 *
 * @returns {IStorageHardwareBridge | null} Instancia física del almacén o nulo si es Runtime de Servidor.
 */
export const GetLocalStorageSafeReference = (): IStorageHardwareBridge | null => {
  /**
   * @section Acceso Protegido (Isomorphic Detection)
   * Consultamos globalThis para evitar el colapso de referencia en Node.js.
   */
  const globalContextReference = globalThis as unknown as IGlobalEnvironmentContext;

  // 1. Verificamos si el hardware de almacenamiento está físicamente cableado
  const isLocalStorageUnavailableBoolean =
    typeof globalContextReference.localStorage === 'undefined';

  if (isLocalStorageUnavailableBoolean) {
    return null;
  }

  /**
   * 2. Retorno de la referencia validada.
   * El casting es seguro tras la verificación de existencia anterior.
   */
  return globalContextReference.localStorage as IStorageHardwareBridge;
};
