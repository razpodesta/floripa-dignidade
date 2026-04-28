'use client';

/**
 * @section UI Orchestrator - Newsletter Subscription Form
 * @description Punto de ensamblaje soberano para la captación de ciudadanos.
 * Implementa un patrón de inyección de dependencias para las rutas de API,
 * permitiendo su reutilización total en cualquier aplicación del monorepo.
 *
 * Protocolo OEDP-V16.0 - High Performance, SRP & Zero Abbreviations.
 * SANEADO Zenith: Desacoplamiento de endpoint y refuerzo de accesibilidad ISO.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/* 1. Lógica Atómica y Componentes de Estado */
import { useNewsletterSubscription } from './newsletter-form/hooks/useNewsletterSubscription';
import { SubscriptionSuccessState } from './newsletter-form/components/SubscriptionSuccessState';

/* 2. ADN Estructural (Verbatim Module Syntax) */
import type { INewsletterSubscriptionFormI18n } from './i18n/NewsletterSubscriptionFormI18n.schema';

/**
 * @interface INewsletterSubscriptionFormProperties
 * @description Contrato de propiedades para el formulario de captación.
 */
interface INewsletterSubscriptionFormProperties {
  /** Diccionario de traducciones inyectado desde el orquestador de página. */
  readonly dictionary: INewsletterSubscriptionFormI18n;

  /**
   * Ruta física de la API que procesará la suscripción.
   * SANEADO: Permite desacoplar el componente de la estructura de rutas de la app.
   * @default '/api/newsletter/subscribe'
   */
  readonly targetApiEndpointPathLiteral?: string;

  /** Variante visual para diferentes contextos de layout. */
  readonly visualVariantLiteral?: 'STANDARD' | 'MINIMAL';

  /** Clase CSS externa para ajustes finos de posicionamiento. */
  readonly externalClassName?: string;
}

export const NewsletterSubscriptionForm: React.FC<INewsletterSubscriptionFormProperties> = ({
  dictionary,
  targetApiEndpointPathLiteral = '/api/newsletter/subscribe',
  visualVariantLiteral = 'STANDARD',
  externalClassName,
}) => {
  /**
   * @section Inyección de Lógica Atómica
   * Delegamos la gestión de estado, validación y red al Hook especializado.
   */
  const {
    formInstance: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting: isAlgorithmExecutingBoolean }
    },
    isSuccessfullySubmittedBoolean,
    executionErrorLiteral,
    onFormSubmitAction
  } = useNewsletterSubscription({
    errorGenericLiteral: dictionary.messages.errorGenericLiteral,
    targetApiEndpointPathLiteral
  });

  // --- RENDERIZADO DE ESTADO DE ÉXITO (Conversión Completada) ---
  if (isSuccessfullySubmittedBoolean) {
    return (
      <SubscriptionSuccessState
        headlineLiteral={dictionary.messages.successHeadlineLiteral}
        descriptionLiteral={dictionary.messages.successDescriptionLiteral}
      />
    );
  }

  // --- ARQUITECTURA DE ESTILOS Y VARIANTES ---
  const isMinimalBoolean = visualVariantLiteral === 'MINIMAL';

  const inputStylesLiteral = GlobalStyleClassMerger(
    'w-full px-6 rounded-2xl border-2 transition-all duration-300 outline-none font-medium',
    isMinimalBoolean ? 'h-12 text-sm' : 'h-14 text-base',
    errors.electronicMailAddressLiteral
      ? 'border-red-200 bg-red-50 focus:border-red-400'
      : 'border-slate-100 bg-white focus:border-amber-500 focus:shadow-xl'
  );

  return (
    <form
      onSubmit={handleSubmit(onFormSubmitAction)}
      className={GlobalStyleClassMerger('flex flex-col w-full gap-4', externalClassName)}
      noValidate
    >
      <div className="relative group">
        <input
          {...register('electronicMailAddressLiteral')}
          type="email"
          placeholder={dictionary.labels.inputPlaceholderLiteral}
          disabled={isAlgorithmExecutingBoolean}
          className={inputStylesLiteral}
          aria-invalid={errors.electronicMailAddressLiteral ? 'true' : 'false'}
          aria-describedby={errors.electronicMailAddressLiteral ? 'email-error-message' : undefined}
        />

        <button
          type="submit"
          disabled={isAlgorithmExecutingBoolean}
          className={GlobalStyleClassMerger(
            'absolute right-2 top-2 px-4 bg-navy-900 text-white rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50',
            isMinimalBoolean ? 'h-8' : 'h-10'
          )}
          aria-label={dictionary.labels.submitButtonLiteral}
        >
          {isAlgorithmExecutingBoolean ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {!isMinimalBoolean && (
                <span className="text-xs font-black tracking-widest uppercase">
                  {dictionary.labels.submitButtonLiteral}
                </span>
              )}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* CAPA DE VALIDACIÓN ISO (Accesibilidad Visual) */}
      {errors.electronicMailAddressLiteral && (
        <span
          id="email-error-message"
          className="flex items-center gap-2 ml-2 text-xs font-bold text-red-600 animate-slide-up"
          role="alert"
        >
          <AlertCircle size={14} />
          {dictionary.validation.emailInvalidLiteral}
        </span>
      )}

      {/* CAPA DE CONSENTIMIENTO LGPD (Legal Compliance) */}
      <label className="flex items-start gap-3 ml-2 cursor-pointer group">
        <input
          {...register('hasGivenPrivacyConsentBoolean')}
          type="checkbox"
          className="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
        />
        <span className={GlobalStyleClassMerger(
          'text-[10px] sm:text-xs leading-tight transition-colors select-none',
          errors.hasGivenPrivacyConsentBoolean
            ? 'text-red-600 font-bold'
            : 'text-slate-500 group-hover:text-slate-700'
        )}>
          {dictionary.labels.consentCheckboxLiteral}
        </span>
      </label>

      {/* GESTIÓN DE ERRORES DE INFRAESTRUCTURA (SRE Feedback) */}
      {executionErrorLiteral && (
        <div
          className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-100 animate-in fade-in"
          role="alert"
        >
          <AlertCircle size={14} />
          {executionErrorLiteral}
        </div>
      )}
    </form>
  );
};
