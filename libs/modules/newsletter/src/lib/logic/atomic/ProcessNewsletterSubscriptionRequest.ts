/**
 * @section Newsletter Logic - Subscription Request Orchestrator
 * @description Orquestador superior que coordina la validación, persistencia en Supabase
 * y el despacho del desafío de identidad (Double Opt-In).
 *
 * Protocolo OEDP-V15.0 - Swarm Intelligence & Cloud Native.
 * Saneamiento: Resolución de TS2591 y optimización de captura de secretos.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { ValidationException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';
import { SendTransactionalEmail } from '@floripa-dignidade/resend-provider';

/** 🛡️ SANEAMIENTO Zenith: Importación de ADN como tipos */
import type { INewsletterSubscriptionRequest } from '../../schemas/NewsletterSubscriptionRequest.schema';
import { NewsletterSubscriptionRequestSchema } from '../../schemas/NewsletterSubscriptionRequest.schema';
import { GenerateDoubleOptInEmailHtml } from './GenerateDoubleOptInEmailHtml';
import { SavePendingSubscriptionToSupabase } from './SavePendingSubscriptionToSupabase';
import { LoadNewsletterLinguisticDictionary } from './LoadNewsletterLinguisticDictionary';

/** Identificador soberano del módulo para el Neural Sentinel. */
const NEWSLETTER_ENGINE_IDENTIFIER = 'NEWSLETTER_SUBSCRIPTION_ENGINE';

/**
 * Procesa una solicitud de suscripción integralmente.
 * Valida el ADN del ciudadano, persiste el estado en la nube y orquesta la comunicación.
 *
 * @param rawSubscriptionData - Datos crudos provenientes del formulario de entrada.
 * @returns {Promise<string>} Identificador forense (Correlation ID) de la transacción.
 * @throws {ValidationException} Si los datos no cumplen el contrato soberano.
 */
export const ProcessNewsletterSubscriptionRequest = async (
  rawSubscriptionData: unknown
): Promise<string> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE SECRETOS DE INFRAESTRUCTURA
  const {
    RESEND_API_KEY: resendApiKeyLiteral,
    RESEND_FROM_EMAIL: resendFromEmailLiteral
  } = process.env;

  return await TraceExecutionTime(
    NEWSLETTER_ENGINE_IDENTIFIER,
    'PROCESS_SUBSCRIPTION_SEQUENCE',
    correlationIdentifier,
    async () => {
      // 2. ADUANA DE ADN: Validación de integridad de entrada
      const validationResult = NewsletterSubscriptionRequestSchema.safeParse(rawSubscriptionData);

      if (!validationResult.success) {
        throw new ValidationException('ADN_SUSCRIPCION_CORRUPTO', {
          validationIssues: validationResult.error.flatten(),
        });
      }

      const request: INewsletterSubscriptionRequest = validationResult.data;
      const securityVerificationTokenLiteral = crypto.randomUUID();

      // 3. PERSISTENCIA EN LA NUBE (Supabase Tier 0)
      // Registramos al ciudadano en estado 'PENDING' antes de cualquier envío.
      await SavePendingSubscriptionToSupabase({
        emailAddressLiteral: request.communicationIdentifierLiteral,
        verificationTokenLiteral: securityVerificationTokenLiteral,
        localeIdentifier: request.preferredLinguisticLocaleIdentifier,
        correlationIdentifier,
      });

      // 4. CARGA DE ALMA LINGÜÍSTICA
      const dictionary = await LoadNewsletterLinguisticDictionary(
        request.preferredLinguisticLocaleIdentifier
      );

      // 5. DESPACHO DE COMUNICACIÓN (Estrategia Multi-Canal)
      if (request.verificationChannelPreference === 'ELECTRONIC_MAIL') {
        const emailHtmlContentLiteral = GenerateDoubleOptInEmailHtml(
          dictionary,
          securityVerificationTokenLiteral,
          correlationIdentifier
        );

        await SendTransactionalEmail(
          {
            securityApiKeySecret: resendApiKeyLiteral ?? '',
            defaultFromAddressLiteral: resendFromEmailLiteral ?? 'no-reply@floripadignidade.org',
          },
          {
            targetRecipientAddressLiteral: request.communicationIdentifierLiteral,
            emailSubjectLiteral: dictionary.email.confirmationSubjectLiteral,
            emailHtmlContentLiteral: emailHtmlContentLiteral,
            trackingCategoryIdentifier: 'NEWSLETTER_VERIFICATION',
          }
        );
      }

      // 6. REPORTE DE ÉXITO OPERACIONAL
      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: NEWSLETTER_ENGINE_IDENTIFIER,
        operationCode: 'SUBSCRIPTION_SEQUENCE_COMPLETED',
        correlationIdentifier,
        message: `Ciclo de vida iniciado: Ciudadano registrado vía [${request.verificationChannelPreference}]`,
        contextMetadata: {
          channel: request.verificationChannelPreference,
          locale: request.preferredLinguisticLocaleIdentifier,
        },
      });

      return correlationIdentifier;
    }
  );
};
