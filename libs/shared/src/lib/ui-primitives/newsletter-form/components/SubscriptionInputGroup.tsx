/**
 * @section UI Atom - Subscription Input Group
 * @description Ensambla el campo de entrada de datos y el disparador de acción
 * para el flujo de captación. Implementa gestión de estados de ejecución (Loading)
 * y variantes anatómicas para el layout del portal.
 *
 * Protocolo OEDP-V17.0 - High Performance & Verbatim Module Syntax.
 * SANEADO Zenith: Resolución de error TS1484 y normalización de nomenclatura ISO.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

/**
 * 🛡️ SANEADO Zenith: Importación de tipo obligatoria para 'verbatimModuleSyntax'.
 * Garantiza que el compilador ignore este recurso en el bundle de ejecución.
 */
import type { UseFormRegisterReturn } from 'react-hook-form';

import { GlobalStyleClassMerger } from '../../../utility/GlobalStyleMerger';

/**
 * @interface ISubscriptionInputGroupProperties
 * @description Contrato inmutable para la renderización del grupo de entrada.
 */
interface ISubscriptionInputGroupProperties {
  /** Objeto de registro de React Hook Form para el campo de email. */
  readonly register: UseFormRegisterReturn;

  /** Indica si la transacción de red está en curso. */
  readonly isExecutingBoolean: boolean;

  /** Estado de validación del ADN de entrada. */
  readonly hasErrorBoolean: boolean;

  /** Texto de sugerencia para el campo de entrada. */
  readonly placeholderLiteral: string;

  /** Etiqueta descriptiva para el botón de envío. */
  readonly buttonLabelLiteral: string;

  /** Determina el escalado visual del componente (Dense vs Standard). */
  readonly isMinimalVariantBoolean: boolean;
}

/**
 * Aparato atómico para la captura de identificadores de comunicación.
 *
 * @param properties - Propiedades de configuración visual y lógica.
 * @returns {React.ReactElement} Estructura de entrada optimizada.
 */
export const SubscriptionInputGroup: React.FC<ISubscriptionInputGroupProperties> = ({
  register,
  isExecutingBoolean,
  hasErrorBoolean,
  placeholderLiteral,
  buttonLabelLiteral,
  isMinimalVariantBoolean,
}) => {
  /**
   * @section Arquitectura de Estilos
   * Fusión de tokens de diseño para estados de enfoque y error.
   */
  const inputStylesLiteral = GlobalStyleClassMerger(
    'w-full px-6 rounded-2xl border-2 transition-all duration-300 outline-none font-medium',
    isMinimalVariantBoolean ? 'h-12 text-sm' : 'h-14 text-base',
    hasErrorBoolean
      ? 'border-red-200 bg-red-50 focus:border-red-400'
      : 'border-slate-100 bg-white focus:border-amber-500 focus:shadow-xl'
  );

  return (
    <div className="relative group">
      {/* CAMPO DE CAPTURA (Sovereign Input) */}
      <input
        {...register}
        type="email"
        placeholder={placeholderLiteral}
        disabled={isExecutingBoolean}
        className={inputStylesLiteral}
        aria-invalid={hasErrorBoolean}
        autoComplete="email"
      />

      {/* DISPARADOR DE ACCIÓN (Action Trigger) */}
      <button
        type="submit"
        disabled={isExecutingBoolean}
        className={GlobalStyleClassMerger(
          'absolute right-2 top-2 px-4 bg-slate-900 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50',
          isMinimalVariantBoolean ? 'h-8' : 'h-10',
          !isExecutingBoolean && 'hover:bg-amber-600'
        )}
        aria-label={buttonLabelLiteral}
      >
        {isExecutingBoolean ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {!isMinimalVariantBoolean && (
              <span className="text-[10px] font-black tracking-widest uppercase">
                {buttonLabelLiteral}
              </span>
            )}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
