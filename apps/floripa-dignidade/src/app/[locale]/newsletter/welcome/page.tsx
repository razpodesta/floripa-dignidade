/**
 * @section Localized Welcome Orchestrator - Newsletter Domain
 * @description Punto de ensamblaje para la página de éxito del ciudadano.
 * Orquesta la carga de diccionarios y el renderizado de átomos de conversión.
 *
 * Protocolo OEDP-V16.0 - Relentless Atomization & Swarm Intelligence.
 * SANEADO Zenith: Reducción drástica de densidad visual (< 100 líneas).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Newspaper, ShieldCheck } from 'lucide-react';

/* 1. Infraestructura Core & Routing */
import { EmitTelemetrySignal, GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';
import { SupportedLocaleSchema, ValidateLinguisticContract } from '@floripa-dignidade/routing';

/* 2. Búnker Shared & Átomos Locales */
import { GlobalActionButton } from '@floripa-dignidade/shared';
import { SuccessCheckmark } from './components/SuccessCheckmark';
import { SupportResourceCard } from './components/SupportResourceCard';

/* 3. ADN Estructural */
import type { Metadata } from 'next';
import { NewsletterWelcomeI18nSchema } from './schemas/NewsletterWelcomeI18n.schema';
import type { INewsletterWelcomeI18n } from './schemas/NewsletterWelcomeI18n.schema';

interface IWelcomePageProperties {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IWelcomePageProperties): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    'pt-BR': 'Soberania Confirmada | Floripa Dignidade',
    'es-ES': 'Soberanía Confirmada | Floripa Dignidade',
    'en-US': 'Sovereignty Confirmed | Floripa Dignidade',
  };
  return { title: titles[locale] || titles['pt-BR'], robots: { index: false, follow: true } };
}

export default async function NewsletterWelcomePage({ params }: IWelcomePageProperties) {
  const { locale: rawLocale } = await params;
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. ADUANA DE ADN
  const localeResult = SupportedLocaleSchema.safeParse(rawLocale);
  if (!localeResult.success) notFound();
  const locale = localeResult.data;

  // 2. CARGA DE ALMA LINGÜÍSTICA
  let dictionary: INewsletterWelcomeI18n;
  try {
    const rawData = await import(`./i18n/${locale}.json`);
    ValidateLinguisticContract('WELCOME_PAGE', NewsletterWelcomeI18nSchema, rawData.default, locale);
    dictionary = rawData.default;
  } catch (_error) {
    notFound();
  }

  // 3. TELEMETRÍA DE CONVERSIÓN
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'NEWSLETTER_WELCOME_SHELL',
    operationCode: 'WELCOME_PAGE_RENDERED',
    correlationIdentifier,
    message: `Ciudadano alcanzó zona de bienvenida en [${locale}].`
  });

  return (
    <div className="flex-grow flex flex-col items-center justify-center relative px-4 py-20 lg:py-40 overflow-hidden">
      {/* Visual Identity Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100/20 via-transparent to-transparent -z-10" />

      <div className="max-w-3xl w-full text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <SuccessCheckmark />

        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">
          {dictionary.hero.headlineLiteral}
        </h1>

        <p className="text-xl text-slate-500 mb-14 leading-relaxed font-medium">
          {dictionary.hero.descriptionLiteral}
        </p>

        {/* Grupo de Acciones Principales */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href={`/${locale}/transparencia`} className="w-full sm:w-auto">
            <GlobalActionButton visualIntentConfiguration="STANDARD" className="w-full text-lg px-10 py-5">
              <ShieldCheck className="w-5 h-5" />
              <span>{dictionary.actions.primaryActionLabelLiteral}</span>
            </GlobalActionButton>
          </Link>

          <Link href={`/${locale}`} className="w-full sm:w-auto">
            <GlobalActionButton visualIntentConfiguration="GHOST" className="w-full text-lg px-10 py-5 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{dictionary.actions.secondaryActionLabelLiteral}</span>
            </GlobalActionButton>
          </Link>
        </div>

        {/* Soporte Secundario (Grid Atomizado) */}
        <div className="mt-24 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          <SupportResourceCard
            iconNode={<Newspaper size={24} />}
            titleLiteral={dictionary.supportSection.newsHeadlineLiteral}
            descriptionLiteral={dictionary.supportSection.newsDescriptionLiteral}
            visualVariantLiteral="AMBER"
          />
          <SupportResourceCard
            iconNode={<ShieldCheck size={24} />}
            titleLiteral={dictionary.supportSection.dataHeadlineLiteral}
            descriptionLiteral={dictionary.supportSection.dataDescriptionLiteral}
            visualVariantLiteral="BLUE"
          />
        </div>
      </div>
    </div>
  );
}
