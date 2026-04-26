/**
 * @section UI Atom - Subscription Success State
 * @description Representación visual de conversión exitosa.
 * Protocolo OEDP-V16.0 - Atomic Visual DNA.
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ISuccessStateProperties {
  readonly headlineLiteral: string;
  readonly descriptionLiteral: string;
}

export const SubscriptionSuccessState: React.FC<ISuccessStateProperties> = ({
  headlineLiteral,
  descriptionLiteral,
}) => (
  <div className="flex flex-col items-center justify-center p-8 duration-500 bg-green-50 rounded-3xl border border-green-100 animate-in fade-in zoom-in-95">
    <CheckCircle className="mb-4 w-12 h-12 text-green-500" />
    <h3 className="mb-2 text-xl font-bold text-green-900">{headlineLiteral}</h3>
    <p className="text-sm text-center text-green-700">{descriptionLiteral}</p>
  </div>
);
