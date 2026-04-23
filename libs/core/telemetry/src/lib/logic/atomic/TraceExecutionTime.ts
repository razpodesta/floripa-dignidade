/**
 * @section Telemetry Engine - Performance Metrics Apparatus
 * @description Orquestador de rendimiento cognitivo y trazabilidad de latencia.
 * Mide con precisión de microsegundos la ejecución de acciones asíncronas
 * y despacha los resultados al flujo sanguíneo digital.
 *
 * Protocolo OEDP-V13.0 - Atomic Functional & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { EmitTelemetrySignal } from './EmitTelemetrySignal';

/** Identificador técnico para reportes de métricas internas. */
const PERFORMANCE_MONITOR_IDENTIFIER = 'TELEMETRY_PERFORMANCE_MONITOR';

/**
 * Ejecuta una acción atómica asíncrona, midiendo su tiempo de ejecución
 * y reportando el resultado automáticamente al sistema de telemetría.
 *
 * @template TResult - Tipo de retorno esperado de la acción ejecutada.
 * @param {string} moduleIdentifier - Identificador del aparato que invoca la acción.
 * @param {string} operationCode - Código semántico de la operación (ej: FETCH_NEWS_DATA).
 * @param {string} correlationIdentifier - UUID forense para trazabilidad cross-module.
 * @param {() => Promise<TResult>} asynchronousAction - Lógica de negocio encapsulada.
 * @returns {Promise<TResult>} El resultado inalterado de la función proporcionada.
 * @throws Relanza cualquier error capturado para preservar la burbuja original.
 */
export const TraceExecutionTime = async <TResult>(
  moduleIdentifier: string,
  operationCode: string,
  correlationIdentifier: string,
  asynchronousAction: () => Promise<TResult>,
): Promise<TResult> => {

  // 1. Captura de Marca Temporal Inicial (Precisión ISO)
  const startTimeInMilliseconds = performance.now();

  try {
    // 2. Ejecución de la lógica de negocio
    const executionResult = await asynchronousAction();

    // 3. Cálculo de Latencia de Éxito
    const endTimeInMilliseconds = performance.now();
    const totalExecutionLatencyInMilliseconds = endTimeInMilliseconds - startTimeInMilliseconds;

    // 4. Emisión de Señal de Rendimiento Positivo
    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: PERFORMANCE_MONITOR_IDENTIFIER,
      operationCode: `${operationCode}_PERFORMANCE_SUCCESS`,
      correlationIdentifier,
      message: `Métrica de rendimiento: Ejecución exitosa de [${operationCode}] en el módulo [${moduleIdentifier}].`,
      executionLatencyInMilliseconds: totalExecutionLatencyInMilliseconds,
      contextMetadata: {
        targetModule: moduleIdentifier,
        targetOperation: operationCode
      }
    });

    return executionResult;

  } catch (caughtError) {
    // 5. Gestión de Fallo con Medición de Latencia (Forensic Analysis)
    const endTimeInMilliseconds = performance.now();
    const totalExecutionLatencyInMilliseconds = endTimeInMilliseconds - startTimeInMilliseconds;

    EmitTelemetrySignal({
      severityLevel: 'ERROR',
      moduleIdentifier: PERFORMANCE_MONITOR_IDENTIFIER,
      operationCode: `${operationCode}_PERFORMANCE_FAILURE`,
      correlationIdentifier,
      message: `Métrica de rendimiento: Fallo detectado en [${operationCode}] tras ${totalExecutionLatencyInMilliseconds.toFixed(2)}ms.`,
      executionLatencyInMilliseconds: totalExecutionLatencyInMilliseconds,
      contextMetadata: {
        errorTrace: caughtError instanceof Error ? caughtError.message : String(caughtError),
        targetModule: moduleIdentifier
      }
    });

    // 6. Preservar la integridad del flujo de la aplicación
    throw caughtError;
  }
};
