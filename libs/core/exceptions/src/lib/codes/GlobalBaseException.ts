/**
 * @section Exception Engine - Base Infrastructure
 * @description Clase base abstracta para la gestión estandarizada de anomalías.
 * Proporciona la estructura fundamental para la captura forense de fallos
 * e inmutabilidad de contexto (ADR 0014).
 *
 * Protocolo OEDP-V17.0 - ISO Technical Naming & Isomorphic Integrity.
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import type { ErrorCode } from '../schemas/Exception.schema';

/**
 * @interface IV8StackProvider
 * @description Interfaz técnica para el acceso seguro a las APIs de rastro de V8.
 */
interface IV8StackProvider {
  captureStackTrace(
    targetObject: object,
    constructorOpt?: (...args: unknown[]) => unknown
  ): void;
}

/**
 * @class GlobalBaseException
 * @extends {Error}
 * @description Ancestro supremo de todas las excepciones del ecosistema.
 * Obliga a la captura de un snapshot de memoria para auditoría del Neural Sentinel.
 */
export abstract class GlobalBaseException extends Error {
  public readonly operationalErrorCodeLiteral: ErrorCode;
  public readonly httpStatusCodeNumeric: number;
  public readonly occurrenceTimestampISO: string;
  public readonly runtimeContextSnapshot: Record<string, unknown>;

  /**
   * Inicializa la excepción inyectando el ADN forense.
   *
   * @param messageLiteral - Descripción humana/técnica del fallo.
   * @param operationalErrorCodeLiteral - Código soberano catalogado en la Aduana de ADN.
   * @param httpStatusCodeNumeric - Código de estado HTTP para el triaje de red.
   * @param contextMetadataCollection - Diccionario opcional de variables de entorno del fallo.
   */
  public constructor(
    messageLiteral: string,
    operationalErrorCodeLiteral: ErrorCode,
    httpStatusCodeNumeric: number,
    contextMetadataCollection: Record<string, unknown> = {}
  ) {
    super(messageLiteral);

    // 1. ASIGNACIÓN DE IDENTIDAD ISO
    this.name = this.constructor.name;
    this.operationalErrorCodeLiteral = operationalErrorCodeLiteral;
    this.httpStatusCodeNumeric = httpStatusCodeNumeric;
    this.occurrenceTimestampISO = new Date().toISOString();

    /**
     * 2. CONSTRUCCIÓN DE SNAPSHOT FORENSE (Immutable context)
     * Sellamos el objeto para garantizar que el rastro no sea alterado en el bus de datos.
     */
    this.runtimeContextSnapshot = Object.freeze({
      ...contextMetadataCollection,
      exceptionIdentifierLiteral: this.name,
      operationalErrorCodeLiteral: this.operationalErrorCodeLiteral,
      occurrenceTimestampISO: this.occurrenceTimestampISO,
      httpStatusCodeNumeric: this.httpStatusCodeNumeric,
    });

    // 3. CAPTURA DE RASTRO DE PILA (Isomorphic Guard)
    const stackProvider = Error as unknown as IV8StackProvider;

    if (typeof stackProvider.captureStackTrace === 'function') {
      const constructorReference = this.constructor as (...args: unknown[]) => unknown;
      stackProvider.captureStackTrace(this, constructorReference);
    }
  }
}
