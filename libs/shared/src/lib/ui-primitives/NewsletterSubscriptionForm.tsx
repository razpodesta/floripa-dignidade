'use client';

/**
 * @section Component: NewsletterSubscriptionForm
 * @description Aparato visual de alta fidelidad para la captación de ciudadanos.
 * Implementa validación proactiva, telemetría de interacción y soporte multi-variante.
 *
 * Protocolo OEDP-V15.0 - Atomic Visual Architecture & Cloud Sovereign.
 * Saneamiento: Implementación de variantes visuales y dinamismo lingüístico.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

/* 1. Infraestructura y Utilidades (PascalCase Atoms) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/* 2. ADN del Componente (Verbatim Syntax) */
import { NewsletterSubscriptionFormSchema } from './schemas/NewsletterSubscriptionForm.schema';
import type { INewsletterSubscriptionForm } from './schemas/NewsletterSubscriptionForm.schema';
import type { INewsletterSubscriptionFormI18n } from './i18n/NewsletterSubscriptionFormI18n.schema';

interface INewsletterSubscriptionFormProperties {
  /** Diccionario lingüístico inyectado por el orquestador de la página. */
  readonly dictionary: INewsletterSubscriptionFormI18n;
  /** Variante visual: STANDARD (Secciones) | MINIMAL (Footers/Sidebars). */
  readonly visualVariantLiteral?: 'STANDARD' | 'MINIMAL';
  /** Clase externa para ajustes finos de posicionamiento. */
  readonly externalClassName?: string;
}

export const NewsletterSubscriptionForm: React.FC<INewsletterSubscriptionFormProperties> = ({
  dictionary,
  visualVariantLiteral = 'STANDARD',
  externalClassName,
}) => {
  // --- INFRAESTRUCTURA DE CONTEXTO ---
  const routeParameters = useParams();
  const activeLocaleLiteral = (routeParameters?.['locale'] as string) || 'pt-BR';

  // --- ESTADOS ATÓMICOS ---
  const [isSuccessfullySubmittedBoolean, setIsSuccessfullySubmittedBoolean] = useState(false);
  const [executionErrorLiteral, setExecutionErrorLiteral] = useState<string | null>(null);

  // --- CONFIGURACIÓN DE FORMULARIO ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isAlgorithmExecutingBoolean },
  } = useForm<INewsletterSubscriptionForm>({
    resolver: zodResolver(NewsletterSubscriptionFormSchema),
    defaultValues: { hasGivenPrivacyConsentBoolean: false },
  });

  // --- LÓGICA DE ACCIÓN (Submit) ---
  const onFormSubmitAction = async (formData: INewsletterSubscriptionForm) => {
    const correlationIdentifier = GenerateCorrelationIdentifier();
    setExecutionErrorLiteral(null);

    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'NEWSLETTER_UI_FORM',
      operationCode: 'SUBSCRIPTION_ATTEMPT_STARTED',
      correlationIdentifier,
      message: `Intento de suscripción iniciado desde la UI en idioma: [${activeLocaleLiteral}]`,
    });

    try {
      const outgoingResponse = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communicationIdentifierLiteral: formData.electronicMailAddressLiteral,
          verificationChannelPreference: 'ELECTRONIC_MAIL',
          /** 🛡️ SANEADO: Inyección dinámica de localización detectada en la ruta */
          preferredLinguisticLocaleIdentifier: activeLocaleLiteral,
          hasGivenPrivacyConsentBoolean: formData.hasGivenPrivacyConsentBoolean,
        }),
      });

      if (!outgoingResponse.ok) throw new Error('GATEWAY_COMMUNICATION_ERROR');

      setIsSuccessfullySubmittedBoolean(true);

      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: 'NEWSLETTER_UI_FORM',
        operationCode: 'SUBSCRIPTION_UI_SUCCESS',
        correlationIdentifier,
        message: 'Suscripción aceptada por el gateway.',
      });
    } catch (_caughtError) {
      setExecutionErrorLiteral(dictionary.messages.errorGenericLiteral);

      EmitTelemetrySignal({
        severityLevel: 'ERROR',
        moduleIdentifier: 'NEWSLETTER_UI_FORM',
        operationCode: 'SUBSCRIPTION_UI_FAILURE',
        correlationIdentifier,
        message: 'Fallo en la comunicación asíncrona de suscripción.',
      });
    }
  };

  // --- GESTIÓN DE VARIANTES VISUALES (Style Logic) ---
  const isMinimalBoolean = visualVariantLiteral === 'MINIMAL';

  const containerStylesLiteral = GlobalStyleClassMerger(
    'flex flex-col w-full',
    isMinimalBoolean ? 'gap-2' : 'gap-4',
    externalClassName,
  );

  const inputStylesLiteral = GlobalStyleClassMerger(
    'w-full px-6 rounded-2xl border-2 transition-all duration-300 outline-none font-medium',
    isMinimalBoolean ? 'h-12 text-sm' : 'h-14 text-base',
    errors.electronicMailAddressLiteral
      ? 'border-red-200 bg-red-50 focus:border-red-400'
      : 'border-slate-100 bg-white focus:border-amber-500 focus:shadow-xl focus:shadow-amber-100',
  );

  // --- RENDERIZADO DE ESTADO DE ÉXITO ---
  if (isSuccessfullySubmittedBoolean) {
    return (
      <div className="flex flex-col items-center justify-center p-8 duration-500 bg-green-50 rounded-3xl border border-green-100 animate-in fade-in zoom-in-95">
        <CheckCircle className="mb-4 w-12 h-12 text-green-500" />
        <h3 className="mb-2 text-xl font-bold text-green-900">
          {dictionary.messages.successHeadlineLiteral}
        </h3>
        <p className="text-sm text-center text-green-700">
          {dictionary.messages.successDescriptionLiteral}
        </p>
      </div>
    );
  }

  // --- RENDERIZADO DEL APARATO ---
  return (
    <form onSubmit={handleSubmit(onFormSubmitAction)} className={containerStylesLiteral}>
      <div className="relative group">
        <input
          {...register('electronicMailAddressLiteral')}
          type="email"
          placeholder={dictionary.labels.inputPlaceholderLiteral}
          disabled={isAlgorithmExecutingBoolean}
          className={inputStylesLiteral}
          aria-invalid={errors.electronicMailAddressLiteral ? 'true' : 'false'}
        />
        <button
          type="submit"
          disabled={isAlgorithmExecutingBoolean}
          className={GlobalStyleClassMerger(
            'absolute right-2 top-2 px-4 bg-navy-900 text-white rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50',
            isMinimalBoolean ? 'h-8' : 'h-10',
          )}
        >
          {isAlgorithmExecutingBoolean ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {!isMinimalBoolean && (
                <span className="text-xs font-bold tracking-widest uppercase">
                  {dictionary.labels.submitButtonLiteral}
                </span>
              )}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* CAPA DE VALIDACIÓN (Aduana UI) */}
      {errors.electronicMailAddressLiteral && (
        <span className="flex items-center gap-2 ml-2 text-xs font-bold text-red-600 animate-slide-up">
          <AlertCircle size={14} />
          {dictionary.validation.emailInvalidLiteral}
        </span>
      )}

      {/* CAPA DE CONSENTIMIENTO (Legal Compliance) */}
      <label className="flex items-start gap-3 ml-2 cursor-pointer group">
        <input
          {...register('hasGivenPrivacyConsentBoolean')}
          type="checkbox"
          className="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
        />
        <span
          className={GlobalStyleClassMerger(
            'text-[10px] sm:text-xs leading-tight transition-colors',
            errors.hasGivenPrivacyConsentBoolean
              ? 'text-red-600 font-bold'
              : 'text-slate-500 group-hover:text-slate-700',
          )}
        >
          {dictionary.labels.consentCheckboxLiteral}
        </span>
      </label>

      {/* GESTIÓN DE ERRORES DE RED */}
      {executionErrorLiteral && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle size={14} />
          {executionErrorLiteral}
        </div>
      )}
    </form>
  );
};
