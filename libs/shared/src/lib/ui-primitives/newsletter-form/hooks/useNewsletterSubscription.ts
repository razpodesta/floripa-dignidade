/**
 * @section UI Logic - Newsletter Subscription Hook
 * @description Centraliza la lógica de validación, despacho a API y trazabilidad.
 * Implementa el patrón de desacoplamiento para permitir la reutilización de la
 * inteligencia de captación en diversos componentes de la interfaz.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Path Integrity.
 * SANEADO Zenith: Resolución de error TS2307 (Path Depth Correction).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';

/* 1. Infraestructura de Telemetría (Standard PascalCase) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 2. ADN Estructural (Salto de 2 niveles para llegar a ui-primitives/schemas) */
import { NewsletterSubscriptionFormSchema } from '../../schemas/NewsletterSubscriptionForm.schema';
import type { INewsletterSubscriptionForm } from '../../schemas/NewsletterSubscriptionForm.schema';

/**
 * @interface IUseNewsletterSubscriptionResult
 * @description Contrato de salida para el consumo de lógica de suscripción.
 */
interface IUseNewsletterSubscriptionResult {
  /** Instancia del formulario con el estado de validación activo. */
  readonly formInstance: ReturnType<typeof useForm<INewsletterSubscriptionForm>>;
  /** Estado de finalización exitosa del ciclo de vida. */
  readonly isSuccessfullySubmittedBoolean: boolean;
  /** Representación textual del error capturado en el flujo. */
  readonly executionErrorLiteral: string | null;
  /** Acción asíncrona de envío purificado. */
  readonly onFormSubmitAction: (formData: INewsletterSubscriptionForm) => Promise<void>;
}

/**
 * Hook soberano para la gestión de suscripciones al boletín.
 *
 * @param errorGenericLiteral - Mensaje de error localizado inyectado por el diccionario.
 * @returns {IUseNewsletterSubscriptionResult} Herramientas para el orquestador visual.
 */
export const useNewsletterSubscription = (
  errorGenericLiteral: string
): IUseNewsletterSubscriptionResult => {
  const routeParameters = useParams();

  /** 🛡️ SANEADO: Inferencia segura del locale desde los parámetros de ruta */
  const activeLocaleLiteral = (routeParameters?.['locale'] as string) || 'pt-BR';

  const [isSuccessfullySubmittedBoolean, setIsSuccessfullySubmittedBoolean] = useState(false);
  const [executionErrorLiteral, setExecutionErrorLiteral] = useState<string | null>(null);

  const formInstance = useForm<INewsletterSubscriptionForm>({
    resolver: zodResolver(NewsletterSubscriptionFormSchema),
    defaultValues: {
      electronicMailAddressLiteral: '',
      hasGivenPrivacyConsentBoolean: false
    },
  });

  const onFormSubmitAction = async (formData: INewsletterSubscriptionForm) => {
    const correlationIdentifier = GenerateCorrelationIdentifier();
    setExecutionErrorLiteral(null);

    // 1. REPORTE DE INTENCIÓN (Telemetry Start)
    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'NEWSLETTER_UI_HOOK',
      operationCode: 'SUBSCRIPTION_ATTEMPT_STARTED',
      correlationIdentifier,
      message: `Intento de suscripción capturado en idioma: [${activeLocaleLiteral}]`,
    });

    try {
      // 2. DESPACHO HACIA EL GATEWAY EDGE (ADR 0015)
      const outgoingResponse = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communicationIdentifierLiteral: formData.electronicMailAddressLiteral,
          verificationChannelPreference: 'ELECTRONIC_MAIL',
          preferredLinguisticLocaleIdentifier: activeLocaleLiteral,
          hasGivenPrivacyConsentBoolean: formData.hasGivenPrivacyConsentBoolean,
        }),
      });

      if (!outgoingResponse.ok) {
        throw new Error('GATEWAY_FAULT_SIGNAL');
      }

      // 3. CONSOLIDACIÓN DE ÉXITO
      setIsSuccessfullySubmittedBoolean(true);

      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: 'NEWSLETTER_UI_HOOK',
        operationCode: 'SUBSCRIPTION_REQUEST_ACCEPTED',
        correlationIdentifier,
        message: 'La solicitud de suscripción ha sido procesada por el enjambre de backend.',
      });

    } catch (_caughtError: unknown) {
      // 4. GESTIÓN DE FALLO DE INFRAESTRUCTURA
      setExecutionErrorLiteral(errorGenericLiteral);

      EmitTelemetrySignal({
        severityLevel: 'ERROR',
        moduleIdentifier: 'NEWSLETTER_UI_HOOK',
        operationCode: 'SUBSCRIPTION_REQUEST_FAILED',
        correlationIdentifier,
        message: 'Fallo crítico en la comunicación con el gateway de suscripción.',
        contextMetadata: {
          detectedLocale: activeLocaleLiteral
        }
      });
    }
  };

  return {
    formInstance,
    isSuccessfullySubmittedBoolean,
    executionErrorLiteral,
    onFormSubmitAction,
  };
};
