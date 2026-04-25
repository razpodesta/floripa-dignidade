/**
 * @section Application Bootstrap - Instrumentation Shell
 * @description Orquestador de arranque del servidor para Next.js 15.
 * Ejecuta las auditorías críticas de infraestructura antes de permitir el
 * procesamiento de tráfico ciudadano. Actúa como el primer sensor del enjambre.
 *
 * Protocolo OEDP-V16.0 - Build Resilience & Pre-flight Integrity.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';

/**
 * Función de registro soberana invocada por Next.js al inicializar el servidor.
 * Garantiza que la aplicación no entre en estado operativo si el ADN del entorno
 * está corrupto o incompleto.
 *
 * @returns {Promise<void>} Promesa que resuelve si el arranque es nominal.
 */
export async function register(): Promise<void> {
  /**
   * @section Validación de Contexto de Ejecución
   * Solo activamos los sensores en entornos de servidor (Node.js o Edge Runtime)
   * para evitar inyectar lógica de infraestructura en el bundle del cliente.
   */
  const currentRuntimeIdentifierLiteral = process.env['NEXT_RUNTIME'];
  const isServerRuntimeBoolean =
    currentRuntimeIdentifierLiteral === 'nodejs' ||
    currentRuntimeIdentifierLiteral === 'edge';

  if (!isServerRuntimeBoolean) {
    return;
  }

  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. REPORTE DE INICIO DE SECUENCIA
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'APPLICATION_BOOTSTRAP',
    operationCode: 'BOOTSTRAP_SEQUENCE_STARTED',
    correlationIdentifier,
    message: 'Iniciando secuencia de instrumentación Zenith en el servidor.'
  });

  /**
   * 2. ACTIVACIÓN DE LA ADUANA DE ENTORNO
   * Si 'ValidateEnvironmentAduana' detecta fallos, lanzará una 'InternalSystemException'
   * que abortará el proceso de arranque, proporcionando un rastro forense limpio
   * en los logs de construcción de Vercel.
   */
  ValidateEnvironmentAduana();

  // 3. REPORTE DE ESTADO NOMINAL
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'APPLICATION_BOOTSTRAP',
    operationCode: 'BOOTSTRAP_SEQUENCE_NOMINAL',
    correlationIdentifier,
    message: 'Aduanas de infraestructura superadas con éxito. El portal está operativo.'
  });
}
