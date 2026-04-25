/**
 * @section Health Monitor Engine - Package Entry Point
 * @description Centraliza las capacidades de vigilancia de infraestructura (SRE)
 * y contratos de estado vital.
 *
 * Protocolo OEDP-V14.0 - Single Source Resolution.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

export const HEALTH_MONITOR_VERSION = '1.3.1';

export * from './lib/schemas/HealthStatus.schema';
export { MonitorInfrastructureService } from './lib/logic/MonitorInfrastructureService';
