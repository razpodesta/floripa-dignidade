/**
 * @section UI Atom - Success Checkmark indicator
 * @description Representación visual de estado positivo con animación cíclica.
 * Protocolo OEDP-V16.0 - Atomic Visual DNA.
 */

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const SuccessCheckmark: React.FC = () => (
  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 text-green-500 mb-10 shadow-inner">
    <CheckCircle2 size={48} className="animate-pulse" />
  </div>
);
