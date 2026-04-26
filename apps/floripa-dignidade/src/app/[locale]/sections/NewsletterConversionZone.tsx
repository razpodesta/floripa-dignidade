/**
 * @section Frontpage Section - Newsletter Conversion
 * @description Zona de captación con alto contraste visual.
 * Integra el formulario de suscripción soberano.
 */

import React from 'react';
import { Mail } from 'lucide-react';
import { NewsletterSubscriptionForm } from '@floripa-dignidade/shared';
import type { INewsletterSubscriptionFormI18n } from '@floripa-dignidade/shared';
import type { IFrontpageI18n } from '../schemas/FrontpageI18n.schema';

interface INewsletterZoneProperties {
  readonly content: IFrontpageI18n['newsletter'];
  readonly formDictionary: INewsletterSubscriptionFormI18n;
}

export const NewsletterConversionZone: React.FC<INewsletterZoneProperties> = ({
  content,
  formDictionary
}) => {
  return (
    <section className="relative py-20 overflow-hidden bg-navy-900 lg:py-32">
      {/* Elemento de Diseño Oblicuo */}
      <div className="absolute top-0 right-0 w-1/3 h-full translate-x-20 skew-x-12 bg-amber-500/10" />

      <div className="container relative z-10 grid items-center grid-cols-1 px-4 mx-auto gap-16 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 mb-6 text-xs font-bold tracking-widest uppercase text-amber-500">
            <Mail size={16} />
            <span>Transparência em tempo real</span>
          </div>
          <h2 className="mb-6 text-4xl font-black leading-tight text-white lg:text-6xl">
            {content.sectionHeadlineLiteral}
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-slate-400 lg:text-xl">
            {content.sectionDescriptionLiteral}
          </p>
        </div>

        {/* Contenedor del Formulario (Aduana de Interacción) */}
        <div className="bg-white/5 p-2 rounded-[2.5rem] backdrop-blur-sm border border-white/10">
          <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-2xl">
            <NewsletterSubscriptionForm
              dictionary={formDictionary}
              visualVariantLiteral="STANDARD"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
