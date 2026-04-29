/**
 * @section UI Atom - Expenditure Metric Card
 * @description Representación visual de un indicador financiero con soporte de alertas.
 * Protocolo OEDP-V17.0 - High Performance & Atomic Visual DNA.
 */

import React from 'react';
import { GlobalStyleClassMerger } from '@floripa-dignidade/shared';

interface IMetricCardProperties {
  readonly iconNode: React.ReactNode;
  readonly labelLiteral: string;
  readonly valueLiteral: string;
  readonly isAlertVariantBoolean?: boolean;
}

export const MetricCard: React.FC<IMetricCardProperties> = ({
  iconNode,
  labelLiteral,
  valueLiteral,
  isAlertVariantBoolean = false,
}) => (
  <article
    className={GlobalStyleClassMerger(
      'p-8 rounded-[2rem] border transition-all shadow-sm',
      isAlertVariantBoolean ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100',
    )}
  >
    <div className="flex items-center gap-3 mb-4 text-slate-400">
      <div className={isAlertVariantBoolean ? 'text-red-500' : 'text-slate-400'}>
        {iconNode}
      </div>
      <span className="text-xs font-black uppercase tracking-widest">{labelLiteral}</span>
    </div>
    <span className="text-3xl font-black text-slate-900">{valueLiteral}</span>
  </article>
);
