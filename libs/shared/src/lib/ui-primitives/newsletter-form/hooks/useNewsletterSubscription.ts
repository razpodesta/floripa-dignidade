/**
 * @section UI Logic - Newsletter Subscription Hook
 * @description Centraliza la lógica de validación, despacho a API y trazabilidad.
 * Implementa un patrón de inyección de dependencias para el endpoint de destino,
 * garantizando la soberanía de la lógica en cualquier aplicación del enjambre.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Swarm Intelligence.
 * SANEADO Zenith: Inversión de control para endpoints y gestión de promesas flotantes.
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

/* 2. ADN Estructural (Verbatim Module Syntax) */
import { NewsletterSubscriptionFormSchema } from '../../schemas/NewsletterSubscriptionForm.schema';
import type { INewsletterSubscriptionForm } from '../../schemas/NewsletterSubscriptionForm.schema';

/**
 * @interface IUseNewsletterSubscriptionParameters
 * @description Contrato de entrada para la parametrización de la lógica de captación.
 */
interface IUseNewsletterSubscriptionParameters {
  /** Mensaje de error localizado inyectado por el diccionario de la UI. */
  readonly errorGenericLiteral: string;
  /** Ruta física de la API que procesará la suscripción (Inyección de dependencia). */
  readonly targetApiEndpointPathLiteral: string;
}

/**
 * @interface IUseNewsletterSubscriptionResult
 * @description Contrato de salida para el consumo del orquestador visual.
 */
interface IUseNewsletterSubscriptionResult {
  /** Instancia del formulario con el estado de validación activo. */
  readonly formInstance: ReturnType<typeof useForm<INewsletterSubscriptionForm>>;
  /** Estado de finalización exitosa de la operación. */
  readonly isSuccessfullySubmittedBoolean: boolean;
  /** Representación textual del error capturado. */
  readonly executionErrorLiteral: string | null;
  /** Acción asíncrona de envío físico. */
  readonly onFormSubmitAction: (formData: INewsletterSubscriptionForm) => Promise<void>;
}

/**
 * Hook de lógica atómica para la gestión de suscripciones institucionales.
 *
 * @param parameters - Configuración inyectada de error y destino.
 * @returns {IUseNewsletterSubscriptionResult} Capacidades para el ensamblaje visual.
 */
export const useNewsletterSubscription = (
  parameters: IUseNewsletterSubscriptionParameters
): IUseNewsletterSubscriptionResult => {
  const routeParameters = useParams();

  /** 🛡️ SANEADO: Inferencia del identificador de localización desde la ruta */
  const activeLocaleIdentifierLiteral = (routeParameters?.['locale'] as string) || 'pt-BR';

  const [isSuccessfullySubmittedBoolean, setIsSuccessfullySubmittedBoolean] = useState(false);
  const [executionErrorLiteral, setExecutionErrorLiteral] = useState<string | null>(null);

  const formInstance = useForm<INewsletterSubscriptionForm>({
    resolver: zodResolver(NewsletterSubscriptionFormSchema),
    defaultValues: {
      electronicMailAddressLiteral: '',
      hasGivenPrivacyConsentBoolean: false
    },
  });

  /**
   * Ejecuta la transacción de suscripción contra el gateway solicitado.
   *
   * @param formData - Datos purificados por la aduana Zod del formulario.
   */
  const onFormSubmitAction = async (formData: INewsletterSubscriptionForm): Promise<void> => {
    const correlationIdentifier = GenerateCorrelationIdentifier();
    setExecutionErrorLiteral(null);

    // 1. REPORTE DE INTENCIÓN (SRE Visibility)
    // SANEADO: Marcado con 'void' para cumplir con la regla 'no-floating-promises'.
    void EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'NEWSLETTER_UI_HOOK',
      operationCode: 'SUBSCRIPTION_ATTEMPT_STARTED',
      correlationIdentifier,
      message: `Intento de suscripción capturado en idioma: [${activeLocaleIdentifierLiteral}]`,
      contextMetadata: {
        targetEndpointLiteral: parameters.targetApiEndpointPathLiteral
      }
    });

    try {
      // 2. DESPACHO FÍSICO (Cloud Native Strategy)
      const outgoingResponse = await fetch(parameters.targetApiEndpointPathLiteral, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communicationIdentifierLiteral: formData.electronicMailAddressLiteral,
          verificationChannelPreference: 'ELECTRONIC_MAIL',
          preferredLinguisticLocaleIdentifier: activeLocaleIdentifierLiteral,
          hasGivenPrivacyConsentBoolean: formData.hasGivenPrivacyConsentBoolean,
        }),
      });

      if (!outgoingResponse.ok) {
        throw new Error(`GATEWAY_FAULT_SIGNAL_${outgoingResponse.status}`);
      }

      // 3. CONSOLIDACIÓN DE ÉXITO
      setIsSuccessfullySubmittedBoolean(true);

      void EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: 'NEWSLETTER_UI_HOOK',
        operationCode: 'SUBSCRIPTION_REQUEST_ACCEPTED',
        correlationIdentifier,
        message: 'La solicitud de suscripción ha sido autorizada y procesada.',
      });

    } catch (caughtError: unknown) {
      // 4. GESTIÓN DE FALLO DE INFRAESTRUCTURA (Resilience Layer)
      setExecutionErrorLiteral(parameters.errorGenericLiteral);

      const errorDescriptionLiteral = caughtError instanceof Error
        ? caughtError.message
        : String(caughtError);

      void EmitTelemetrySignal({
        severityLevel: 'ERROR',
        moduleIdentifier: 'NEWSLETTER_UI_HOOK',
        operationCode: 'SUBSCRIPTION_REQUEST_FAILED',
        correlationIdentifier,
        message: 'Fallo crítico en la comunicación con el gateway de suscripción.',
        contextMetadata: {
          errorTraceLiteral: errorDescriptionLiteral,
          targetEndpointLiteral: parameters.targetApiEndpointPathLiteral
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
