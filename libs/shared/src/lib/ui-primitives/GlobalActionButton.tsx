'use client';

import React from 'react';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/**
 * @section Component: GlobalActionButton
 * @description Elemento de interacción primaria optimizado para la conversión social.
 * Implementa gestión de estados de carga, variantes de intención visual ISO
 * y accesibilidad de alto nivel (WAI-ARIA).
 *
 * Protocolo OEDP-V13.0 - Zero Abbreviations & Atomic Logic.
 * @author Staff Software Engineer - Floripa Dignidade
 */

/**
 * Definición de Variantes de Intención Visual.
 * CONVERSION: Para donaciones y llamados a la acción críticos (Ámbar).
 * STANDARD: Interacciones primarias del sistema (Azul).
 * OUTLINE: Acciones secundarias o de navegación.
 * GHOST: Interacciones sutiles o de bajo impacto.
 */
type VisualIntentConfiguration = 'CONVERSION' | 'STANDARD' | 'OUTLINE' | 'GHOST';

/**
 * @interface IGlobalActionButtonProperties
 * @description Contrato de propiedades para el aparato de botón.
 */
interface IGlobalActionButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Define el lenguaje visual y el color del búnker de diseño aplicado. */
  readonly visualIntentConfiguration?: VisualIntentConfiguration;
  /** Estado de ejecución asíncrona; deshabilita la interacción y muestra el spinner. */
  readonly isExecutionLoading?: boolean;
}

export const GlobalActionButton: React.FC<IGlobalActionButtonProperties> = ({
  children,
  visualIntentConfiguration = 'STANDARD',
  isExecutionLoading = false,
  className,
  disabled,
  ...buttonProperties
}) => {

  /**
   * 1. Arquitectura de Estilos Base (ISO: Cohesión Visual)
   * Define la estructura física inmutable del componente.
   */
  const baseStructuralStylesLiteral = "relative px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 overflow-hidden";

  /**
   * 2. Mapeo de Variantes (Design System Integration)
   * Nota: Se utilizan los tokens cromáticos definidos en el Design System.
   */
  const variantStylesMapping: Record<VisualIntentConfiguration, string> = {
    CONVERSION: "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200",
    STANDARD: "bg-navy-900 text-white hover:bg-navy-800 shadow-md",
    OUTLINE: "border-2 border-navy-900 text-navy-900 hover:bg-navy-50",
    GHOST: "bg-transparent text-slate-600 hover:bg-slate-100"
  };

  /**
   * 3. Fusión de Clases Soberana (TS2305 Fix)
   * Sincronizado con GlobalStyleClassMerger para resolución de colisiones.
   */
  const mergedComponentStyles = GlobalStyleClassMerger(
    baseStructuralStylesLiteral,
    variantStylesMapping[visualIntentConfiguration],
    className
  );

  return (
    <button
      className={mergedComponentStyles}
      disabled={isExecutionLoading || disabled}
      aria-busy={isExecutionLoading}
      aria-live="polite"
      {...buttonProperties}
    >
      {/* CAPA DE CARGA (Atomic Resilience) */}
      {isExecutionLoading && (
        <span className="flex items-center justify-center absolute inset-0 bg-inherit pointer-events-none">
          <svg
            className="animate-spin h-5 w-5 text-current"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}

      {/* CONTENIDO DEL APARATO */}
      <span className={GlobalStyleClassMerger(
        "flex items-center gap-2 transition-opacity duration-300",
        isExecutionLoading ? "opacity-0" : "opacity-100"
      )}>
        {children}
      </span>
    </button>
  );
};
