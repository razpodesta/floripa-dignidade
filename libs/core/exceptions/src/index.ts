/**
 * @section Core Exceptions - Package Entry Point
 * @description Centro de orquestación para la gestión unificada de anomalías.
 * Expone los contratos de ADN para códigos de error e implementa el motor
 * de excepciones especializado para el ecosistema Floripa Dignidade.
 *
 * Protocolo OEDP-V16.0 - Single Source Resolution & Verbatim Module Syntax.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @section ADN Estructural (Schemas & Types)
 * Exportación de contratos inmutables para la validación de errores.
 */
export type {
  ErrorCode,
  IRuntimeSnapshot
} from './lib/schemas/Exception.schema';

export {
  ErrorCodeSchema,
  RuntimeSnapshotSchema
} from './lib/schemas/Exception.schema';

/**
 * @section Almas Lingüísticas (i18n)
 */
export type { IExceptionsI18n } from './lib/i18n/ExceptionsI18n.schema';
export { ExceptionsI18nSchema } from './lib/i18n/ExceptionsI18n.schema';

/**
 * @section Motores de Excepción (Logic & Classes)
 * Clases base y especializadas para el reporte de fallos.
 */
export { GlobalBaseException } from './lib/codes/GlobalBaseException';
export { InternalSystemException } from './lib/codes/InternalSystemException';
export { ValidationException } from './lib/codes/ValidationException';

/**
 * @section Adaptadores de Protocolo (Mappers)
 */
export { mapHttpErrorToException } from './lib/mappers/mapHttpErrorToException';
