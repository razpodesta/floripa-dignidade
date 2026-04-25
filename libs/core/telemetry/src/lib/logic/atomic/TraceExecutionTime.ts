/**
 * @section Telemetry Engine - Performance Metrics Apparatus
 * @description Orquestador de rendimiento cognitivo y trazabilidad de latencia.
 * Mide con precisión de microsegundos la ejecución de acciones asíncronas,
 * gestiona el rastro lingüístico soberano y despacha los resultados al
 * flujo sanguíneo digital.
 *
 * Protocolo OEDP-V16.0 - Atomic Functional & Zero Abbreviations.
 * @author Raz Podestá - MetaShark Tech
 */

import { EmitTelemetrySignal } from './EmitTelemetrySignal';

/**
 * Identificador técnico para reportes de métricas internas del sistema nervioso central.
 * SANEADO: Nomenclatura ISO descriptiva.
 */
const PERFORMANCE_MONITOR_IDENTIFIER = 'TELEMETRY_PERFORMANCE_MONITOR';

/**
 * Ejecuta una acción atómica asíncrona, midiendo su tiempo de ejecución
 * y reportando el resultado automáticamente al sistema de telemetría
 * mediante señales internacionalizadas.
 *
 * @template TExecutionResult - Tipo de retorno esperado de la acción encapsulada.
 * @param moduleIdentifierLiteral - Nombre técnico del aparato emisor.
 * @param operationCodeLiteral - Código semántico de la operación (ej: PERSIST_USER_DATA).
 * @param correlationIdentifier - UUID v4 para trazabilidad forense cross-module.
 * @param asynchronousActionFunction - Lógica de negocio a ser envuelta y medida.
 * @returns {Promise<TExecutionResult>} El resultado inalterado de la función proporcionada.
 * @throws Relanza cualquier excepción capturada para preservar la burbuja original del llamante.
 */
export const TraceExecutionTime = async <TExecutionResult>(
  moduleIdentifierLiteral: string,
  operationCodeLiteral: string,
  correlationIdentifier: string,
  asynchronousActionFunction: () => Promise<TExecutionResult>,
): Promise<TExecutionResult> => {

  // 1. CAPTURA DE MARCA TEMPORAL INICIAL (Alta Precisión ISO)
  const executionStartTimestampInMilliseconds = performance.now();

  try {
    // 2. EJECUCIÓN DE LA LÓGICA DE NEGOCIO (Wrapper Pattern)
    const resultingExecutionData = await asynchronousActionFunction();

    // 3. CÁLCULO DE LATENCIA NOMINAL
    const executionEndTimestampInMilliseconds = performance.now();
    const totalExecutionLatencyInMilliseconds =
      executionEndTimestampInMilliseconds - executionStartTimestampInMilliseconds;

    // 4. EMISIÓN DE SEÑAL DE RENDIMIENTO POSITIVO (SANEADO: i18n Key Usage)
    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: PERFORMANCE_MONITOR_IDENTIFIER,
      operationCode: `${operationCodeLiteral}_PERFORMANCE_SUCCESS`,
      correlationIdentifier,
      /** 🛡️ SANEADO: Uso de la clave de diccionario 'signals.LATENCY_REPORT' */
      message: 'TELEMETRY.SIGNALS.LATENCY_REPORT',
      executionLatencyInMilliseconds: totalExecutionLatencyInMilliseconds,
      contextMetadata: {
        targetModuleLiteral: moduleIdentifierLiteral,
        targetOperationLiteral: operationCodeLiteral,
        statusLiteral: 'SUCCESS'
      }
    });

    return resultingExecutionData;

  } catch (caughtError: unknown) {
    // 5. GESTIÓN FORENSE DE FALLO CON MEDICIÓN DE LATENCIA
    const executionEndTimestampInMilliseconds = performance.now();
    const totalExecutionLatencyInMilliseconds =
      executionEndTimestampInMilliseconds - executionStartTimestampInMilliseconds;

    /** 🛡️ SANEADO: Extracción segura de mensaje de error de tipo 'unknown' */
    const errorDescriptionLiteral = caughtError instanceof Error
      ? caughtError.message
      : String(caughtError);

    EmitTelemetrySignal({
      severityLevel: 'ERROR',
      moduleIdentifier: PERFORMANCE_MONITOR_IDENTIFIER,
      operationCode: `${operationCodeLiteral}_PERFORMANCE_FAILURE`,
      correlationIdentifier,
      message: 'TELEMETRY.SIGNALS.LATENCY_REPORT',
      executionLatencyInMilliseconds: totalExecutionLatencyInMilliseconds,
      contextMetadata: {
        errorTraceLiteral: errorDescriptionLiteral,
        targetModuleLiteral: moduleIdentifierLiteral,
        targetOperationLiteral: operationCodeLiteral,
        statusLiteral: 'FAILURE'
      }
    });

    // 6. PROPAGACIÓN DE BURBUJA DE ERROR
    throw caughtError;
  }
};
