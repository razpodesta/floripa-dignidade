import { emitTelemetrySignal } from './GlobalTelemetryManager.js';

/**
 * Orquestador de rendimiento cognitivo: Ejecuta una acción atómica y reporta
 * automáticamente su latencia al flujo sanguíneo digital (Telemetría).
 * Garantiza que la observabilidad de performance no interfiera con la lógica de negocio.
 *
 * @template T - Tipo de retorno inferido de la acción ejecutada.
 * @param {string} moduleIdentifier - Identificador único del aparato Lego que invoca la acción.
 * @param {string} operationCode - Código semántico de la operación a ejecutar (ej: FETCH_USER).
 * @param {string} correlationIdentifier - UUID forense para trazabilidad cross-module.
 * @param {() => Promise<T>} action - Lógica de negocio encapsulada en una función asíncrona.
 * @returns {Promise<T>} El resultado inalterado de la función proporcionada.
 */
export const traceExecutionTime = async <T>(
  moduleIdentifier: string,
  operationCode: string,
  correlationIdentifier: string,
  action: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await action();
    const endTime = performance.now();

    emitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier,
      operationCode,
      correlationIdentifier,
      message: `SUCCESS: ${operationCode}`,
      executionLatencyInMilliseconds: endTime - startTime
    });

    return result;
  } catch (error) {
    const endTime = performance.now();

    emitTelemetrySignal({
      severityLevel: 'ERROR',
      moduleIdentifier,
      operationCode,
      correlationIdentifier,
      message: `FAILURE: ${operationCode}`,
      executionLatencyInMilliseconds: endTime - startTime,
      contextMetadata: { errorTrace: String(error) }
    });

    throw error;
  }
};
