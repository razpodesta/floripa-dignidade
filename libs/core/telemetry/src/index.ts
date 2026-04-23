/**
 * 📡 Core Telemetry - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Atomic Architecture
 *
 * Este búnker centraliza la exportación de capacidades de observabilidad,
 * trazabilidad forense y medición de rendimiento para todo el ecosistema.
 *
 * @author Staff Software Engineer - Floripa Dignidade
 */

/**
 * @section Trazabilidad Operativa
 * Elevación a versión de estabilización de rutas (Symmetry Patch).
 */
export const CORE_TELEMETRY_VERSION = '1.3.5';

/**
 * @section ADN Estructural (Sovereign Contracts)
 * Exportación de contratos de señales, esquemas Zod e interfaces de telemetría.
 */
export * from './lib/schemas/TelemetrySignal.schema';

/**
 * @section Lógica Atómica (Apparatus)
 * Exportación de la lógica soberana de emisión, identificación y medición.
 *
 * Protocolo de Nomenclatura: Se utiliza PascalCase para funciones que
 * representan aparatos lógicos atómicos independientes.
 */
export { EmitTelemetrySignal } from './lib/logic/atomic/EmitTelemetrySignal';
export { GenerateCorrelationIdentifier } from './lib/logic/atomic/GenerateCorrelationIdentifier';
export { ReportForensicException } from './lib/logic/atomic/ReportForensicException';

/**
 * @important Resolución de Conflicto de Identidad (TS1261 - Forensic Fix)
 * Forzamos la exportación mediante la ruta física exacta en PascalCase.
 * Esta línea sincroniza el grafo de tipos con el aparato TraceExecutionTime.
 */
export { TraceExecutionTime } from './lib/logic/atomic/TraceExecutionTime';
