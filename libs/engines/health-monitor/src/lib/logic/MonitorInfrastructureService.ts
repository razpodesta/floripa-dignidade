/**
 * @section Health Monitoring - Infrastructure Probe
 * @description Aparato de vigilancia lógica para servicios externos del ecosistema.
 * Evalúa disponibilidad y latencia, reportando anomalías al sistema de telemetría.
 *
 * SANEADO Zenith: Sincronizacion de importacion PascalCase (Fix TS2724).
 * Protocolo OEDP-V17.0 - Verbatim Module Syntax & ISO Technical Naming.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { MapHttpErrorToException } from '@floripa-dignidade/exceptions'; // 🛡️ SANEADO
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  ReportForensicException
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import type {
  HealthStatus,
  IInfrastructureCheck
} from '../schemas/HealthStatus.schema';

const MAXIMUM_NOMINAL_LATENCY_MILLISECONDS = 500;
const MONITOR_MODULE_IDENTIFIER = 'INFRASTRUCTURE_HEALTH_MONITOR';

/**
 * Ejecuta una sonda de salud sobre un servicio externo.
 *
 * @param targetServiceNameLiteral - Nombre técnico del servicio.
 * @param executeHealthCheckAction - Acción encapsulada de validación.
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
    await executeHealthCheckAction();
  } catch (caughtError) {
    infrastructureHealthStatus = 'DOWN';

    // 🛡️ SANEADO: Uso del atomo nivelado en PascalCase
    const infrastructureServiceException = MapHttpErrorToException(
      503,
      `FALLO_CRITICO_EN_SERVICIO_EXTERNO: ${targetServiceNameLiteral}`,
      {
        targetServiceNameLiteral,
        originalErrorMessage: caughtError instanceof Error ? caughtError.message : String(caughtError)
      }
    );

    ReportForensicException(infrastructureServiceException, correlationIdentifier);
  }

  const executionLatencyInMilliseconds = performance.now() - startTimeInMilliseconds;

  if (
    infrastructureHealthStatus === 'UP' &&
    executionLatencyInMilliseconds > MAXIMUM_NOMINAL_LATENCY_MILLISECONDS
  ) {
    infrastructureHealthStatus = 'DEGRADED';
  }

  const infrastructureHealthReport: IInfrastructureCheck = {
    serviceName: targetServiceNameLiteral,
    status: infrastructureHealthStatus,
    latencyInMilliseconds: executionLatencyInMilliseconds,
    lastCheckTimestamp: new Date().toISOString()
  };

  void EmitTelemetrySignal({
    severityLevel: infrastructureHealthStatus === 'DOWN' ? 'CRITICAL' :
                   infrastructureHealthStatus === 'DEGRADED' ? 'WARNING' : 'INFO',
    moduleIdentifier: MONITOR_MODULE_IDENTIFIER,
    operationCode: `HEALTH_PROBE_${targetServiceNameLiteral.toUpperCase()}_EXECUTED`,
    correlationIdentifier,
    message: `Sonda de salud finalizada para [${targetServiceNameLiteral}]: [${infrastructureHealthStatus}]`,
    executionLatencyInMillisecondsQuantity: executionLatencyInMilliseconds, // 🛡️ Naming ISO
    contextMetadataSnapshot: { // 🛡️ Naming ISO
      infrastructureStatus: infrastructureHealthStatus,
      isNominal: infrastructureHealthStatus === 'UP'
    }
  });

  return infrastructureHealthReport;
};
