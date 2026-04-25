/**
 * @section Newsletter Logic - Cloud Persistence Atom
 * @description Ejecuta la inserción física de una suscripción pendiente en la
 * infraestructura de Supabase utilizando el protocolo PostgREST. Implementa
 * un patrón de ejecución stateless optimizado para el Edge Runtime.
 *
 * Protocolo OEDP-V16.0 - Cloud Sovereign & High Performance Architecture.
 * Saneamiento: Eliminación de acceso directo a 'process' y centralización de secretos.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/**
 * @interface ISavePendingSubscriptionParameters
 * @description Contrato de entrada inmutable para la persistencia de ciudadanos.
 */
interface ISavePendingSubscriptionParameters {
  /** Dirección de correo electrónico del ciudadano solicitante. */
  readonly emailAddressLiteral: string;
  /** Identificador secreto de 36 caracteres para el proceso Double Opt-In. */
  readonly verificationTokenLiteral: string;
  /** Identificador de localización (ej: pt-BR) para segmentación lingüística. */
  readonly localeIdentifier: string;
  /** Identificador único de transacción para el rastro forense digital. */
  readonly correlationIdentifier: string;
}

/**
 * Persiste un registro de ciudadano en estado 'PENDING_VERIFICATION' en la nube.
 * Realiza una auditoría de secretos previa para garantizar la integridad de la red.
 *
 * @param parameters - Objeto con los datos del ciudadano y metadatos de rastreo.
 * @throws {InternalSystemException} Si la conexión con el Tier de Datos colapsa.
 * @returns {Promise<void>} Promesa de finalización de la transacción cloud.
 */
export const SavePendingSubscriptionToSupabase = async (
  parameters: ISavePendingSubscriptionParameters
): Promise<void> => {

  return await TraceExecutionTime(
    'NEWSLETTER_PERSISTENCE_ATOM',
    'SAVE_SUBSCRIPTION_TO_CLOUD_TRANSACTION',
    parameters.correlationIdentifier,
    async () => {
      /**
       * 1. CAPTURA SEGURA DE INFRAESTRUCTURA (Spectacular Isolation)
       * SANEADO: Invocamos a la Aduana de Entorno. Si faltan secretos, ella lanzará
       * la excepción correspondiente, evitando el uso de 'process' en este archivo.
       */
      const {
        DATABASE_URL: _ignoredPostgresUrl, // Documentación visual de disponibilidad
        RESEND_API_KEY: _ignoredResendKey,
        SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKeySecret,
        SUPABASE_URL: supabaseUrlLiteral
      } = ValidateEnvironmentAduana();

      try {
        /**
         * @section Comunicación Física (Cloud Native Layer)
         * Se utiliza fetch nativo para minimizar el bundle y asegurar latencia < 100ms.
         */
        const outgoingResponse = await fetch(`${supabaseUrlLiteral}/rest/v1/newsletter_subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceRoleKeySecret,
            'Authorization': `Bearer ${supabaseServiceRoleKeySecret}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            email_address: parameters.emailAddressLiteral,
            verification_token: parameters.verificationTokenLiteral,
            preferred_locale: parameters.localeIdentifier,
            correlation_id: parameters.correlationIdentifier,
            status: 'PENDING_VERIFICATION',
            created_at: new Date().toISOString()
          })
        });

        if (!outgoingResponse.ok) {
          /** 🛡️ SANEADO: Captura de fallo de protocolo con rastro de estado HTTP */
          throw new Error(`SUPABASE_PROVIDER_ERROR: ${outgoingResponse.status}`);
        }

        // 2. EMISIÓN DE SEÑAL DE ÉXITO (Audit Trail)
        EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: 'NEWSLETTER_PERSISTENCE_ATOM',
          operationCode: 'CLOUD_INSERTION_SUCCESS',
          correlationIdentifier: parameters.correlationIdentifier,
          message: 'TELEMETRY.SIGNALS.END_PROCESS',
          contextMetadata: {
            targetTableLiteral: 'newsletter_subscribers',
            insertionStatusLiteral: 'PENDING'
          }
        });

      } catch (caughtError: unknown) {
        /** 🛡️ SANEADO: Extracción de rastro forense con tipado 'unknown' */
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        throw new InternalSystemException('CLOUD_PERSISTENCE_FAULT', {
          providerLiteral: 'SUPABASE_REST_API',
          errorDescriptionLiteral,
          correlationIdentifier: parameters.correlationIdentifier
        });
      }
    }
  );
};
