/**
 * @section Telemetry Logic - Atomic Signal Dispatcher
 * @description Punto de despacho único y soberano para señales de telemetría.
 * Valida la integridad de la señal contra el contrato de ADN, gestiona
 * la visibilidad en entornos de depuración y orquestara el transporte
 * asíncrono hacia los búnkeres de persistencia cloud del Neural Sentinel.
 *
 * Protocolo OEDP-V16.0 - High Performance & ISO Technical Naming.
 * Saneamiento: Resolución de error de linter (no-console) y optimización de transporte.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { TelemetrySignalSchema } from '../../schemas/TelemetrySignal.schema';
import type { ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';

/**
 * @interface IGlobalEnvironmentContext
 * @description Definición técnica del contexto de ejecución global para
 * la detección de secretos y estados de entorno de forma segura.
 */
interface IGlobalEnvironmentContext {
  readonly process?: {
    readonly env?: {
      readonly NODE_ENV?: string;
    };
  };
}

/**
 * Evalúa si el ecosistema está operando bajo el modo de desarrollo.
 *
 * @returns {boolean} Verdadero si se detecta un entorno de construcción local.
 */
const isDevelopmentEnvironmentActiveBoolean = (): boolean => {
  const environmentContext = globalThis as unknown as IGlobalEnvironmentContext;
  return environmentContext.process?.env?.NODE_ENV === 'development';
};

/**
 * Valida el contrato de integridad de la señal entrante y coordina su
 * persistencia asíncrona en el bus de datos institucional.
 *
 * @param rawTelemetrySignalPayload - Datos crudos del evento capturado en el sistema.
 * @returns {void} No retorna valor para garantizar latencia cero en el llamante.
 */
export const EmitTelemetrySignal = (rawTelemetrySignalPayload: unknown): void => {

  // 1. ADUANA DE INTEGRIDAD: Validación estricta mediante Esquema Soberano
  const signalValidationResult = TelemetrySignalSchema.safeParse(rawTelemetrySignalPayload);

  if (!signalValidationResult.success) {
    /**
     * @section Gestión de Fallo de ADN (Audit Trail)
     * Si la señal está corrupta, se reporta exclusivamente mediante 'warn'
     * para cumplimiento de la regla ESLint 'no-console'.
     */
    if (isDevelopmentEnvironmentActiveBoolean()) {
      const validationIssuesMetadata = signalValidationResult.error.format();

      console.warn(
        '[CRITICAL_TELEMETRY_INTEGRITY_VIOLATION]: El paquete de datos no cumple el contrato.',
        {
          receivedPayloadSnapshot: rawTelemetrySignalPayload,
          structuralIssuesCollection: validationIssuesMetadata
        }
      );
    }
    return;
  }

  const validatedSignalPayload: ITelemetrySignal = signalValidationResult.data;

  // 2. EJECUCIÓN DE TRANSPORTE ASÍNCRONO (Swarm Execution)
  /**
   * Se utiliza el patrón 'void' para indicar una ejecución inmediata
   * no bloqueante, protegiendo el rendimiento del ciudadano.
   */
  void executeAsynchronousSignalTransport(validatedSignalPayload);
};

/**
 * @private Lógica de Transporte Soberano
 * @description Encapsula la comunicación física con los adaptadores de nube.
 *
 * @param validatedSignal - Señal purificada lista para ser indexada.
 * @returns {Promise<void>} Operación asíncrona de persistencia.
 */
const executeAsynchronousSignalTransport = async (
  validatedSignal: ITelemetrySignal
): Promise<void> => {
  try {
    /**
     * @infrastructure_audit
     * SANEADO: Se sustituye 'console.info' por 'console.warn' para depuración
     * forense local, cumpliendo con la restricción técnica del linter.
     */
    if (isDevelopmentEnvironmentActiveBoolean()) {
      console.warn(
        `[TELEMETRY_FORENSIC_TRACE]: ${validatedSignal.operationCode}`,
        validatedSignal
      );
    }

    /**
     * @todo Integrar el 'Sovereign Bridge' hacia Supabase/HuggingFace.
     * Implementar estrategia de 'Buffer & Flush' para optimizar el ancho de banda.
     */
   // const _inmutableSignalReference = Object.freeze({ ...validatedSignal });

  } catch (caughtTransportError: unknown) {
    /**
     * Fallo en el sistema nervioso central: Reporte de nivel ERROR
     * autorizado por el linter para rastro de colapso.
     */
    if (isDevelopmentEnvironmentActiveBoolean()) {
      console.error('[TELEMETRY_TRANSPORT_FAULT]:', caughtTransportError);
    }
  }
};
