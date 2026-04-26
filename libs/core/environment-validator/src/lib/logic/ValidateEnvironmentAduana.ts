/**
 * @section Environment Logic - Infrastructure Integrity Guardian
 * @description Orquestador de validación proactiva (Fail-Fast). Garantiza que el
 * ADN de la infraestructura sea íntegro antes de permitir el arranque del sistema.
 *
 * Protocolo OEDP-V16.0 - High Performance & ISO Technical Naming.
 * SANEADO Zenith: Atomización completada. Delegación de captura a 'GatherEnvironmentMetadata'.
 *
 * @author Engineering Department - Floripa Dignidade
 */

import { InternalSystemException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

import { EnvironmentSchema } from '../schemas/Environment.schema';
import { GatherEnvironmentMetadata } from './GatherEnvironmentMetadata';

/** 🛡️ SANEAMIENTO Zenith: Importación exclusiva de ADN mediante Verbatim Syntax */
import type { IEnvironmentVariables } from '../schemas/Environment.schema';

/** Identificador técnico del sensor de infraestructura para el Neural Sentinel. */
const ENVIRONMENT_ADUANA_IDENTIFIER = 'ENVIRONMENT_INFRASTRUCTURE_ADUANA';

/**
 * Realiza una auditoría profunda del contrato de secretos institucionales.
 *
 * @returns {IEnvironmentVariables} Objeto de entorno purificado y tipado nominalmente.
 * @throws {InternalSystemException} Si se detecta corrupción en el contrato de secretos.
 */
export const ValidateEnvironmentAduana = (): IEnvironmentVariables => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. RECOLECCIÓN DE METADATOS (Hardware Isolation)
  const rawEnvironmentPayloadCollection = GatherEnvironmentMetadata();

  // 2. AUDITORÍA DE INTEGRIDAD (ADN Safe Parsing)
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
      moduleIdentifier: ENVIRONMENT_ADUANA_IDENTIFIER,
      operationCode: 'ENVIRONMENT_INTEGRITY_VIOLATION',
      correlationIdentifier,
      message: 'ENVIRONMENT.LOGS.INTEGRITY_VIOLATION',
      contextMetadata: {
        compromisedVariablesCollection,
        forensicDetails: validationIssuesMetadata,
      },
    });

    // BLOQUEO DE SEGURIDAD (Bypass Prevention)
    throw new InternalSystemException('FALLO_CRITICO_DE_ENTORNO_DETECTADO', {
      compromisedVariablesCollection,
      resolutionHintLiteral: 'Sincronice los secretos en el proveedor Cloud antes del re-build.',
    });
  }

  // 3. CONFIRMACIÓN DE ESTADO NOMINAL (SRE Visibility)
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: ENVIRONMENT_ADUANA_IDENTIFIER,
    operationCode: 'ENVIRONMENT_VERIFIED_SUCCESSFULLY',
    correlationIdentifier,
    message: 'ENVIRONMENT.LOGS.VERIFICATION_SUCCESS',
  });

  /**
   * Retorno de contrato purificado con Branded Types.
   */
  return validationResult.data;
};
