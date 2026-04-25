/**
 * @section Localized Welcome Apparatus - Newsletter Domain
 * @description Orquestador de renderizado para la página de éxito tras la confirmación
 * soberana del ciudadano. Gestiona la carga de diccionarios, telemetría de conversión
 * y ofrece puntos de fuga hacia el valor institucional.
 *
 * Protocolo OEDP-V16.0 - High Performance Architecture & Type Safety.
 * Vision: Hyper-Holistic UX & Social Conversion.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/** 🛡️ SANEADO: Orden alfabético estricto (A-Z) para cumplimiento de 'sort-imports' */
import {
  ArrowLeft,
  CheckCircle2,
  Newspaper,
  ShieldCheck
} from 'lucide-react';

/* 1. Infraestructura Core (PascalCase Atoms) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

import {
  SupportedLocaleSchema,
  ValidateLinguisticContract,
} from '@floripa-dignidade/routing';

/* 2. Búnker Shared (Componentes Globales) */
import { GlobalActionButton } from '@floripa-dignidade/shared';

/* 3. ADN Local (Verbatim Module Syntax) */
import type { Metadata } from 'next';
import { NewsletterWelcomeI18nSchema } from './schemas/NewsletterWelcomeI18n.schema';
import type { INewsletterWelcomeI18n } from './schemas/NewsletterWelcomeI18n.schema';

/**
 * @interface IWelcomePageProperties
 * @description Contrato de propiedades inyectadas por el App Router de Next.js.
 */
interface IWelcomePageProperties {
  /** Parámetros de ruta dinámicos capturados en el segmento. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Generador de metadatos SEO dinámicos con soberanía lingüística.
 *
 * @param routeParameters - Parámetros de la ruta activa.
 * @returns {Promise<Metadata>} Objeto de metadatos para el motor de búsqueda.
 */
export async function generateMetadata({
  params: routeParametersPromise
}: IWelcomePageProperties): Promise<Metadata> {
  const { locale: localeIdentifier } = await routeParametersPromise;

  /**
   * @localizedTitleMapping
   * SANEADO: Uso de nomenclatura descriptiva sin abreviaturas.
   */
  const localizedTitleMapping: Record<string, string> = {
    'pt-BR': 'Soberania Confirmada | Floripa Dignidade',
    'es-ES': 'Soberanía Confirmada | Floripa Dignidade',
    'en-US': 'Sovereignty Confirmed | Floripa Dignidade',
  };

  return {
    title: localizedTitleMapping[localeIdentifier] || localizedTitleMapping['pt-BR'],
    description: 'Confirmação de participação na rede de transparência e direitos humanos.',
    robots: { index: false, follow: true }
  };
}

/**
 * Componente principal de la página de bienvenida.
 * Implementa carga dinámica de diccionarios y auditoría forense.
 */
export default async function NewsletterWelcomePage({
  params: routeParametersPromise
}: IWelcomePageProperties) {
  const { locale: rawLocaleIdentifier } = await routeParametersPromise;
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. ADUANA DE ADN: Validación de prefijo de idioma (Security Barrier)
  const localeValidationResult = SupportedLocaleSchema.safeParse(rawLocaleIdentifier);
  if (!localeValidationResult.success) {
    notFound();
  }

  const validatedLocaleIdentifier = localeValidationResult.data;

  // 2. CARGA DE ALMA LINGÜÍSTICA (Silo Isolation)
  let dictionaryPayload: INewsletterWelcomeI18n;
  try {
    const rawDictionaryData = await import(`./i18n/${validatedLocaleIdentifier}.json`);

    /** 🛡️ SANEADO: Validación de contrato sin uso de 'any' */
    ValidateLinguisticContract(
      'NEWSLETTER_WELCOME_PAGE',
      NewsletterWelcomeI18nSchema,
      rawDictionaryData.default,
      validatedLocaleIdentifier
    );

    dictionaryPayload = rawDictionaryData.default;
  } catch (_caughtError) {
    // Fallback de seguridad ante fallo en el sistema de archivos
    notFound();
  }

  // 3. TELEMETRÍA DE ÉXITO (Forensic Audit)
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'NEWSLETTER_WELCOME_APPARATUS',
    operationCode: 'WELCOME_PAGE_RENDERED',
    correlationIdentifier,
    message: `Ciudadano alcanzó la página de bienvenida en el idioma [${validatedLocaleIdentifier}].`
  });

  return (
    <div className="flex-grow flex flex-col items-center justify-center relative px-4 py-20 lg:py-40 overflow-hidden">
      {/* Geometría Abstracta de Fondo (Visual Identity) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100/20 via-transparent to-transparent -z-10" />

      <div className="max-w-3xl w-full text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">

        {/* ICONOGRAFÍA DE ÉXITO */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-500 mb-10 shadow-inner">
          <CheckCircle2 size={48} className="animate-pulse" />
        </div>

        {/* CONTENIDO HERO (Conversión Positiva) */}
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">
          {dictionaryPayload.hero.headlineLiteral}
        </h1>

        <p className="text-xl text-slate-500 mb-14 leading-relaxed font-medium">
          {dictionaryPayload.hero.descriptionLiteral}
        </p>

        {/* ACCIONES DE RE-INYECCIÓN (Call to Value) */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href={`/${validatedLocaleIdentifier}/transparencia`} className="w-full sm:w-auto">
            <GlobalActionButton visualIntentConfiguration="STANDARD" className="w-full text-lg px-10 py-5">
              <ShieldCheck className="w-5 h-5" />
              <span>{dictionaryPayload.actions.primaryActionLabelLiteral}</span>
            </GlobalActionButton>
          </Link>

          <Link href={`/${validatedLocaleIdentifier}`} className="w-full sm:w-auto">
            <GlobalActionButton visualIntentConfiguration="GHOST" className="w-full text-lg px-10 py-5 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{dictionaryPayload.actions.secondaryActionLabelLiteral}</span>
            </GlobalActionButton>
          </Link>
        </div>

        {/* SECCIÓN DE APOYO SECUNDARIA (SANEADO: Internacionalización Total) */}
        <div className="mt-24 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
           <article className="flex gap-4 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 transition-transform group-hover:scale-110">
                <Newspaper size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  {dictionaryPayload.supportSection.newsHeadlineLiteral}
                </h4>
                <p className="text-xs text-slate-500">
                  {dictionaryPayload.supportSection.newsDescriptionLiteral}
                </p>
              </div>
           </article>

           <article className="flex gap-4 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 transition-transform group-hover:scale-110">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  {dictionaryPayload.supportSection.dataHeadlineLiteral}
                </h4>
                <p className="text-xs text-slate-500">
                  {dictionaryPayload.supportSection.dataDescriptionLiteral}
                </p>
              </div>
           </article>
        </div>
      </div>
    </div>
  );
}
