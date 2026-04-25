/**
 * @section Utility Apparatus: GlobalStyleClassMerger
 * @description Orquestador de fusión de clases CSS para el motor Tailwind.
 * Resuelve conflictos de especificidad de forma funcional.
 *
 * Protocolo OEDP-V14.0 - Verbatim Module Syntax.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusiona múltiples entradas de clases CSS resolviendo colisiones de Tailwind.
 */
export const GlobalStyleClassMerger = (...styleClassInputs: ClassValue[]): string => {
  const composedClassesLiteral = clsx(styleClassInputs);
  return twMerge(composedClassesLiteral);
};
