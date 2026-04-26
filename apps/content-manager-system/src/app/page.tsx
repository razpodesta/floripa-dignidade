/**
 * @section CMS Shell - Administrative Landing Page
 * @description Punto de entrada visual para el Content Manager System. Proporciona 
 * la carcasa de bienvenida y el rastro de herramientas para la gestión de la ONG.
 *
 * Protocolo OEDP-V16.0 - Build Resilience, Type Safety & i18n Sovereignty.
 * Saneamiento: Resolución de error de iconos Lucide y sincronización telemétrica.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  LayoutDashboard, 
  PlayCircle, // 🛡️ SANEADO: Sustitución de Youtube por PlayCircle para evitar TS2305
  Terminal
} from 'lucide-react';

/* 1. Infraestructura Core (Atmos PascalCase) */
import { 
  EmitTelemetrySignal, 
  GenerateCorrelationIdentifier 
} from '@floripa-dignidade/telemetry';

/* 2. ADN Visual Local */
import styles from './page.module.css';

/**
 * @section ADN Lingüístico Local (Sovereign Dictionary)
 * Preparado para el motor de compilación i18n.
 */
const CMS_LANDING_DICTIONARY = {
  welcome: {
    greetingLiteral: 'Hello there,',
    titleLiteral: 'Welcome @floripa-dignidade/content-manager-system 👋',
  },
  hero: {
    statusLiteral: "You're up and running",
    ctaLabelLiteral: "What's next?",
  },
  learning: {
    sectionHeadingLiteral: 'Learning materials',
    documentation: {
      labelLiteral: 'Documentation',
      descriptionLiteral: 'Everything is in there',
      url: 'https://nx.dev/getting-started/intro',
    },
    interactive: {
      labelLiteral: 'Interactive tutorials',
      descriptionLiteral: 'Create an app, step-by-step',
      url: 'https://nx.dev/react-tutorial/1-code-generation',
    }
  },
  nextSteps: {
    headingLiteral: 'Strategic Roadmap',
    descriptionLiteral: 'Inicia la arquitectura de colecciones de Payload CMS para habilitar la Soberanía de Datos en el portal de Floripa Dignidade.'
  }
} as const;

/**
 * Componente principal de la interfaz administrativa.
 * Implementa telemetría forense y cumplimiento de rigor técnico ISO.
 */
export default async function IndexPage() {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // EMISIÓN DE SEÑAL: Trazabilidad de acceso al búnker administrativo
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'CMS_ADMIN_SHELL',
    operationCode: 'ADMIN_PORTAL_ACCESSED',
    correlationIdentifier,
    message: 'Se ha cargado la interfaz base del sistema de gestión de contenidos.'
  });

  return (
    /**
     * 🛡️ SANEADO Zenith: Acceso mediante corchetes para cumplir con
     * 'noPropertyAccessFromIndexSignature'.
     */
    <div className={styles['page']}>
      <div className="w-full">
        <div className="container mx-auto max-w-4xl px-4">
          
          <header id="welcome" className="py-12">
            <h1 className="text-slate-900 tracking-tighter">
              <span className="block text-3xl font-light text-slate-500 mb-2">
                {CMS_LANDING_DICTIONARY.welcome.greetingLiteral}
              </span>
              <span className="text-5xl font-black">
                {CMS_LANDING_DICTIONARY.welcome.titleLiteral}
              </span>
            </h1>
          </header>

          {/* SECCIÓN HERO: Estado del Sistema */}
          <section id="hero" className="rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center border border-slate-800">
            <div className="p-12 flex-grow text-white">
              <h2 className="text-3xl font-bold flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                  <LayoutDashboard className="text-amber-500" size={28} />
                </div>
                <span>{CMS_LANDING_DICTIONARY.hero.statusLiteral}</span>
              </h2>
              <a 
                href="#commands" 
                className="inline-block mt-10 px-10 py-5 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all duration-500 shadow-xl shadow-amber-500/20"
              >
                {CMS_LANDING_DICTIONARY.hero.ctaLabelLiteral}
              </a>
            </div>
            
            <div className="p-12 bg-white/5 h-full self-stretch flex items-center justify-center hidden md:flex">
               <Terminal size={140} className="text-white opacity-10" />
            </div>
          </section>

          {/* CONTENIDO PRINCIPAL: Recursos Técnicos */}
          <main id="middle-content" className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-20">
            
            <div id="learning-materials" className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <BookOpen className="text-amber-500" size={22} />
                {CMS_LANDING_DICTIONARY.learning.sectionHeadingLiteral}
              </h2>
              
              <div className="flex flex-col gap-2">
                <CmsResourceLink 
                  href={CMS_LANDING_DICTIONARY.learning.documentation.url}
                  label={CMS_LANDING_DICTIONARY.learning.documentation.labelLiteral}
                  description={CMS_LANDING_DICTIONARY.learning.documentation.descriptionLiteral}
                  icon={<BookOpen size={20} />}
                />
                <CmsResourceLink 
                  href={CMS_LANDING_DICTIONARY.learning.interactive.url}
                  label={CMS_LANDING_DICTIONARY.learning.interactive.labelLiteral}
                  description={CMS_LANDING_DICTIONARY.learning.interactive.descriptionLiteral}
                  icon={<Terminal size={20} />}
                />
              </div>
            </div>

            {/* SECCIÓN DE PRÓXIMOS PASOS (Next-Gen Roadmap) */}
            <div className="flex flex-col gap-6">
               <article className="p-10 bg-amber-50/50 rounded-[2rem] border border-amber-100/50 group hover:bg-amber-50 transition-colors duration-500">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-110">
                    <PlayCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-3">
                    {CMS_LANDING_DICTIONARY.nextSteps.headingLiteral}
                  </h3>
                  <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
                    {CMS_LANDING_DICTIONARY.nextSteps.descriptionLiteral}
                  </p>
               </article>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * @private Component: CmsResourceLink
 * @description Sub-aparato atómico para la renderización de enlaces técnicos.
 */
interface ICmsResourceLinkProperties {
  readonly href: string;
  readonly label: string;
  readonly description: string;
  readonly icon: React.ReactNode;
}

const CmsResourceLink: React.FC<ICmsResourceLinkProperties> = ({ href, label, description, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-start gap-4 p-5 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100"
  >
    <div className="mt-1 text-slate-400 group-hover:text-amber-600 transition-colors">
      {icon}
    </div>
    <div className="flex-grow">
      <span className="block font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{label}</span>
      <span className="block text-xs text-slate-500 font-medium mt-0.5">{description}</span>
    </div>
    <ExternalLink size={14} className="text-slate-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);