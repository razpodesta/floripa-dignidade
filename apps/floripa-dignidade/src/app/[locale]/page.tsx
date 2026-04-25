/**
 * @section Localized Frontpage Apparatus
 * @description Punto de entrada principal para el embudo de conversión social.
 * Orquesta la carga de contenidos y el renderizado de secciones de impacto.
 *
 * Protocolo OEDP-V16.0 - High Performance Architecture & Type Safety.
 * Saneamiento: Resolución de 'TS2532' mediante iteración segura y mapeo visual.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { Heart, Mail, Newspaper, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

/* 1. Infraestructura Core (PascalCase Atoms) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

import {
  SupportedLocaleSchema,
  ValidateLinguisticContract,
} from '@floripa-dignidade/routing';

/* 2. Búnker Shared (Componentes y ADN) */
import {
  GlobalActionButton,
  NewsletterSubscriptionForm,
  NewsletterSubscriptionFormI18nSchema,
} from '@floripa-dignidade/shared';

/* 3. ADN y Átomos Locales (Verbatim Module Syntax) */
import type { Metadata } from 'next';
import type { INewsletterSubscriptionFormI18n } from '@floripa-dignidade/shared';
import { FeatureActionCard } from './components/FeatureActionCard';
import { FrontpageI18nSchema } from './schemas/FrontpageI18n.schema';
import type { IFrontpageI18n } from './schemas/FrontpageI18n.schema';

interface IFrontpageProperties {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Generación de metadatos SEO dinámicos con soberanía lingüística.
 */
export async function generateMetadata({ params }: IFrontpageProperties): Promise<Metadata> {
  const { locale: localeIdentifier } = await params;
  const titlesMapping: Record<string, string> = {
    'pt-BR': 'Página Inicial | Floripa Dignidade',
    'es-ES': 'Inicio | Floripa Dignidade',
    'en-US': 'Home | Floripa Dignidade',
  };

  return {
    title: titlesMapping[localeIdentifier] || titlesMapping['pt-BR'],
    alternates: { canonical: `/${localeIdentifier}` },
  };
}

/**
 * Orquestador principal de la Frontpage.
 */
export default async function Frontpage({ params }: IFrontpageProperties) {
  const { locale: rawLocaleIdentifier } = await params;
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. ADUANA DE ADN: Validación de prefijo de idioma
  const localeValidationResult = SupportedLocaleSchema.safeParse(rawLocaleIdentifier);
  if (!localeValidationResult.success) notFound();

  const validatedLocaleIdentifier = localeValidationResult.data;

  // 2. CARGA DE CONTENIDOS (Silos Compuestos con Tipado Estricto)
  let pageDictionaryPayload: IFrontpageI18n;
  let newsletterFormDictionaryPayload: INewsletterSubscriptionFormI18n;

  try {
    // Importación de contenido específico de la página
    const rawPageData = await import(`./i18n/${validatedLocaleIdentifier}.json`);
    ValidateLinguisticContract(
      'FRONTPAGE_CONTENT',
      FrontpageI18nSchema,
      rawPageData.default,
      validatedLocaleIdentifier,
    );
    pageDictionaryPayload = rawPageData.default;

    // Importación de diccionario compartido para el formulario de newsletter
    const rawSharedNewsletterData = await import(
      `../../../../../libs/shared/src/lib/ui-primitives/i18n/${validatedLocaleIdentifier}.json`
    );

    /** 🛡️ SANEADO: Validación con esquema compartido sin uso de 'any' */
    ValidateLinguisticContract(
      'NEWSLETTER_FORM_UI',
      NewsletterSubscriptionFormI18nSchema,
      rawSharedNewsletterData.default,
      validatedLocaleIdentifier,
    );
    newsletterFormDictionaryPayload = rawSharedNewsletterData.default;
  } catch (_caughtError) {
    notFound();
  }

  // 3. TELEMETRÍA DE RENDERIZADO (Forensic Audit)
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'FRONTPAGE_APPARATUS',
    operationCode: 'FRONTPAGE_RENDERED',
    correlationIdentifier,
    message: `Acceso nominal a Frontpage en [${validatedLocaleIdentifier}]`,
  });

  /**
   * 4. MAPEO VISUAL DE PROPUESTA DE VALOR
   * Asocia los identificadores del JSON con sus iconos y variantes cromáticas,
   * eliminando la vulnerabilidad de acceso por índice estricto (TS2532).
   */
  const featureVisualConfigurationMapping: Record<string, { iconNode: React.ReactNode; visualVariantLiteral: 'RED' | 'BLUE' | 'AMBER' }> = {
    'TRANSPARENCY': { iconNode: <ShieldCheck size={32} />, visualVariantLiteral: 'RED' },
    'ALERTS': { iconNode: <Newspaper size={32} />, visualVariantLiteral: 'BLUE' },
    'ACTION': { iconNode: <Heart size={32} />, visualVariantLiteral: 'AMBER' },
  };

  return (
    <div className="flex flex-col flex-grow overflow-x-hidden">
      {/* --- SECCIÓN 1: HERO (Conversión Primaria) --- */}
      <section className="container relative flex flex-col items-center px-4 py-24 mx-auto text-center lg:py-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent -z-10" />

        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-amber-100 text-amber-700 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-sm">
          <ShieldCheck size={14} className="animate-pulse" />
          <span>{pageDictionaryPayload.hero.badgeLabelLiteral}</span>
        </div>

        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8 max-w-5xl tracking-tighter">
          {pageDictionaryPayload.hero.headlineMainLiteral}{' '}
          <span className="italic text-amber-500">
            {pageDictionaryPayload.hero.headlineAccentLiteral}
          </span>
          .
        </h1>

        <p className="max-w-2xl mb-14 text-xl font-medium leading-relaxed text-slate-600">
          {pageDictionaryPayload.hero.descriptionLiteral}
        </p>

        <div className="flex flex-col justify-center w-full px-4 sm:flex-row gap-5 sm:w-auto">
          <GlobalActionButton
            visualIntentConfiguration="CONVERSION"
            className="px-12 py-5 text-xl shadow-2xl shadow-amber-200"
          >
            <Heart className="w-5 h-5 fill-current" />
            <span>{pageDictionaryPayload.hero.primaryActionLabelLiteral}</span>
          </GlobalActionButton>

          <GlobalActionButton visualIntentConfiguration="OUTLINE" className="px-12 py-5 text-xl bg-white">
            <Newspaper className="w-5 h-5" />
            <span>{pageDictionaryPayload.hero.secondaryActionLabelLiteral}</span>
          </GlobalActionButton>
        </div>
      </section>

      {/* --- SECCIÓN 2: FEATURES (Propuesta de Valor) --- */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {pageDictionaryPayload.features.map((featureItem) => {
              // Extraemos la configuración visual o aplicamos un fallback resiliente
              const visualConfiguration = featureVisualConfigurationMapping[featureItem.identifier] || {
                iconNode: <ShieldCheck size={32} />,
                visualVariantLiteral: 'BLUE'
              };

              return (
                <FeatureActionCard
                  key={featureItem.identifier}
                  iconNode={visualConfiguration.iconNode}
                  titleLiteral={featureItem.titleLiteral}
                  descriptionLiteral={featureItem.descriptionLiteral}
                  visualVariantLiteral={visualConfiguration.visualVariantLiteral}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: NEWSLETTER (Conversión de Red) --- */}
      <section className="relative py-20 overflow-hidden bg-navy-900 lg:py-32">
        <div className="absolute top-0 right-0 w-1/3 h-full translate-x-20 skew-x-12 bg-amber-500/10" />

        <div className="container relative z-10 grid items-center grid-cols-1 px-4 mx-auto gap-16 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 text-xs font-bold tracking-widest uppercase text-amber-500">
              <Mail size={16} />
              <span>Transparência em tempo real</span>
            </div>
            <h2 className="mb-6 text-4xl font-black leading-tight text-white lg:text-6xl">
              {pageDictionaryPayload.newsletter.sectionHeadlineLiteral}
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-slate-400 lg:text-xl">
              {pageDictionaryPayload.newsletter.sectionDescriptionLiteral}
            </p>
          </div>

          <div className="bg-white/5 p-2 rounded-[2.5rem] backdrop-blur-sm border border-white/10">
            <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-2xl">
              <NewsletterSubscriptionForm
                dictionary={newsletterFormDictionaryPayload}
                visualVariantLiteral="STANDARD"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
