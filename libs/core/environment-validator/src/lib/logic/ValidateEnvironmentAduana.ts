/**
 * @section Environment Logic - Infrastructure Integrity Guardian
 * @description Aparato de lógica atómica encargado de auditar el estado del
 * entorno de ejecución (Variables de Entorno). Implementa un patrón de bloqueo
 * preventivo (Fail-Fast) que impide que la aplicación inicie si se detecta
 * una violación en el contrato de secretos institucionales.
 *
 * Protocolo OEDP-V16.0 - High Performance & Cloud Sovereign.
 * Saneamiento: Resolución de TS2591 mediante acceso global seguro.
 *
 * @author Engineering Department - Floripa Dignidade
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

import { InternalSystemException } from '@floripa-dignidade/exceptions';
import { EnvironmentSchema } from '../schemas/Environment.schema';

/** 🛡️ SANEAMIENTO Zenith: Importación exclusiva de ADN mediante Verbatim Syntax */
import type { IEnvironmentVariables } from '../schemas/Environment.schema';

/** Identificador técnico del sensor de infraestructura para el Neural Sentinel. */
const ENVIRONMENT_INTEGRITY_GUARDIAN_IDENTIFIER = 'ENVIRONMENT_INFRASTRUCTURE_GUARDIAN';

/**
 * Realiza una inspección profunda de las variables de entorno inyectadas.
 * Valida la existencia y el formato técnico (ISO) de secretos y URLs
 * utilizando el motor de esquemas soberanos.
 *
 * @returns {IEnvironmentVariables} Objeto de entorno purificado y estrictamente tipado.
 * @throws {InternalSystemException} Si el contrato de integridad es violado.
 */
export const ValidateEnvironmentAduana = (): IEnvironmentVariables => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  /**
   * 1. CAPTURA DE ADN DE HARDWARE (Global Scope Bridge)
   * SANEADO: Uso de globalThis para resolver el símbolo 'process' y sanar TS2591.
   */
  const globalContextReference = globalThis as unknown as { process?: { env: Record<string, string | undefined> } };
  const rawEnvironmentPayloadCollection = globalContextReference.process?.env ?? {};

  // 2. AUDITORÍA DE INTEGRIDAD (Safe Parsing)
  const validationResult = EnvironmentSchema.safeParse(rawEnvironmentPayloadCollection);

  if (!validationResult.success) {
    /**
     * @section Gestión de Colapso de Infraestructura
     * Extraemos el rastro de las variables comprometidas para el reporte forense.
     */
    const validationIssuesMetadata = validationResult.error.flatten().fieldErrors;
    const compromisedVariablesCollection = Object.keys(validationIssuesMetadata);

    // REPORTE DE SEÑAL CRÍTICA
    EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: ENVIRONMENT_INTEGRITY_GUARDIAN_IDENTIFIER,
      operationCode: 'ENVIRONMENT_INTEGRITY_VIOLATION',
      correlationIdentifier,
      /** 🛡️ SANEADO: Clave de diccionario internacionalizada */
      message: 'ENVIRONMENT.LOGS.INTEGRITY_VIOLATION',
      contextMetadata: {
        compromisedVariablesCollection,
        forensicDetails: validationIssuesMetadata,
      },
    });

    // BLOQUEO DE SEGURIDAD (Prevención de ejecución inconsistente)
    throw new InternalSystemException('FALLO_CRITICO_DE_ENTORNO_DETECTADO', {
      compromisedVariablesCollection,
      resolutionHintLiteral: 'Sincronice los secretos en el proveedor Cloud (Vercel/Supabase).',
    });
  }

  // 3. CONFIRMACIÓN DE ESTADO NOMINAL (SRE Visibility)
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: ENVIRONMENT_INTEGRITY_GUARDIAN_IDENTIFIER,
    operationCode: 'ENVIRONMENT_VERIFIED_SUCCESSFULLY',
    correlationIdentifier,
    message: 'ENVIRONMENT.LOGS.VERIFICATION_SUCCESS',
  });

  /**
   * Retornamos el contrato purificado y tipado con Branded Types.
   */
  return validationResult.data;
};
