/**
 * @section Telemetry Logic - Forensic Exception Reporter
 * @description Átomo encargado de transformar una instancia de excepción técnica
 * nivelada (GlobalBaseException) en una señal de telemetría estructurada.
 * Actúa como el traductor entre el motor de fallos y el sistema nervioso central.
 *
 * Protocolo OEDP-V17.0 - ISO Technical Naming & SRE Resilience.
 * SANEADO Zenith: Resolución de error 'sort-imports' y validación de ADN nominal.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import type { GlobalBaseException } from '@floripa-dignidade/exceptions';
import { EmitTelemetrySignal } from './EmitTelemetrySignal';

/**
 * 🛡️ SANEADO Zenith: Miembros ordenados alfabéticamente (C < M < O)
 * para cumplimiento estricto de la regla 'sort-imports'.
 */
import type {
  CorrelationIdentifier,
  ModuleIdentifier,
  OperationCode,
} from '../../schemas/TelemetrySignal.schema';

/** Identificador técnico del aparato emisor para el rastro forense. */
const EXCEPTION_REPORTER_MODULE_IDENTIFIER = 'GLOBAL_EXCEPTION_REPORTER' as ModuleIdentifier;

/**
 * Procesa una excepción capturada, extrae su snapshot de memoria y
 * emite una señal de alerta priorizada al Neural Sentinel.
 *
 * @param caughtExceptionInstance - Instancia de la excepción nivelada bajo TIER 0.
 * @param correlationIdentifier - Identificador único de trazabilidad de la transacción.
 * @returns {void}
 */
export const ReportForensicException = (
  caughtExceptionInstance: GlobalBaseException,
  correlationIdentifier: string,
): void => {
  /**
   * @section Triaje de Severidad
   * Las excepciones con código 500 o superior se elevan automáticamente a CRITICAL.
   */
  const isInternalServerErrorBoolean = caughtExceptionInstance.httpStatusCodeNumeric >= 500;
  const severityLevelLiteral = isInternalServerErrorBoolean ? 'CRITICAL' : 'ERROR';

  /**
   * @section Construcción de Señal (Payload Snapshot)
   * Realizamos un casting a 'unknown' antes de convertir a 'OperationCode'.
   * Esto es necesario porque estamos cruzando tipos nominales entre búnkeres
   * distintos (Exceptions vs Telemetry) preservando el sellado de marca.
   */
  const telemetrySignalPayloadSnapshot = {
    severityLevelLiteral,
    moduleIdentifierLiteral: EXCEPTION_REPORTER_MODULE_IDENTIFIER,
    operationCodeLiteral: caughtExceptionInstance.operationalErrorCodeLiteral as unknown as OperationCode,
    correlationIdentifier: correlationIdentifier as CorrelationIdentifier,
    messageContentLiteral: caughtExceptionInstance.message,

    /**
     * @section Contexto Forense (Immutable Snapshot)
     * Inyectamos el rastro inalterable de la excepción para reconstrucción vía IA.
     */
    contextMetadataSnapshot: {
      ...caughtExceptionInstance.runtimeContextSnapshot,
      originalExceptionNameLiteral: caughtExceptionInstance.name,
      httpStatusCodeNumeric: caughtExceptionInstance.httpStatusCodeNumeric,
      occurrenceTimestampISO: caughtExceptionInstance.occurrenceTimestampISO,
    },
  };

  /**
   * Despacho físico hacia el bus de datos (Fire-and-forget).
   * Se utiliza el operador void para indicar que la ejecución es asíncrona y desatendida.
   */
  void EmitTelemetrySignal(telemetrySignalPayloadSnapshot);
};
