/**
 * @section Newsletter Logic - Cloud Activation Orchestrator
 * @description Orquestador soberano encargado de la transicion de estado
 * del ciudadano (PENDING -> ACTIVE). Implementa el patron Swarm Orchestration
 * delegando en atomos especializados para seguridad, I/O y parseo.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Erradicacion de TS2307, TS2724 y Atomizacion SRP.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { MapHttpErrorToException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural de Salida */
export interface IActivationResult {
  readonly isActivationSuccessfulBoolean: boolean;
  readonly activatedCitizenEmailLiteral?: string;
  readonly metadataSnapshot?: Record<string, unknown>;
}

/* 2. Enjambre Atomico Local (Internal Swarm) */
import { BuildCloudPatchHeaders } from './BuildCloudPatchHeaders';
import { ExecuteCloudActivationRequest } from './ExecuteCloudActivationRequest';
import { ParseSubscriberActivationResult } from './ParseSubscriberActivationResult';

/** Identificador tecnico del aparato para el Neural Sentinel. */
const ACTIVATION_ORCHESTRATOR_IDENTIFIER = 'NEWSLETTER_ACTIVATION_ENGINE';

/**
 * Ejecuta el ciclo integral de activacion de soberania en la nube.
 *
 * @param verificationTokenLiteral - Token secreto capturado de la URL.
 * @returns {Promise<IActivationResult>} Resultado validado y auditado.
 */
export const ActivateCloudSubscription = async (
  verificationTokenLiteral: string,
): Promise<IActivationResult> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE SOBERANÍA DE HARDWARE (Aduana de Entorno)
  const {
    SUPABASE_URL: cloudUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    ACTIVATION_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_CITIZEN_ACTIVATION_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 2. CONSTRUCCIÓN DE SEGURIDAD (Delegación Atómica)
        const securityHeaders = BuildCloudPatchHeaders(cloudSecurityKeySecret);

        // 3. DESPACHO FÍSICO A LA NUBE (Delegación Atómica)
        const networkResponse = await ExecuteCloudActivationRequest(
          cloudUrlLiteral,
          securityHeaders,
          verificationTokenLiteral,
          correlationIdentifier
        );

        if (!networkResponse.ok) {
          throw MapHttpErrorToException(networkResponse.status, 'ACTIVATION_CLOUD_I/O_FAULT');
        }

        const rawJsonPayloadSnapshot = await networkResponse.json();

        // 4. ADUANA DE ADN Y VEREDICTO (Delegación Atómica)
        const activationResult = ParseSubscriberActivationResult(rawJsonPayloadSnapshot);

        // 5. REPORTE DE ESTADO (SRE Visibility)
        void EmitTelemetrySignal({
          severityLevel: activationResult.isActivationSuccessfulBoolean ? 'INFO' : 'WARNING',
          moduleIdentifier: ACTIVATION_ORCHESTRATOR_IDENTIFIER,
          operationCode: activationResult.isActivationSuccessfulBoolean ? 'CONVERSION_SUCCESS' : 'INVALID_TOKEN',
          correlationIdentifier,
          message: 'Proceso de activacion de ciudadania finalizado.',
          contextMetadataSnapshot: { ...activationResult.metadataSnapshot },
        });

        return activationResult;

      } catch (caughtError: unknown) {
        // 6. GESTIÓN FORENSE DE COLAPSO (Resilience Layer)
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: ACTIVATION_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'ACTIVATION_PIPELINE_COLLAPSE',
          correlationIdentifier,
          message: 'Error catastrofico en el orquestador de activacion.',
          contextMetadataSnapshot: { errorTrace: errorDescriptionLiteral },
        });

        throw caughtError;
      }
    },
  );
};
