'use client';

/**
 * @section UI Orchestrator - Newsletter Subscription Form
 * @description Punto de ensamblaje para la captación soberana de ciudadanos.
 * SANEADO: Atomización implacable. Lógica delegada al hook especializado.
 *
 * Protocolo OEDP-V16.0 - High Performance & SRP Architecture.
 */

import React from 'react';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';
import { useNewsletterSubscription } from './newsletter-form/hooks/useNewsletterSubscription';
import { SubscriptionSuccessState } from './newsletter-form/components/SubscriptionSuccessState';
import type { INewsletterSubscriptionFormI18n } from './i18n/NewsletterSubscriptionFormI18n.schema';

interface INewsletterSubscriptionFormProperties {
  readonly dictionary: INewsletterSubscriptionFormI18n;
  readonly visualVariantLiteral?: 'STANDARD' | 'MINIMAL';
  readonly externalClassName?: string;
}

export const NewsletterSubscriptionForm: React.FC<INewsletterSubscriptionFormProperties> = ({
  dictionary,
  visualVariantLiteral = 'STANDARD',
  externalClassName,
}) => {
  // --- INYECCIÓN DE LÓGICA ATÓMICA ---
  const {
    formInstance: { register, handleSubmit, formState: { errors, isSubmitting } },
    isSuccessfullySubmittedBoolean,
    executionErrorLiteral,
    onFormSubmitAction
  } = useNewsletterSubscription(dictionary.messages.errorGenericLiteral);

  // --- RENDERIZADO DE ESTADO FINAL ---
  if (isSuccessfullySubmittedBoolean) {
    return (
      <SubscriptionSuccessState
        headlineLiteral={dictionary.messages.successHeadlineLiteral}
        descriptionLiteral={dictionary.messages.successDescriptionLiteral}
      />
    );
  }

  // --- ARQUITECTURA DE ESTILOS ---
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
    >
      <div className="relative group">
        <input
          {...register('electronicMailAddressLiteral')}
          type="email"
          placeholder={dictionary.labels.inputPlaceholderLiteral}
          disabled={isSubmitting}
          className={inputStylesLiteral}
          aria-invalid={!!errors.electronicMailAddressLiteral}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={GlobalStyleClassMerger(
            'absolute right-2 top-2 px-4 bg-navy-900 text-white rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50',
            isMinimalBoolean ? 'h-8' : 'h-10'
          )}
        >
          {isSubmitting ? (
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

      {/* CAPA DE VALIDACIÓN ISO */}
      {errors.electronicMailAddressLiteral && (
        <span className="flex items-center gap-2 ml-2 text-xs font-bold text-red-600 animate-slide-up">
          <AlertCircle size={14} />
          {dictionary.validation.emailInvalidLiteral}
        </span>
      )}

      {/* CAPA DE CONSENTIMIENTO LGPD */}
      <label className="flex items-start gap-3 ml-2 cursor-pointer group">
        <input
          {...register('hasGivenPrivacyConsentBoolean')}
          type="checkbox"
          className="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300"
        />
        <span className={GlobalStyleClassMerger(
          'text-[10px] sm:text-xs leading-tight transition-colors',
          errors.hasGivenPrivacyConsentBoolean ? 'text-red-600 font-bold' : 'text-slate-500'
        )}>
          {dictionary.labels.consentCheckboxLiteral}
        </span>
      </label>

      {/* ERROR DE INFRAESTRUCTURA */}
      {executionErrorLiteral && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle size={14} />
          {executionErrorLiteral}
        </div>
      )}
    </form>
  );
};
