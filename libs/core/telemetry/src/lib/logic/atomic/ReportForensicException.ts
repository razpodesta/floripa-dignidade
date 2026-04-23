import { GlobalBaseException } from '@floripa-dignidade/exceptions';
import { EmitTelemetrySignal } from './EmitTelemetrySignal';

/**
 * @section Logic: ReportForensicException
 * @description Transforma una excepción de dominio en una señal de telemetría.
 * Protocolo OEDP-V13.0 - Forensic Observability.
 * Cumplimiento ISO/IEC 11179 - Zero Abbreviations.
 */

/** Identificador técnico inmutable del orquestador de excepciones. */
const EXCEPTION_HANDLER_IDENTIFIER = 'GLOBAL_EXCEPTION_REPORTER';

/**
 * Procesa una excepción de la base global, extrae su snapshot forense
 * y emite una señal de alerta con el nivel de severidad correspondiente.
 *
 * @param exceptionContext - Instancia de la excepción capturada.
 * @param correlationIdentifier - Identificador UUID para trazabilidad cruzada.
 * @returns {void}
 */
export const ReportForensicException = (
  exceptionContext: GlobalBaseException,
  correlationIdentifier: string
): void => {
  // 1. Clasificación de Severidad Técnica (Standard ISO/HTTP)
  // Los errores de servidor (500+) se marcan como CRITICAL para activar al Neural Sentinel.
  const isServerFailure = exceptionContext.httpStatusCode >= 500;
  const severityLevelLiteral = isServerFailure ? 'CRITICAL' : 'ERROR';

  // 2. Construcción del Payload de Señalización
  const telemetrySignalPayload = {
    severityLevel: severityLevelLiteral,
    moduleIdentifier: EXCEPTION_HANDLER_IDENTIFIER,
    operationCode: exceptionContext.operationalErrorCode,
    correlationIdentifier,
    message: exceptionContext.message,
    contextMetadata: {
      ...exceptionContext.runtimeContextSnapshot,
      originalExceptionName: exceptionContext.name,
      httpStatusCode: exceptionContext.httpStatusCode,
      occurrenceTimestamp: exceptionContext.occurrenceTimestamp,
    },
  };

  // 3. Despacho al Átomo de Emisión
  EmitTelemetrySignal(telemetrySignalPayload);
};
