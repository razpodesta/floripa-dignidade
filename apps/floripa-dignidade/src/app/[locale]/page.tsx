/**
 * @section Localized Frontpage Orchestrator
 * @description Punto de ensamblaje soberano para el embudo de conversión social.
 *
 * Protocolo OEDP-V16.0 - Relentless Atomization & Swarm Intelligence.
 * SANEADO Zenith: Reducción drástica de complejidad (< 80 líneas).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { notFound } from 'next/navigation';

/* 1. Infraestructura Core & Routing */
import { EmitTelemetrySignal, GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';
import { SupportedLocaleSchema, ValidateLinguisticContract } from '@floripa-dignidade/routing';
import { NewsletterSubscriptionFormI18nSchema } from '@floripa-dignidade/shared';

/* 2. Secciones Atómicas (Pulverización SRP) */
import { FrontpageHero } from './sections/FrontpageHero';
import { ValuePropositionGrid } from './sections/ValuePropositionGrid';
import { NewsletterConversionZone } from './sections/NewsletterConversionZone';

/* 3. ADN Estructural */
import type { Metadata } from 'next';
import { FrontpageI18nSchema } from './schemas/FrontpageI18n.schema';

interface IFrontpageProperties {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IFrontpageProperties): Promise<Metadata> {
  const { locale: id } = await params;
  const titles: Record<string, string> = {
    'pt-BR': 'Página Inicial | Floripa Dignidade',
    'es-ES': 'Inicio | Floripa Dignidade',
    'en-US': 'Home | Floripa Dignidade',
  };
  return { title: titles[id] || titles['pt-BR'] };
}

export default async function Frontpage({ params }: IFrontpageProperties) {
  const { locale: rawLocale } = await params;
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. ADUANA DE ADN
  const localeResult = SupportedLocaleSchema.safeParse(rawLocale);
  if (!localeResult.success) notFound();
  const locale = localeResult.data;

  // 2. CARGA DE ALMAS LINGÜÍSTICAS (Silos Isomórficos)
  try {
    const [pageData, sharedData] = await Promise.all([
      import(`./i18n/${locale}.json`),
      import(`../../../../../libs/shared/src/lib/ui-primitives/i18n/${locale}.json`)
    ]);

    ValidateLinguisticContract('FRONTPAGE_CONTENT', FrontpageI18nSchema, pageData.default, locale);
    ValidateLinguisticContract('NEWSLETTER_UI', NewsletterSubscriptionFormI18nSchema, sharedData.default, locale);

    // 3. TELEMETRÍA DE MONTAJE
    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: 'FRONTPAGE_SHELL',
      operationCode: 'FRONTPAGE_ASSEMBLED',
      correlationIdentifier,
      message: `Ensamble nominal de Frontpage finalizado para [${locale}]`
    });

    return (
      <main className="flex flex-col flex-grow overflow-x-hidden">
        <FrontpageHero content={pageData.default.hero} />
        <ValuePropositionGrid features={pageData.default.features} />
        <NewsletterConversionZone
          content={pageData.default.newsletter}
          formDictionary={sharedData.default}
        />
      </main>
    );

  } catch (_error) {
    notFound();
  }
}
