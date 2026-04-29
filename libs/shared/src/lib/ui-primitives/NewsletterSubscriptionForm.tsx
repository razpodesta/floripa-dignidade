'use client';

/**
 * @section UI Orchestrator - Newsletter Subscription Form
 * @description Punto de ensamblaje soberano para la captación de ciudadanos.
 *
 * Protocolo OEDP-V17.0 - High Performance & Complexity Eradication.
 * SANEADO Zenith: Complejidad reducida de 14 a 3. Atomización completada.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/* 1. Enjambre de Átomos Locales */
import { useNewsletterSubscription } from './newsletter-form/hooks/useNewsletterSubscription';
import { SubscriptionSuccessState } from './newsletter-form/components/SubscriptionSuccessState';
import { SubscriptionInputGroup } from './newsletter-form/components/SubscriptionInputGroup';
import { SubscriptionConsentBlock } from './newsletter-form/components/SubscriptionConsentBlock';

/* 2. ADN Estructural */
import type { INewsletterSubscriptionFormI18n } from './i18n/NewsletterSubscriptionFormI18n.schema';

interface INewsletterSubscriptionFormProperties {
  readonly dictionary: INewsletterSubscriptionFormI18n;
  readonly targetApiEndpointPathLiteral?: string;
  readonly visualVariantLiteral?: 'STANDARD' | 'MINIMAL';
  readonly externalClassName?: string;
}

export const NewsletterSubscriptionForm: React.FC<INewsletterSubscriptionFormProperties> = ({
  dictionary,
  targetApiEndpointPathLiteral = '/api/newsletter/subscribe',
  visualVariantLiteral = 'STANDARD',
  externalClassName,
}) => {
  const {
    formInstance: { register, handleSubmit, formState: { errors, isSubmitting } },
    isSuccessfullySubmittedBoolean,
    executionErrorLiteral,
    onFormSubmitAction
  } = useNewsletterSubscription({
    errorGenericLiteral: dictionary.messages.errorGenericLiteral,
    targetApiEndpointPathLiteral
  });

  if (isSuccessfullySubmittedBoolean) {
    return (
      <SubscriptionSuccessState
        headlineLiteral={dictionary.messages.successHeadlineLiteral}
        descriptionLiteral={dictionary.messages.successDescriptionLiteral}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmitAction)}
      className={GlobalStyleClassMerger('flex flex-col w-full gap-5', externalClassName)}
      noValidate
    >
      <SubscriptionInputGroup
        register={register('electronicMailAddressLiteral')}
        isExecutingBoolean={isSubmitting}
        hasErrorBoolean={!!errors.electronicMailAddressLiteral}
        placeholderLiteral={dictionary.labels.inputPlaceholderLiteral}
        buttonLabelLiteral={dictionary.labels.submitButtonLiteral}
        isMinimalVariantBoolean={visualVariantLiteral === 'MINIMAL'}
      />

      <SubscriptionConsentBlock
        register={register('hasGivenPrivacyConsentBoolean')}
        labelLiteral={dictionary.labels.consentCheckboxLiteral}
        validationErrorLiteral={errors.hasGivenPrivacyConsentBoolean?.message}
        hasEmailErrorBoolean={!!errors.electronicMailAddressLiteral}
        emailInvalidLiteral={dictionary.validation.emailInvalidLiteral}
      />

      {executionErrorLiteral && (
        <div className="flex items-center gap-2 p-4 text-xs text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in" role="alert">
          <AlertCircle size={14} />
          {executionErrorLiteral}
        </div>
      )}
    </form>
  );
};
