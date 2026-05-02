/**
 * @section UI Atom - Newsletter Consent Block
 * @description Gestiona la validación legal (LGPD) y los avisos de integridad
 * para el flujo de suscripción. Isola la lógica de consentimiento y el triaje
 * de errores del orquestador principal.
 *
 * Protocolo OEDP-V17.0 - High Performance & Verbatim Module Syntax.
 * SANEADO Zenith: Resolución de TS2375 (exactOptionalPropertyTypes Compliance).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import type { UseFormRegisterReturn } from 'react-hook-form';

/* 2. Infraestructura de Estilos */
import { GlobalStyleClassMerger } from '../../../utility/GlobalStyleMerger';

/**
 * @interface ISubscriptionConsentBlockProperties
 * @description Contrato inmutable para la renderización del bloque de consentimiento legal.
 */
interface ISubscriptionConsentBlockProperties {
  /** Objeto de registro de React Hook Form para la vinculación de eventos del checkbox. */
  readonly register: UseFormRegisterReturn;

  /** Etiqueta institucional para el cumplimiento de la política de privacidad. */
  readonly labelLiteral: string;

  /**
   * Mensaje de error si el consentimiento no ha sido otorgado.
   * 🛡️ SANEADO Zenith: Se autoriza 'undefined' y 'string' para compatibilidad con el motor de validación.
   */
  readonly validationErrorLiteral: string | undefined;

  /** Estado de validación del campo de correo adyacente para coordinación visual. */
  readonly hasEmailErrorBoolean: boolean;

  /**
   * Texto localizado para reportar un formato de comunicación inválido.
   * 🛡️ SANEADO Zenith: Se autoriza 'undefined' para cumplimiento de exactOptionalPropertyTypes.
   */
  readonly emailInvalidLiteral: string | undefined;
}

/**
 * Aparato atómico encargado de la frontera legal del ciudadano.
 *
 * @param properties - Propiedades de configuración y estado de validación.
 * @returns {React.ReactElement} Estructura de control y mensajes de auditoría.
 */
export const SubscriptionConsentBlock: React.FC<ISubscriptionConsentBlockProperties> = ({
  register,
  labelLiteral,
  validationErrorLiteral,
  hasEmailErrorBoolean,
  emailInvalidLiteral,
}) => {

  /**
   * @section Triaje de Visibilidad de Errores
   * Determinamos si existe una violación de integridad que deba ser reportada visualmente.
   */
  const hasValidationErrorBoolean = !!validationErrorLiteral && validationErrorLiteral.length > 0;

  return (
    <div className="flex flex-col gap-3 ml-2">

      {/* 1. SECCIÓN DE ALERTAS DE INTEGRIDAD (In-line Validation) */}
      {hasEmailErrorBoolean && emailInvalidLiteral && (
        <span
          className="flex items-center gap-2 text-[10px] font-bold text-red-600 animate-in fade-in slide-in-from-bottom-1 duration-300"
          role="alert"
        >
          <AlertCircle size={12} />
          <span>{emailInvalidLiteral}</span>
        </span>
      )}

      {/* 2. COMPONENTE DE CONTROL LEGAL (Checkbox Block) */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          {...register}
          type="checkbox"
          className="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 transition-all cursor-pointer"
        />
        <span className={GlobalStyleClassMerger(
          'text-[10px] leading-tight transition-colors select-none',
          hasValidationErrorBoolean
            ? 'text-red-600 font-bold'
            : 'text-slate-500 group-hover:text-slate-700'
        )}>
          {labelLiteral}
        </span>
      </label>

      {/* 3. REPORTE DE ERROR DE CONSENTIMIENTO (SRE Visibility) */}
      {hasValidationErrorBoolean && !hasEmailErrorBoolean && (
        <span
          className="text-[9px] text-red-500 font-medium ml-7 -mt-1 animate-in fade-in duration-300"
          role="alert"
        >
          {validationErrorLiteral}
        </span>
      )}
    </div>
  );
};
