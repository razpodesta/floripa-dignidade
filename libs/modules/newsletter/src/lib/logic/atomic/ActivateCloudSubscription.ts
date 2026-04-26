/**
 * @section Newsletter Logic - Cloud Activation Atom
 * @description Valida el desafío de identidad en Supabase y transiciona el estado
 * del ciudadano de 'PENDING_VERIFICATION' a 'ACTIVE'.
 *
 * Protocolo OEDP-V16.0 - Cloud Sovereign & Atomic Conversion.
 * SANEADO Zenith: Erradicación de process.env mediante la Aduana de Entorno (ADR 0016).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/** 🛡️ SANEAMIENTO Zenith: Importación exclusiva de ADN como tipos */
export interface IActivationResult {
  readonly isActivationSuccessfulBoolean: boolean;
  readonly activatedCitizenEmailLiteral?: string;
}

/** Identificador técnico del átomo para el Neural Sentinel. */
const ACTIVATION_ATOM_IDENTIFIER = 'NEWSLETTER_ACTIVATION_ATOM';

/**
 * Ejecuta la transición de estado en la base de datos de Supabase.
 * Filtra por token y estado pendiente para garantizar la idempotencia.
 *
 * @param verificationTokenLiteral - Token secreto de 36 caracteres (UUID).
 * @returns {Promise<IActivationResult>} Resultado inmutable de la activación.
 * @throws {InternalSystemException} Si la conexión con el Tier Cloud falla.
 */
export const ActivateCloudSubscription = async (
  verificationTokenLiteral: string
): Promise<IActivationResult> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  /**
   * 1. CAPTURA SEGURA DE INFRAESTRUCTURA (Aislamiento de Hardware)
   * SANEADO: Invocamos la aduana central para garantizar que los secretos existan
   * y heredar los Branded Types (Tipado Criptográfico).
   */
  const {
    SUPABASE_URL: supabaseUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKeySecret
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    ACTIVATION_ATOM_IDENTIFIER,
    'ACTIVATE_SUBSCRIPTION_IN_CLOUD',
    correlationIdentifier,
    async () => {
      try {
        /**
         * Ejecutamos una actualización filtrada (Security Enforcement).
         * 'Prefer: return=representation' nos permite capturar el email sin una segunda query.
         */
        const outgoingResponse = await fetch(
          `${supabaseUrlLiteral}/rest/v1/newsletter_subscribers?verification_token=eq.${verificationTokenLiteral}&status=eq.PENDING_VERIFICATION`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceRoleKeySecret,
              'Authorization': `Bearer ${supabaseServiceRoleKeySecret}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              status: 'ACTIVE',
              verified_at: new Date().toISOString(),
              activation_correlation_id: correlationIdentifier
            })
          }
        );

        if (!outgoingResponse.ok) {
          throw new Error(`Cloud_Provider_HTTP_Error: ${outgoingResponse.statusText}`);
        }

        const updatedDataCollection = await outgoingResponse.json();

        // 2. VALIDACIÓN DE AFECTACIÓN (Aduana de Resultado)
        const isAfectedRowMissingBoolean = !Array.isArray(updatedDataCollection) || updatedDataCollection.length === 0;

        if (isAfectedRowMissingBoolean) {
          EmitTelemetrySignal({
            severityLevel: 'WARNING',
            moduleIdentifier: ACTIVATION_ATOM_IDENTIFIER,
            operationCode: 'INVALID_ACTIVATION_TOKEN_DETECTED',
            correlationIdentifier,
            message: 'Intento de activación fallido: El token no existe o el ciudadano ya está activo.',
            contextMetadata: { tokenPrefixSnapshot: verificationTokenLiteral.substring(0, 5) }
          });

          return { isActivationSuccessfulBoolean: false };
        }

        const activatedSubscriberSnapshot = updatedDataCollection[0];

        // 3. REPORTE DE ÉXITO OPERACIONAL
        EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: ACTIVATION_ATOM_IDENTIFIER,
          operationCode: 'CITIZEN_CONVERSION_SUCCESS',
          correlationIdentifier,
          message: 'Suscripción consolidada exitosamente en la nube.',
          contextMetadata: {
            subscriberId: activatedSubscriberSnapshot.id,
            locale: activatedSubscriberSnapshot.preferred_locale
          }
        });

        return {
          isActivationSuccessfulBoolean: true,
          activatedCitizenEmailLiteral: activatedSubscriberSnapshot.email_address
        };

      } catch (caughtError) {
        // 4. GESTIÓN DE FALLO DE INFRAESTRUCTURA
        throw new InternalSystemException('FALLO_CRITICO_EN_CONSOLIDACION_NUBE', {
          providerLiteral: 'SUPABASE',
          errorTraceLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError),
          correlationIdentifier
        });
      }
    }
  );
};
