import { z } from 'zod';

/**
 * @section Aduana de ADN - Códigos de Error
 */

/**
 * Esquema Soberano que define los códigos de error estandarizados del ecosistema.
 * Estos códigos permiten una comunicación semántica y unificada entre el servidor,
 * el cliente y el Neural Sentinel para la toma de decisiones de auto-sanación.
 */
export const ErrorCodeSchema = z.enum([
  'VALIDATION_FAILED',
  'UNAUTHORIZED_ACCESS',
  'INTERNAL_SYSTEM_FAILURE',
  'RESOURCE_NOT_FOUND',
  'EXTERNAL_SERVICE_TIMEOUT'
]).describe('Códigos estandarizados de error de Floripa Dignidade');

/**
 * Tipo inferido del esquema de códigos de error para uso en firmas de funciones.
 */
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

/**
 * Esquema de captura de estado en tiempo de ejecución (Runtime Snapshot).
 * Define un diccionario de datos inmutable que representa el contexto exacto
 * de la memoria y las variables en el momento del fallo.
 */
export const RuntimeSnapshotSchema = z.record(z.string(), z.unknown())
  .describe('Captura del estado de la memoria y variables en el momento del fallo para el Neural Sentinel');

/**
 * Interfaz de la instantánea de ejecución para auditoría forense.
 */
export type IRuntimeSnapshot = z.infer<typeof RuntimeSnapshotSchema>;
