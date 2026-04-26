/**
 * @section Frontpage Section - Value Proposition Grid
 * @description Renderiza los pilares estratégicos de la ONG mediante una grilla
 * responsiva de alta fidelidad. Gestiona el mapeo semántico de iconografía ISO.
 *
 * Protocolo OEDP-V16.0 - High Performance & Atomic Visual DNA.
 * SANEADO Zenith: Resolución de error 'sort-imports' y rigor de tipos inmutables.
 */

import React from 'react';
import { Heart, Newspaper, ShieldCheck } from 'lucide-react';
import { FeatureActionCard } from '../components/FeatureActionCard';
import type { IFrontpageI18n } from '../schemas/FrontpageI18n.schema';

/**
 * @interface IValuePropositionGridProperties
 * @description Contrato de propiedades para la sección de pilares.
 */
interface IValuePropositionGridProperties {
  /** Colección inmutable de características extraídas del diccionario soberano. */
  readonly features: IFrontpageI18n['features'];
}

export const ValuePropositionGrid: React.FC<IValuePropositionGridProperties> = ({
  features
}) => {
  /**
   * @section Mapeo de Configuración Visual
   * Encapsula la lógica de diseño (Iconos y Variantes) para mantener la pureza
   * del ciclo de renderizado.
   */
  const featureVisualConfigurationMapping: Record<
    string,
    { readonly iconNode: React.ReactNode; readonly visualVariantLiteral: 'RED' | 'BLUE' | 'AMBER' }
  > = {
    'TRANSPARENCY': {
      iconNode: <ShieldCheck size={32} />,
      visualVariantLiteral: 'RED'
    },
    'ALERTS': {
      iconNode: <Newspaper size={32} />,
      visualVariantLiteral: 'BLUE'
    },
    'ACTION': {
      iconNode: <Heart size={32} />,
      visualVariantLiteral: 'AMBER'
    },
  };

  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {features.map((featureItem) => {
            /** 🛡️ SANEADO: Aplicación de fallback resiliente ante identificadores desconocidos */
            const visualConfig = featureVisualConfigurationMapping[featureItem.identifier] || {
              iconNode: <ShieldCheck size={32} />,
              visualVariantLiteral: 'BLUE'
            };

            return (
              <FeatureActionCard
                key={featureItem.identifier}
                iconNode={visualConfig.iconNode}
                titleLiteral={featureItem.titleLiteral}
                descriptionLiteral={featureItem.descriptionLiteral}
                visualVariantLiteral={visualConfig.visualVariantLiteral}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
