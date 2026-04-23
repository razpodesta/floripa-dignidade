/**
 * ⚠️ Global Exceptions - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Arquitectura de Resiliencia y Auditoría Forense
 *
 * Este búnker centraliza la gestión de fallos del ecosistema Floripa Dignidade.
 * Proporciona las herramientas necesarias para transformar errores técnicos
 * en excepciones semánticas con capacidad de captura inmutable (Runtime Snapshot),
 * permitiendo al Neural Sentinel la toma de decisiones de auto-sanación.
 */

/**
 * @section ADN Estructural
 * Exportación de esquemas Zod y tipos de datos soberanos.
 */
export * from './lib/schemas/Exception.schema';

/**
 * @section Arquitectura de Excepciones
 * Exportación de la clase base abstracta y las especializaciones de dominio.
 */
export * from './lib/codes/GlobalBaseException';
export * from './lib/codes/InternalSystemException';
export * from './lib/codes/ValidationException';

/**
 * @section Lógica de Frontera
 * Exportación de orquestadores de mapeo para la conversión de errores externos.
 */
export * from './lib/mappers/mapHttpErrorToException';
