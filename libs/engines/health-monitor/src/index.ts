/**
 * 🩺 Health Monitor Engine - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - SRE Infrastructure Vigilance
 *
 * Este búnker centraliza la exportación de capacidades para la vigilancia
 * de infraestructura y contratos de estado vital (UP/DEGRADED/DOWN).
 *
 * @author Staff Software Engineer - Floripa Dignidade
 */

/**
 * @section Trazabilidad Operativa
 * Versión de la interfaz pública del motor de monitoreo.
 */
export const HEALTH_MONITOR_VERSION = '1.3.1';

/**
 * @section ADN Estructural (Sovereign Contracts)
 * Exportación de esquemas Zod e interfaces inmutables de estado de salud.
 * Define la gramática que el Neural Sentinel utiliza para entender la infraestructura.
 */
export * from './lib/schemas/HealthStatus.schema';

/**
 * @section Vigilancia Atómica (Apparatus)
 * Exportación del orquestador de sondas de salud.
 * Sincronizado con el estándar de nomenclatura PascalCase para Aparatos Atómicos.
 */
export { MonitorInfrastructureService } from './lib/logic/MonitorInfrastructureService';
