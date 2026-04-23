/**
 * @section Localized Frontpage
 * @description Página de aterrizaje principal del ecosistema.
 * Implementa el embudo de conversión social: Concienciación -> Transparencia -> Acción.
 *
 * Protocolo OEDP-V13.0 - High Impact SEO & Social Engagement.
 */

import React from 'react';
import { GlobalActionButton } from '@floripa-dignidade/shared';
import { Heart, ShieldCheck, Newspaper } from 'lucide-react';

interface IFrontpageProperties {
  readonly params: Promise<{ locale: string }>;
}

export default async function Frontpage({ params }: IFrontpageProperties) {
  const { locale } = await params;

  /**
   * @todo Implementar 'FrontpageHeroApparatus' y 'ImpactMetricsApparatus'.
   * Por ahora, materializamos la estructura base del embudo de conversión.
   */
  return (
    <div className="flex-grow flex flex-col">

      {/* SECCIÓN I: HERO DE IMPACTO (Awareness) */}
      <section className="container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <ShieldCheck size={14} />
          <span>Defendiendo la Dignidad en Florianópolis</span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-black text-navy-900 leading-tight mb-6 max-w-4xl">
          Transformando la Realidad a través de la <span className="text-amber-500">Transparencia</span>.
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mb-12 leading-relaxed">
          Somos una organización dedicada a la vigilancia de los Derechos Humanos y el apoyo a comunidades vulnerables en toda la isla.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GlobalActionButton visualIntentConfiguration="CONVERSION" className="text-lg px-10 py-4">
            <Heart className="fill-current" />
            <span>Quiero Colaborar</span>
          </GlobalActionButton>

          <GlobalActionButton visualIntentConfiguration="OUTLINE" className="text-lg px-10 py-4">
            <Newspaper />
            <span>Ver Reportes de Impacto</span>
          </GlobalActionButton>
        </div>
      </section>

      {/* SECCIÓN II: GRID DE ACCIÓN ATÓMICA */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Card: Denuncias */}
          <div className="flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
               <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Sistema de Denuncias</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Canal seguro y anónimo para reportar violaciones de Derechos Humanos en tiempo real.
            </p>
          </div>

          {/* Card: Transparencia */}
          <div className="flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
               <Newspaper size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Datos Abiertos</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Consulta el rastro de cada donación y el progreso de nuestras intervenciones territoriales.
            </p>
          </div>

          {/* Card: Comunidad */}
          <div className="flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
               <Heart size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Ecosistema Solidario</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Únete a nuestra red de voluntarios y transforma Florianópolis con acciones directas.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
