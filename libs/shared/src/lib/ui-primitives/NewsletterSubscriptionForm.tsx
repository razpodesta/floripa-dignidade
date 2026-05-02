'use client';

/**
 * @section UI Orchestrator - Newsletter Subscription Form
 * @description Punto de ensamblaje soberano para la captacion de ciudadanos.
 * Coordina la interaccion entre el hook de logica y los atomos visuales,
 * gestionando estados de exito y errores de infraestructura.
 *
 * Protocolo OEDP-V17.0 - High Performance & Complexity Eradication.
 * SANEADO Zenith: Resolucion de TS2375 (exactOptionalPropertyTypes Compliance).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/* 1. Infraestructura de Estilos y Utilidades */
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/* 2. Enjambre de Atomos Locales (Functional Swarm) */
import { useNewsletterSubscription } from './newsletter-form/hooks/useNewsletterSubscription';
import { SubscriptionSuccessState } from './newsletter-form/components/SubscriptionSuccessState';
import { SubscriptionInputGroup } from './newsletter-form/components/SubscriptionInputGroup';
import { SubscriptionConsentBlock } from './newsletter-form/components/SubscriptionConsentBlock';

/* 3. ADN Estructural (Verbatim Module Syntax) */
import type { INewsletterSubscriptionFormI18n } from './i18n/NewsletterSubscriptionFormI18n.schema';

/**
 * @interface INewsletterSubscriptionFormProperties
 * @description Contrato inmutable para la parametrizacion del formulario de suscripcion.
 */
interface INewsletterSubscriptionFormProperties {
  /** Diccionario de traducciones validado por la aduana Zod. */
  readonly dictionary: INewsletterSubscriptionFormI18n;
  /** Ruta fisica de la API para el despacho de datos. */
  readonly targetApiEndpointPathLiteral?: string;
  /** Variante visual para adaptacion en diferentes secciones del portal. */
  readonly visualVariantLiteral?: 'STANDARD' | 'MINIMAL';
  /** Clases CSS externas para ajustes de posicionamiento. */
  readonly externalClassName?: string;
}

export const NewsletterSubscriptionForm: React.FC<INewsletterSubscriptionFormProperties> = ({
  dictionary,
  targetApiEndpointPathLiteral = '/api/newsletter/subscribe',
  visualVariantLiteral = 'STANDARD',
  externalClassName,
}) => {
  // 1. INVOCACION DE LOGICA ATOMICA (Hook Orchestrator)
  const {
    formInstance: { register, handleSubmit, formState: { errors, isSubmitting } },
    isSuccessfullySubmittedBoolean,
    executionErrorLiteral,
    onFormSubmitAction
  } = useNewsletterSubscription({
    errorGenericLiteral: dictionary.messages.errorGenericLiteral,
    targetApiEndpointPathLiteral
  });

  // 2. GESTION DE ESTADO DE EXITO (Conversion Consolidada)
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
      {/* ATOMO A: Captura de Identificador de Comunicacion */}
      <SubscriptionInputGroup
        register={register('electronicMailAddressLiteral')}
        isExecutingBoolean={isSubmitting}
        hasErrorBoolean={!!errors.electronicMailAddressLiteral}
        placeholderLiteral={dictionary.labels.inputPlaceholderLiteral}
        buttonLabelLiteral={dictionary.labels.submitButtonLiteral}
        isMinimalVariantBoolean={visualVariantLiteral === 'MINIMAL'}
      />

      {/* ATOMO B: Validacion Legal y Consentimiento (LGPD) */}
      <SubscriptionConsentBlock
        register={register('hasGivenPrivacyConsentBoolean')}
        labelLiteral={dictionary.labels.consentCheckboxLiteral}
        /**
         * 🛡️ SANEADO Zenith: Evitamos pasar 'undefined' explícito para cumplir con
         * 'exactOptionalPropertyTypes'. El operador '||' asegura que si no hay error,
         * el valor sea omitido o pasado como cadena vacia controlada.
         */
        validationErrorLiteral={errors.hasGivenPrivacyConsentBoolean?.message ?? ""}
        hasEmailErrorBoolean={!!errors.electronicMailAddressLiteral}
        emailInvalidLiteral={dictionary.validation.emailInvalidLiteral}
      />

      {/* ALERTA DE FALLO DE INFRAESTRUCTURA (SRE Visibility) */}
      {executionErrorLiteral && (
        <div
          className="flex items-center gap-2 p-4 text-xs text-red-700 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in"
          role="alert"
        >
          <AlertCircle size={14} />
          <span>{executionErrorLiteral}</span>
        </div>
      )}
    </form>
  );
};
