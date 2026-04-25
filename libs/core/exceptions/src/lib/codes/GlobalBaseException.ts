/**
 * @section Exception Engine - Base Infrastructure
 * @description Clase base abstracta para la gestión estandarizada de anomalías.
 * Proporciona estructuras para códigos de error y snapshots de contexto inmutables.
 *
 * Protocolo OEDP-V14.0 - Verbatim Module Syntax.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import type { ErrorCode } from '../schemas/Exception.schema';

interface IV8StackProvider {
  captureStackTrace(
    targetObject: object,
    constructorOpt?: (...args: unknown[]) => unknown
  ): void;
}

export abstract class GlobalBaseException extends Error {
  public readonly operationalErrorCode: ErrorCode;
  public readonly httpStatusCode: number;
  public readonly occurrenceTimestamp: string;
  public readonly runtimeContextSnapshot: Record<string, unknown>;

  public constructor(
    message: string,
    operationalErrorCode: ErrorCode,
    httpStatusCode: number,
    contextMetadata: Record<string, unknown> = {}
  ) {
    super(message);

    this.name = this.constructor.name;
    this.operationalErrorCode = operationalErrorCode;
    this.httpStatusCode = httpStatusCode;
    this.occurrenceTimestamp = new Date().toISOString();

    this.runtimeContextSnapshot = Object.freeze({
      ...contextMetadata,
      exceptionIdentifierLiteral: this.name,
      operationalErrorCodeLiteral: this.operationalErrorCode,
      occurrenceTimestampISO: this.occurrenceTimestamp,
      httpStatusCodeNumeric: this.httpStatusCode,
    });

    const stackProvider = Error as unknown as IV8StackProvider;

    if (typeof stackProvider.captureStackTrace === 'function') {
      const constructorReference = this.constructor as (...args: unknown[]) => unknown;
      stackProvider.captureStackTrace(this, constructorReference);
    }
  }
}
