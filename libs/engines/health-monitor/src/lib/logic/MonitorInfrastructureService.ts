/**
 * @section Health Monitoring - SRE Infrastructure Probe Apparatus
 * @description Aparato de vigilancia lógica para servicios externos del ecosistema.
 * Evalúa disponibilidad y latencia, reportando anomalías al flujo sanguíneo digital.
 *
 * Protocolo OEDP-V13.0 - Atomic SRE & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { mapHttpErrorToException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  ReportForensicException
} from '@floripa-dignidade/telemetry';
import {
  HealthStatus,
  IInfrastructureCheck
} from '../schemas/HealthStatus.schema';

/** Umbral técnico en milisegundos para marcar un servicio como degradado (ISO Performance). */
const MAXIMUM_NOMINAL_LATENCY_MILLISECONDS = 500;

/** Identificador soberano del búnker monitor para el Neural Sentinel. */
const MONITOR_MODULE_IDENTIFIER = 'INFRASTRUCTURE_HEALTH_MONITOR';

/**
 * Ejecuta una sonda de salud sobre un servicio externo, evalúa su pulso vital
 * y registra el reporte inmutable en el sistema de telemetría.
 *
 * @param targetServiceNameLiteral - Nombre técnico del servicio (ej: 'POSTGRES_DB_MAIN').
 * @param executeHealthCheckAction - Promesa encapsulada que valida la conectividad.
 * @returns {Promise<IInfrastructureCheck>} Reporte estructurado del estado de salud.
 */
export const MonitorInfrastructureService = async (
  targetServiceNameLiteral: string,
  executeHealthCheckAction: () => Promise<void>
): Promise<IInfrastructureCheck> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();
  const startTimeInMilliseconds = performance.now();

  let infrastructureHealthStatus: HealthStatus = 'UP';

  try {
    /**
     * 1. EJECUCIÓN DE LA SONDA (Infrastructure Probe)
     * Se intenta realizar la acción de validación (ping, handshake, etc.).
     */
    await executeHealthCheckAction();

  } catch (caughtError) {
    /**
     * 2. GESTIÓN FORENSE DE CAÍDA (Fault Tolerance)
     * Si la sonda falla, el estado se degrada a DOWN inmediatamente.
     */
    infrastructureHealthStatus = 'DOWN';

    /**
     * Transformamos el error de red en una excepción soberana para capturar
     * el snapshot del entorno (variables de entorno, stack trace purificado).
     */
    const infrastructureServiceException = mapHttpErrorToException(
      503, // Service Unavailable (Estándar ISO para infraestructura)
      `FALLO_CRITICO_EN_SERVICIO_EXTERNO: ${targetServiceNameLiteral}`,
      {
        targetServiceNameLiteral,
        originalErrorMessage: caughtError instanceof Error ? caughtError.message : String(caughtError)
      }
    );

    // Reporte forense automático al búnker de telemetría.
    ReportForensicException(infrastructureServiceException, correlationIdentifier);
  }

  const executionLatencyInMilliseconds = performance.now() - startTimeInMilliseconds;

  /**
   * 3. EVALUACIÓN DE DEGRADACIÓN (Latency Check)
   * Si el servicio responde pero excede el umbral nominal, se reporta como degradado.
   */
  if (
    infrastructureHealthStatus === 'UP' &&
    executionLatencyInMilliseconds > MAXIMUM_NOMINAL_LATENCY_MILLISECONDS
  ) {
    infrastructureHealthStatus = 'DEGRADED';
  }

  // 4. CONSTRUCCIÓN DEL REPORTE FINAL (Atomic Report)
  const infrastructureHealthReport: IInfrastructureCheck = {
    serviceName: targetServiceNameLiteral,
    status: infrastructureHealthStatus,
    latencyInMilliseconds: executionLatencyInMilliseconds,
    lastCheckTimestamp: new Date().toISOString()
  };

  /**
   * 5. EMISIÓN DE SEÑAL VITAL (Heartbeat Signaling)
   * Despachamos el pulso al flujo sanguíneo digital.
   */
  EmitTelemetrySignal({
    severityLevel: infrastructureHealthStatus === 'DOWN' ? 'CRITICAL' :
                   infrastructureHealthStatus === 'DEGRADED' ? 'WARNING' : 'INFO',
    moduleIdentifier: MONITOR_MODULE_IDENTIFIER,
    operationCode: `HEALTH_PROBE_${targetServiceNameLiteral.toUpperCase()}_EXECUTED`,
    correlationIdentifier,
    message: `Sonda de salud finalizada para [${targetServiceNameLiteral}]: [${infrastructureHealthStatus}]`,
    executionLatencyInMilliseconds,
    contextMetadata: {
      infrastructureStatus: infrastructureHealthStatus,
      isNominal: infrastructureHealthStatus === 'UP'
    }
  });

  return infrastructureHealthReport;
};
