/**
 * @section UI Atom - AI Audit Status Badge
 * @description Indicador visual de la salud de un gasto analizado por IA.
 */

import React from 'react';
import { GlobalStyleClassMerger } from '@floripa-dignidade/shared';

interface IAiAuditBadgeProperties {
  /** Coeficiente de anomalía detectado (0.0 a 1.0). */
  readonly anomalyScoreNumeric: number;
}

export const AiAuditBadge: React.FC<IAiAuditBadgeProperties> = ({ anomalyScoreNumeric }) => {
  const isHealthyBoolean = anomalyScoreNumeric < 0.3;

  return (
    <div
      className={GlobalStyleClassMerger(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase',
        isHealthyBoolean ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      )}
    >
      <div
        className={GlobalStyleClassMerger(
          'w-2 h-2 rounded-full',
          isHealthyBoolean ? 'bg-green-500' : 'bg-red-500 animate-pulse',
        )}
      />
      <span>{isHealthyBoolean ? 'Nominal' : 'Audit Required'}</span>
    </div>
  );
};
