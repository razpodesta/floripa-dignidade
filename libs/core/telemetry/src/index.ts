/**
 * @section Core Telemetry - Package Entry Point
 * @description Orquestador del Sistema Nervioso Central del ecosistema.
 * Centraliza las capacidades de observabilidad, emisión de señales de estado,
 * trazabilidad forense mediante identificadores de correlación y medición
 * de rendimiento de grado industrial.
 *
 * Protocolo OEDP-V16.0 - Single Source Resolution & Verbatim Module Syntax.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @section ADN Estructural (Schemas & Types)
 * Exportación de contratos inmutables para la validación de señales telemétricas.
 */
export type {
  ITelemetrySignal,
  SeverityLevel
} from './lib/schemas/TelemetrySignal.schema';

export {
  SeverityLevelSchema,
  TelemetrySignalSchema
} from './lib/schemas/TelemetrySignal.schema';

/**
 * @section Almas Lingüísticas (i18n)
 * Expone los esquemas de traducción para la auditoría de diccionarios de logs.
 */
export type { ITelemetryI18n } from './lib/i18n/TelemetryI18n.schema';
export { TelemetryI18nSchema } from './lib/i18n/TelemetryI18n.schema';

/**
 * @section Lógica Atómica (Aparatos de Observabilidad)
 * Funciones puras e independientes para el flujo sanguíneo digital.
 */
export { EmitTelemetrySignal } from './lib/logic/atomic/EmitTelemetrySignal';
export { GenerateCorrelationIdentifier } from './lib/logic/atomic/GenerateCorrelationIdentifier';
export { ReportForensicException } from './lib/logic/atomic/ReportForensicException';
export { TraceExecutionTime } from './lib/logic/atomic/TraceExecutionTime';
