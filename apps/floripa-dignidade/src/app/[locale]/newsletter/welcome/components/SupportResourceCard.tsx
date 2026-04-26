/**
 * @section UI Molecule - Support Resource Card
 * @description Tarjeta de navegación secundaria para re-inyección de usuarios.
 * Protocolo OEDP-V16.0 - High Performance & Hover States.
 */

import React from 'react';
import { GlobalStyleClassMerger } from '@floripa-dignidade/shared';

interface ISupportResourceCardProperties {
  readonly iconNode: React.ReactNode;
  readonly titleLiteral: string;
  readonly descriptionLiteral: string;
  readonly visualVariantLiteral: 'AMBER' | 'BLUE';
}

export const SupportResourceCard: React.FC<ISupportResourceCardProperties> = ({
  iconNode,
  titleLiteral,
  descriptionLiteral,
  visualVariantLiteral
}) => {
  const variantStylesMapping = {
    AMBER: "bg-amber-50 text-amber-600",
    BLUE: "bg-blue-50 text-blue-600"
  };

  return (
    <article className="flex gap-4 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 group">
      <div className={GlobalStyleClassMerger(
        "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
        variantStylesMapping[visualVariantLiteral]
      )}>
        {iconNode}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{titleLiteral}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{descriptionLiteral}</p>
      </div>
    </article>
  );
};
