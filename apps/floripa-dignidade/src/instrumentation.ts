/**
 * @section Application Bootstrap - Instrumentation Orchestrator
 * @description Sensor de frontera encargado de la secuencia de arranque del servidor.
 * Ejecuta la auditoría de integridad de infraestructura (Aduana de Entorno)
 * antes de habilitar el procesamiento de tráfico ciudadano en Next.js.
 *
 * Protocolo OEDP-V16.0 - Build Resilience & Infrastructure Sovereignty.
 * Vision: Fail-Fast & Forensic Traceability at Startup.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';

/**
 * Función soberana de registro invocada por el motor de Next.js al inicializar el nodo.
 * Implementa un bloqueo preventivo: si el ADN del entorno es inválido, el proceso
 * de arranque colapsa con rastro forense, protegiendo la integridad del sistema.
 *
 * @returns {Promise<void>} Promesa que se resuelve únicamente si la infraestructura es nominal.
 */
export async function register(): Promise<void> {
  /**
   * @section Validación de Ámbito de Ejecución
   * SANEADO Zenith: Identificamos el entorno para evitar fugas de lógica de servidor
   * en el bundle del cliente (Edge Runtime o Node.js solamente).
   */
  const executionRuntimeIdentifierLiteral = process.env['NEXT_RUNTIME'];

  const isServerEnvironmentBoolean =
    executionRuntimeIdentifierLiteral === 'nodejs' ||
    executionRuntimeIdentifierLiteral === 'edge';

  if (!isServerEnvironmentBoolean) {
    return;
  }

  /**
   * Generamos una correlación única para la sesión de arranque (Bootstrap session).
   */
  const bootstrapCorrelationIdentifier = GenerateCorrelationIdentifier();

  // 1. REPORTE DE INICIO DE SECUENCIA (SRE Visibility)
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'APPLICATION_BOOTSTRAP',
    operationCode: 'BOOTSTRAP_SEQUENCE_STARTED',
    correlationIdentifier: bootstrapCorrelationIdentifier,
    message: 'Iniciando secuencia de instrumentación Zenith: Auditoría de cimientos en curso.'
  });

  try {
    /**
     * 2. ACTIVACIÓN DE LA ADUANA DE ENTORNO (Integrity Guardian)
     * Realiza el escaneo de secretos (Supabase, Resend, S3, WhatsApp).
     * SANEADO: Si hay fallos, 'ValidateEnvironmentAduana' lanza una
     * 'InternalSystemException' que aborta el arranque de Vercel inmediatamente.
     */
    ValidateEnvironmentAduana();

    // 3. REPORTE DE ESTADO NOMINAL
    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'APPLICATION_BOOTSTRAP',
      operationCode: 'BOOTSTRAP_SEQUENCE_NOMINAL',
      correlationIdentifier: bootstrapCorrelationIdentifier,
      message: 'Aduanas de infraestructura superadas con éxito. El enjambre está listo para operar.'
    });

  } catch (caughtBootstrapError: unknown) {
    /**
     * @section Gestión de Colapso de Arranque
     * Capturamos la excepción para el rastro forense antes de que el servidor muera.
     */
    const errorDescriptionLiteral = caughtBootstrapError instanceof Error
      ? caughtBootstrapError.message
      : String(caughtBootstrapError);

    EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: 'APPLICATION_BOOTSTRAP',
      operationCode: 'BOOTSTRAP_CRITICAL_COLLAPSE',
      correlationIdentifier: bootstrapCorrelationIdentifier,
      message: `El arranque del sistema ha sido bloqueado por seguridad: ${errorDescriptionLiteral}`,
      contextMetadata: {
        runtimeIdentifier: executionRuntimeIdentifierLiteral,
      }
    });

    /**
     * Propagamos el error para asegurar que Vercel marque el despliegue
     * como fallido en lugar de permitir un portal inconsistente.
     */
    throw caughtBootstrapError;
  }
}
