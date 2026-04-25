/**
 * @section UI Atoms - Feature Action Card
 * @description Tarjeta de acción de alta fidelidad con variantes de intención visual.
 *
 * Protocolo OEDP-V15.0 - Atomic Visual Architecture.
 */

import React from 'react';
import { GlobalStyleClassMerger } from '@floripa-dignidade/shared';

interface IFeatureActionCardProperties {
  readonly iconNode: React.ReactNode;
  readonly titleLiteral: string;
  readonly descriptionLiteral: string;
  readonly visualVariantLiteral?: 'RED' | 'BLUE' | 'AMBER';
}

export const FeatureActionCard: React.FC<IFeatureActionCardProperties> = ({
  iconNode,
  titleLiteral,
  descriptionLiteral,
  visualVariantLiteral = 'BLUE'
}) => {
  const variantStylesMapping = {
    RED: "bg-red-50 text-red-600",
    BLUE: "bg-blue-50 text-blue-600",
    AMBER: "bg-amber-50 text-amber-600"
  };

  return (
    <article className="flex flex-col items-start gap-5 p-6 rounded-3xl transition-all duration-500 hover:bg-white hover:shadow-xl group">
      <div className={GlobalStyleClassMerger(
        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
        variantStylesMapping[visualVariantLiteral]
      )}>
         {iconNode}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{titleLiteral}</h3>
      <p className="text-slate-500 leading-relaxed">{descriptionLiteral}</p>
    </article>
  );
};
