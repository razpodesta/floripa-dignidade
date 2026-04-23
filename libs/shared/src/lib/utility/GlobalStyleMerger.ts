/**
 * @section Utility Apparatus: GlobalStyleClassMerger
 * @description Orquestador soberano de fusión de clases CSS para el motor Tailwind.
 * Resuelve conflictos de especificidad y gestiona la lógica condicional de estilos.
 *
 * Protocolo OEDP-V13.0 - Atomic Functional & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusiona múltiples entradas de clases CSS, resolviendo colisiones de Tailwind.
 * Implementa la estrategia 'Last-Value-Wins' para clases en conflicto.
 *
 * @param classValueInputs - Lista de clases literales, objetos de estado o condicionales.
 * @returns Una cadena de texto purificada y optimizada.
 */
export const GlobalStyleClassMerger = (...classValueInputs: ClassValue[]): string => {
  /**
   * 1. Lógica de Composición (clsx):
   * Aplana objetos y arrays condicionales en un string simple.
   *
   * 2. Lógica de Fusión (twMerge):
   * Analiza las clases de Tailwind y elimina las redundantes para evitar colisiones
   * en el renderizado del navegador.
   */
  return twMerge(clsx(classValueInputs));
};
