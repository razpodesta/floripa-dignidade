/**
 * @section Core Exceptions - Package Entry Point
 * @description Orquestador soberano para la gestión unificada de anomalías y contratos
 * de error del ecosistema. Proporciona la infraestructura necesaria para la
 * captura forense de fallos y el mapeo semántico de estados técnicos.
 *
 * Protocolo OEDP-V16.0 - Verbatim Module Syntax & High Performance Treeshaking.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @section ADN Estructural (Schemas & Types)
 * @description Exportación de interfaces inmutables y contratos de validación.
 * Se utiliza 'export type' para garantizar que estos elementos desaparezcan
 * completamente durante la transpilación a JavaScript.
 */
export type {
  ErrorCode,
  IRuntimeSnapshot,
} from './lib/schemas/Exception.schema';

export {
  ErrorCodeSchema,
  RuntimeSnapshotSchema,
} from './lib/schemas/Exception.schema';

/**
 * @section Almas Lingüísticas (Internationalization)
 * @description Definiciones para la traducción técnica de códigos de error.
 */
export type { IExceptionsI18n } from './lib/i18n/ExceptionsI18n.schema';
export { ExceptionsI18nSchema } from './lib/i18n/ExceptionsI18n.schema';

/**
 * @section Motores de Excepción (Logic & Classes)
 * @description Clases fundamentales para el sistema de excepciones.
 * Implementan captura de snapshot inmutable y rastro de pila (stack trace).
 */
export { GlobalBaseException } from './lib/codes/GlobalBaseException';
export { InternalSystemException } from './lib/codes/InternalSystemException';
export { ValidationException } from './lib/codes/ValidationException';

/**
 * @section Adaptadores de Protocolo (Mapping)
 * @description Utilidades para transformar errores crudos (HTTP/Fetch) en
 * excepciones semánticas tipadas.
 */
export { mapHttpErrorToException } from './lib/mappers/mapHttpErrorToException';
