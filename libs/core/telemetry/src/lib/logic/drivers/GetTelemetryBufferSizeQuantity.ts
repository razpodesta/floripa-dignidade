/**
 * @section Telemetry Logic - Buffer Capacity Sensor
 * @description Átomo encargado de informar el volumen de rastro pendiente.
 *
 * Protocolo OEDP-V17.0 - ISO Technical Naming.
 */

import { telemetrySignalBufferCollection } from './internal/TelemetryBufferRegistry';

/**
 * Retorna la cantidad exacta de señales residentes en memoria.
 *
 * @returns {number} Cantidad (Quantity) de elementos.
 */
export const GetTelemetryBufferSizeQuantity = (): number => {
  return telemetrySignalBufferCollection.length;
};
