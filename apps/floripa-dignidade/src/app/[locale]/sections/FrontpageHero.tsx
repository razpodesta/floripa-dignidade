/**
 * @section Frontpage Section - Hero Identity
 * @description Primer punto de contacto del ciudadano. Implementa el mensaje
 * central y las llamadas a la acción primarias con optimización de CLS.
 *
 * Protocolo OEDP-V16.0 - High Performance & Atomic Visual DNA.
 */

import React from 'react';
import { Heart, Newspaper, ShieldCheck } from 'lucide-react';
import { GlobalActionButton } from '@floripa-dignidade/shared';
import type { IFrontpageI18n } from '../schemas/FrontpageI18n.schema';

interface IFrontpageHeroProperties {
  readonly content: IFrontpageI18n['hero'];
}

export const FrontpageHero: React.FC<IFrontpageHeroProperties> = ({ content }) => {
  return (
    <section className="container relative flex flex-col items-center px-4 py-24 mx-auto text-center lg:py-40">
      {/* Geometría de Identidad (Visual Signature) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent -z-10" />

      {/* Badge de Autoridad */}
      <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-amber-100 text-amber-700 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-sm">
        <ShieldCheck size={14} className="animate-pulse" />
        <span>{content.badgeLabelLiteral}</span>
      </div>

      <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8 max-w-5xl tracking-tighter">
        {content.headlineMainLiteral}{' '}
        <span className="italic text-amber-500">
          {content.headlineAccentLiteral}
        </span>
        .
      </h1>

      <p className="max-w-2xl mb-14 text-xl font-medium leading-relaxed text-slate-600">
        {content.descriptionLiteral}
      </p>

      {/* Acciones de Conversión Primaria */}
      <div className="flex flex-col justify-center w-full px-4 sm:flex-row gap-5 sm:w-auto">
        <GlobalActionButton
          visualIntentConfiguration="CONVERSION"
          className="px-12 py-5 text-xl shadow-2xl shadow-amber-200"
        >
          <Heart className="w-5 h-5 fill-current" />
          <span>{content.primaryActionLabelLiteral}</span>
        </GlobalActionButton>

        <GlobalActionButton visualIntentConfiguration="OUTLINE" className="px-12 py-5 text-xl bg-white">
          <Newspaper className="w-5 h-5" />
          <span>{content.secondaryActionLabelLiteral}</span>
        </GlobalActionButton>
      </div>
    </section>
  );
};
