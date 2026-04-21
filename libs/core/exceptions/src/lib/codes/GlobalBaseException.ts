import { ErrorCode } from '../schemas/Exception.schema.js';

/**
 * Interfaz interna para extender el constructor de Error nativo.
 * Permite el acceso seguro a métodos específicos de motores V8 (Node.js/Chrome)
 * para la captura de trazas de pila personalizadas.
 */
interface IV8ErrorConstructor extends ErrorConstructor {
  /**
   * Método específico de V8 para capturar el stack trace.
   * constructorOpt es la función que se omitirá en el rastreo de la pila para mantener el foco en el error.
   */
  captureStackTrace?: (
    targetObject: object,
    constructorOpt?: (...args: unknown[]) => unknown
  ) => void;
}

/**
 * Clase base abstracta para todas las excepciones del ecosistema Floripa Dignidade.
 * Proporciona una estructura de error enriquecida con códigos semánticos, 
 * estados HTTP y metadatos de contexto para auditoría forense.
 */
export abstract class GlobalBaseException extends Error {
  public readonly errorCode: ErrorCode;
  public readonly statusCode: number;
  public readonly contextMetadata: Record<string, unknown>;

  /**
   * Inicializa una nueva instancia de la excepción global.
   * 
   * @param {string} message - Descripción legible de la falla detectada.
   * @param {ErrorCode} errorCode - Código semántico inmutable (ej: VALIDATION_FAILED).
   * @param {number} statusCode - Código de estado HTTP correspondiente a la gravedad del fallo.
   * @param {Record<string, unknown>} contextMetadata - Instantánea del estado del sistema al fallar.
   */
  public constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    contextMetadata: Record<string, unknown> = {}
  ) {
    super(message);

    // Asegura la integridad del nombre de la clase en el stack trace
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.contextMetadata = contextMetadata;

    // Validación defensiva para entornos basados en V8 (Node.js/Chromium)
    const v8ErrorConstructor = Error as IV8ErrorConstructor;

    if (typeof v8ErrorConstructor.captureStackTrace === 'function') {
      /**
       * Capturamos la traza omitiendo el constructor actual para mejorar 
       * la precisión de la auditoría por parte del Neural Sentinel.
       */
      const constructorReference = this.constructor as unknown as (...args: unknown[]) => unknown;
      v8ErrorConstructor.captureStackTrace(this, constructorReference);
    }
  }
}