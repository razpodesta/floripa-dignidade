import { emitTelemetrySignal, generateCorrelationIdentifier } from '@floripa-dignidade/telemetry';
import { HealthStatus, IInfrastructureCheck } from '../schemas/HealthStatus.schema.js';

/**
 * Registra el estado de salud de un servicio externo en el flujo sanguíneo digital.
 * Actúa como un vigilante de infraestructura (SRE) evaluando latencias y caídas.
 * Cumple con el principio de Atomicidad Funcional (OEDP-V5.5).
 *
 * @param {string} serviceName - Nombre identificador del servicio (ej: 'DATABASE_MAIN').
 * @param {() => Promise<void>} checkAction - Promesa que evalúa la disponibilidad del servicio.
 * @returns {Promise<IInfrastructureCheck>} El resultado estructurado de la evaluación de salud.
 */
export const checkInfrastructureService = async (
  serviceName: string,
  checkAction: () => Promise<void>
): Promise<IInfrastructureCheck> => {
  const correlationIdentifier = generateCorrelationIdentifier();
  const startTime = performance.now();
  let status: HealthStatus = 'UP';

  try {
    await checkAction();
  } catch (_error) {
    status = 'DOWN';
    // TODO: Aquí se conectará con reportException de Telemetry en la próxima iteración
  }

  const latency = performance.now() - startTime;

  // Si el servicio responde pero demora más de 500ms, se marca como degradado.
  if (latency > 500 && status === 'UP') {
    status = 'DEGRADED';
  }

  const checkResult: IInfrastructureCheck = {
    serviceName,
    status,
    latencyInMilliseconds: latency,
    lastCheckTimestamp: new Date().toISOString()
  };

  // Emitir señal inmutable a Telemetry
  emitTelemetrySignal({
    severityLevel: status === 'DOWN' ? 'CRITICAL' : status === 'DEGRADED' ? 'WARNING' : 'INFO',
    moduleIdentifier: 'HEALTH_MONITOR',
    operationCode: `HEALTH_CHECK_${serviceName.toUpperCase()}`,
    correlationIdentifier,
    message: `Health check performed for ${serviceName}: ${status}`,
    executionLatencyInMilliseconds: latency
  });

  return checkResult;
};
