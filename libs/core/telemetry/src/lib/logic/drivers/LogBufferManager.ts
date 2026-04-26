/**
 * @section Telemetry - Log Buffer Manager
 * @description Gestiona el estado volátil de las señales en memoria.
 * Implementa operaciones atómicas de inserción, limpieza y consulta de capacidad.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity.
 */

import type { ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';

/** @private Estado persistente en el ciclo de vida del módulo */
let TELEMETRY_BUFFER_COLLECTION: ITelemetrySignal[] = [];

/**
 * Agrega una señal al buffer actual.
 */
export const AddSignalToBuffer = (signal: ITelemetrySignal): void => {
  TELEMETRY_BUFFER_COLLECTION.push(signal);
};

/**
 * Retorna un snapshot del buffer y lo vacía de forma atómica.
 */
export const FlushBufferSignals = (): ITelemetrySignal[] => {
  const signalSnapshotCollection = [...TELEMETRY_BUFFER_COLLECTION];
  TELEMETRY_BUFFER_COLLECTION = [];
  return signalSnapshotCollection;
};

/**
 * Informa la cantidad de señales pendientes de envío.
 */
export const GetBufferSizeQuantity = (): number => {
  return TELEMETRY_BUFFER_COLLECTION.length;
};
