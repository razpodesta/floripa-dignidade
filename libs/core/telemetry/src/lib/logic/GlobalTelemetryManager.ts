import { GlobalBaseException } from '@floripa-dignidade/exceptions';
import { ITelemetrySignal, TelemetrySignalSchema } from '../schemas/TelemetrySignal.schema.js';

/**
 * Contrato interno para la lectura segura del entorno de ejecución.
 * Aplicando el prefijo 'I' requerido por la convención OEDP.
 */
interface IIsomorphicProcess {
  env: {
    NODE_ENV?: string;
  };
}

/**
 * Verifica si el sistema se encuentra en modo desarrollo para habilitar alertas locales.
 * Mantenido como función de utilidad interna atómica (No exportada).
 *
 * @returns {boolean} Verdadero si estamos en entorno de desarrollo.
 */
const isDevelopmentMode = (): boolean => {
  const isomorphicProcess = (globalThis as unknown as { process?: IIsomorphicProcess }).process;
  return isomorphicProcess?.env?.NODE_ENV === 'development';
};

/**
 * Emite una señal de telemetría purificada por la aduana Zod.
 * Actúa como la única puerta de salida para eventos del sistema.
 *
 * @param {unknown} signal - El payload del evento sin tipar que será validado.
 */
export const emitTelemetrySignal = (signal: unknown): void => {
  const validation = TelemetrySignalSchema.safeParse(signal);

  if (!validation.success) {
    if (isDevelopmentMode()) {
      console.warn('TELEMETRY_ADN_CORRUPTO:', validation.error.format());
    }
    return;
  }

  const validatedSignal: ITelemetrySignal = validation.data;
  // TODO: Implementar Dispatcher asíncrono (Web Worker o sendBeacon)
  void validatedSignal;
};

/**
 * MÉTODO DE SOBERANÍA: Reporta una excepción estructurada al sistema.
 * Vincula el búnker de Exceptions con el bus de Telemetry garantizando trazabilidad.
 *
 * @param {GlobalBaseException} exception - Instancia de error tipada del ecosistema.
 * @param {string} correlationIdentifier - UUID para trazar la cascada de errores.
 */
export const reportException = (
  exception: GlobalBaseException,
  correlationIdentifier: string
): void => {
  emitTelemetrySignal({
    severityLevel: exception.statusCode >= 500 ? 'CRITICAL' : 'ERROR',
    moduleIdentifier: 'CORE_EXCEPTION_HANDLER',
    operationCode: exception.errorCode,
    correlationIdentifier,
    message: exception.message,
    contextMetadata: {
      ...exception.contextMetadata,
      httpStatusCode: exception.statusCode,
      exceptionName: exception.name
    }
  });
};

/**
 * Genera un identificador forense único para la correlación de eventos (Traceability).
 *
 * @returns {string} Un UUID v4 estándar.
 */
export const generateCorrelationIdentifier = (): string => {
  return crypto.randomUUID();
};
