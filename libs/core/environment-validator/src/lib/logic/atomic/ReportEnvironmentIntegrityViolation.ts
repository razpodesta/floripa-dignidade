/**
 * @section Environment Logic - Integrity Violation Reporter
 * @description Átomo encargado de procesar fallos de esquema en el entorno.
 * Realiza el triaje de variables comprometidas, emite señales forenses
 * y dispara el bloqueo de seguridad del sistema.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Forensic Visibility.
 * SANEADO Zenith: Resolución de error de Lint (consistent-type-imports).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import type { ZodError } from 'zod';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import { EmitTelemetrySignal } from '@floripa-dignidade/telemetry';

/** Identificador técnico del sensor de infraestructura. */
const ENVIRONMENT_ADUANA_IDENTIFIER = 'ENVIRONMENT_INFRASTRUCTURE_ADUANA';

/**
 * Procesa un error de validación de entorno y aborta la ejecución.
 *
 * @param zodErrorReference - Instancia del error de esquema capturado.
 * @param correlationIdentifier - ID de trazabilidad del hilo.
 * @throws {InternalSystemException} Bloqueo mandatorio de seguridad.
 */
export const ReportEnvironmentIntegrityViolation = (
  zodErrorReference: ZodError,
  correlationIdentifier: string
): never => {
  /**
   * @section Triaje Forense
   * Extraemos las claves de las variables que fallaron el contrato.
   */
  const validationIssuesMetadata = zodErrorReference.flatten().fieldErrors;
  const compromisedVariablesCollection = Object.keys(validationIssuesMetadata);

  // 1. REPORTE DE SEÑAL CRÍTICA AL NEURAL SENTINEL
  void EmitTelemetrySignal({
    severityLevel: 'CRITICAL',
    moduleIdentifier: ENVIRONMENT_ADUANA_IDENTIFIER,
    operationCode: 'ENVIRONMENT_INTEGRITY_VIOLATION',
    correlationIdentifier,
    /** Clave de diccionario para i18n isomórfico */
    message: 'ENVIRONMENT.LOGS.INTEGRITY_VIOLATION',
    contextMetadata: {
      compromisedVariablesCollection,
      forensicDetailsSnapshot: validationIssuesMetadata,
    },
  });

  // 2. BLOQUEO DE SEGURIDAD (Bypass Prevention)
  throw new InternalSystemException('FALLO_CRITICO_DE_ENTORNO_DETECTADO', {
    compromisedVariablesCollection,
    resolutionHintLiteral: 'Sincronize os segredos no provedor Cloud (Supabase/Vercel) antes do re-build.',
  });
};
