/**
 * @section UI Atom - Newsletter Consent Block
 * @description Gestiona la validación legal (LGPD) y los avisos de integridad
 * para el flujo de suscripción. Isola la lógica de consentimiento del layout principal.
 *
 * Protocolo OEDP-V17.0 - High Performance & Verbatim Module Syntax.
 * SANEADO Zenith: Resolución de error TS1484 mediante 'import type'.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * 🛡️ SANEADO Zenith: Importación exclusiva de ADN (tipos).
 * Requerido por la regla 'verbatimModuleSyntax' para optimización de bundle.
 */
import type { UseFormRegisterReturn } from 'react-hook-form';

import { GlobalStyleClassMerger } from '../../../utility/GlobalStyleMerger';

/**
 * @interface ISubscriptionConsentBlockProperties
 * @description Contrato inmutable para la renderización del bloque de consentimiento.
 */
interface ISubscriptionConsentBlockProperties {
  /** Objeto de registro de React Hook Form para el checkbox legal. */
  readonly register: UseFormRegisterReturn;

  /** Etiqueta descriptiva para el cumplimiento de la política de privacidad. */
  readonly labelLiteral: string;

  /** Mensaje de error si el consentimiento no ha sido otorgado. */
  readonly validationErrorLiteral?: string;

  /** Estado de error del campo de email adyacente para triaje visual. */
  readonly hasEmailErrorBoolean: boolean;

  /** Texto localizado para el fallo de formato de correo. */
  readonly emailInvalidLiteral?: string;
}

export const SubscriptionConsentBlock: React.FC<ISubscriptionConsentBlockProperties> = ({
  register,
  labelLiteral,
  validationErrorLiteral,
  hasEmailErrorBoolean,
  emailInvalidLiteral,
}) => {
  return (
    <div className="flex flex-col gap-3 ml-2">

      {/* SECCIÓN DE ALERTAS DE INTEGRIDAD (Email Validation) */}
      {hasEmailErrorBoolean && (
        <span
          className="flex items-center gap-2 text-[10px] font-bold text-red-600 animate-slide-up"
          role="alert"
        >
          <AlertCircle size={12} />
          {emailInvalidLiteral}
        </span>
      )}

      {/* COMPONENTE DE CONTROL LEGAL (Checkbox Block) */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          {...register}
          type="checkbox"
          className="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 transition-all"
        />
        <span className={GlobalStyleClassMerger(
          'text-[10px] leading-tight transition-colors select-none',
          validationErrorLiteral
            ? 'text-red-600 font-bold'
            : 'text-slate-500 group-hover:text-slate-700'
        )}>
          {labelLiteral}
        </span>
      </label>

      {/* REPORTE DE ERROR DE CONSENTIMIENTO */}
      {validationErrorLiteral && !hasEmailErrorBoolean && (
        <span className="text-[9px] text-red-500 font-medium ml-7 -mt-1">
          {validationErrorLiteral}
        </span>
      )}
    </div>
  );
};
