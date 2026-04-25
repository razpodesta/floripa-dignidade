/**
 * @section Telemetry Logic - Forensic Exception Reporter
 * @description Transforma una instancia de excepción en una señal de telemetría estructurada.
 *
 * Protocolo OEDP-V14.0 - Verbatim Module Syntax.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import type { GlobalBaseException } from '@floripa-dignidade/exceptions';
import { EmitTelemetrySignal } from './EmitTelemetrySignal';

const EXCEPTION_REPORTER_IDENTIFIER = 'GLOBAL_EXCEPTION_REPORTER';

/**
 * Procesa una excepción, extrae su snapshot y emite la señal de alerta.
 *
 * @param exceptionContext - Instancia de la excepción capturada.
 * @param correlationIdentifier - Identificador único de transacción.
 */
export const ReportForensicException = (
  exceptionContext: GlobalBaseException,
  correlationIdentifier: string
): void => {
  const isInternalServerError = exceptionContext.httpStatusCode >= 500;
  const severityLevelLiteral = isInternalServerError ? 'CRITICAL' : 'ERROR';

  const telemetrySignalPayload = {
    severityLevel: severityLevelLiteral,
    moduleIdentifier: EXCEPTION_REPORTER_IDENTIFIER,
    operationCode: exceptionContext.operationalErrorCode,
    correlationIdentifier,
    message: exceptionContext.message,
    contextMetadata: {
      ...exceptionContext.runtimeContextSnapshot,
      originalExceptionNameLiteral: exceptionContext.name,
      httpStatusCodeNumeric: exceptionContext.httpStatusCode,
      occurrenceTimestampISO: exceptionContext.occurrenceTimestamp,
    },
  };

  EmitTelemetrySignal(telemetrySignalPayload);
};
