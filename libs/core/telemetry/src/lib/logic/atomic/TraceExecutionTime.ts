/**
 * @section Telemetry Logic - Performance Metrics Apparatus
 * @description Átomo encargado de medir con precisión de microsegundos la ejecución
 * de acciones asíncronas. Gestiona el rastro lingüístico soberano y despacha
 * los resultados de latencia al flujo sanguíneo digital.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & ISO Technical Naming.
 * SANEADO Zenith: Resolución de error de Linter (sort-imports).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { EmitTelemetrySignal } from './EmitTelemetrySignal';
import type {
  CorrelationIdentifier,
  ModuleIdentifier,
  OperationCode,
} from '../../schemas/TelemetrySignal.schema';

/**
 * Identificador técnico para reportes de métricas internas del sistema nervioso central.
 * Cumple con la norma ISO de nomenclatura prosaica.
 */
const PERFORMANCE_MONITOR_IDENTIFIER = 'TELEMETRY_PERFORMANCE_MONITOR' as ModuleIdentifier;

/**
 * Ejecuta una acción atómica asíncrona, midiendo su tiempo de ejecución
 * y reportando el resultado automáticamente al sistema de telemetría.
 *
 * @template TExecutionResult - Tipo de retorno esperado de la acción encapsulada.
 * @param moduleIdentifierLiteral - Nombre técnico del búnker emisor.
 * @param operationCodeLiteral - Código semántico de la operación.
 * @param correlationIdentifier - Identificador para trazabilidad forense.
 * @param asynchronousActionFunction - Lógica de negocio a ser medida.
 * @returns {Promise<TExecutionResult>} El resultado inalterado de la función.
 * @throws Relanza cualquier excepción capturada para preservar el flujo original.
 */
export const TraceExecutionTime = async <TExecutionResult>(
  moduleIdentifierLiteral: string,
  operationCodeLiteral: string,
  correlationIdentifier: string,
  asynchronousActionFunction: () => Promise<TExecutionResult>,
): Promise<TExecutionResult> => {
  /**
   * @section Captura de Marca Temporal Inicial
   * Utilizamos el hardware de alta resolución para precisión de grado industrial.
   */
  const executionStartTimestampInMillisecondsQuantity = performance.now();

  try {
    // 1. EJECUCIÓN DE LA LÓGICA DE NEGOCIO (Wrapper Pattern)
    const resultingExecutionData = await asynchronousActionFunction();

    // 2. CÁLCULO DE LATENCIA NOMINAL
    const executionEndTimestampInMillisecondsQuantity = performance.now();
    const totalExecutionLatencyInMillisecondsQuantity =
      executionEndTimestampInMillisecondsQuantity - executionStartTimestampInMillisecondsQuantity;

    // 3. EMISIÓN DE SEÑAL DE RENDIMIENTO POSITIVO
    EmitTelemetrySignal({
      severityLevelLiteral: 'INFO',
      moduleIdentifierLiteral: PERFORMANCE_MONITOR_IDENTIFIER,
      operationCodeLiteral: `${operationCodeLiteral}_PERFORMANCE_SUCCESS` as OperationCode,
      correlationIdentifier: correlationIdentifier as CorrelationIdentifier,
      messageContentLiteral: 'TELEMETRY.SIGNALS.LATENCY_REPORT',
      executionLatencyInMillisecondsQuantity: totalExecutionLatencyInMillisecondsQuantity,
      contextMetadataSnapshot: {
        targetModuleLiteral: moduleIdentifierLiteral,
        targetOperationLiteral: operationCodeLiteral,
        statusLiteral: 'SUCCESS',
      },
    });

    return resultingExecutionData;
  } catch (caughtError: unknown) {
    /**
     * @section Gestión Forense de Fallo con Medición de Latencia
     * Incluso en caso de error, el rastro de tiempo es vital para detectar
     * ataques de denegación de servicio o cuellos de botella.
     */
    const executionEndTimestampInMillisecondsQuantity = performance.now();
    const totalExecutionLatencyInMillisecondsQuantity =
      executionEndTimestampInMillisecondsQuantity - executionStartTimestampInMillisecondsQuantity;

    const errorDescriptionLiteral =
      caughtError instanceof Error ? caughtError.message : String(caughtError);

    EmitTelemetrySignal({
      severityLevelLiteral: 'ERROR',
      moduleIdentifierLiteral: PERFORMANCE_MONITOR_IDENTIFIER,
      operationCodeLiteral: `${operationCodeLiteral}_PERFORMANCE_FAILURE` as OperationCode,
      correlationIdentifier: correlationIdentifier as CorrelationIdentifier,
      messageContentLiteral: 'TELEMETRY.SIGNALS.LATENCY_REPORT',
      executionLatencyInMillisecondsQuantity: totalExecutionLatencyInMillisecondsQuantity,
      contextMetadataSnapshot: {
        errorTraceLiteral: errorDescriptionLiteral,
        targetModuleLiteral: moduleIdentifierLiteral,
        targetOperationLiteral: operationCodeLiteral,
        statusLiteral: 'FAILURE',
      },
    });

    // Propagación de burbuja de error inalterada.
    throw caughtError;
  }
};
