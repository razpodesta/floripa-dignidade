import { ErrorCode } from '../schemas/Exception.schema';

/**
 * @section Exception Engine - Core Infrastructure
 * @description Interfaz interna para la extensión segura del constructor de Error nativo.
 * Permite el acceso a métodos de bajo nivel del motor V8 (Node.js/Chromium).
 */
interface IV8ErrorConstructor extends ErrorConstructor {
  captureStackTrace?: (
    targetObject: object,
    constructorOpt?: (...args: unknown[]) => unknown,
  ) => void;
}

/**
 * Clase base abstracta soberana para todas las excepciones del ecosistema Floripa Dignidade.
 * Proporciona una estructura de error enriquecida con códigos ISO semánticos,
 * estados de respuesta HTTP y un snapshot forense inmutable.
 * 
 * Protocolo OEDP-V13.0 - Resiliencia Isomórfica.
 *
 * @abstract
 * @extends {Error}
 */
export abstract class GlobalBaseException extends Error {
  /** Identificador semántico inmutable para el mapeo de i18n y telemetría. */
  public readonly operationalErrorCode: ErrorCode;

  /** Código de estado de red (HTTP) para la clasificación de severidad. */
  public readonly httpStatusCode: number;

  /** Marca temporal ISO-8601 del momento exacto de la anomalía. */
  public readonly occurrenceTimestamp: string;

  /** Instantánea inmutable del contexto del sistema al momento del fallo. */
  public readonly runtimeContextSnapshot: Record<string, unknown>;

  /**
   * Inicializa una nueva instancia de la excepción global.
   *
   * @param {string} message - Descripción legible de la anomalía.
   * @param {ErrorCode} operationalErrorCode - Código semántico (ej: VALIDATION_FAILED).
   * @param {number} httpStatusCode - Gravedad del fallo (Estándar HTTP).
   * @param {Record<string, unknown>} contextMetadata - Snapshot de variables para el Neural Sentinel.
   */
  public constructor(
    message: string,
    operationalErrorCode: ErrorCode,
    httpStatusCode: number,
    contextMetadata: Record<string, unknown> = {},
  ) {
    super(message);

    // 1. Sincronización de Identidad ISO
    this.name = this.constructor.name;
    this.operationalErrorCode = operationalErrorCode;
    this.httpStatusCode = httpStatusCode;
    this.occurrenceTimestamp = new Date().toISOString();
    
    // 2. Blindaje de Snapshot (Inmutabilidad Forense)
    this.runtimeContextSnapshot = Object.freeze({
      ...contextMetadata,
      exceptionName: this.name,
      operationalErrorCode: this.operationalErrorCode,
    });

    // 3. Trazabilidad de Pila (Isomorphic Safety)
    const v8ErrorConstructor = Error as IV8ErrorConstructor;

    if (typeof v8ErrorConstructor.captureStackTrace === 'function') {
      /**
       * Purga la pila de ejecución: Se omite la referencia al constructor
       * actual para que el log comience en el sitio real de la excepción.
       */
      const constructorReference = this.constructor as unknown as (...args: unknown[]) => unknown;
      v8ErrorConstructor.captureStackTrace(this, constructorReference);
    }
  }
}