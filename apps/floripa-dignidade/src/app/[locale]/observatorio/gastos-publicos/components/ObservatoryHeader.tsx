/**
 * @section UI Atom - Observatory Header
 * @description Encabezado de alta fidelidad para el búnker de transparencia.
 * Orquesta el título institucional, la descripción de auditoría y los
 * disparadores de exportación forense.
 *
 * Protocolo OEDP-V17.0 - Mobile First & ISO Technical Naming.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

/* 1. Primitivos de Interfaz (Shared Bunker) */
import { GlobalActionButton } from '@floripa-dignidade/shared';

/**
 * @interface IObservatoryHeaderProperties
 * @description Contrato inmutable para la renderización de la cabecera.
 */
interface IObservatoryHeaderProperties {
  /** Título principal localizado (ej: "OBSERVATÓRIO DE GASTOS"). */
  readonly titleLiteral: string;

  /** Descripción técnica de la sección (ej: "Auditoria forense..."). */
  readonly descriptionLiteral: string;

  /** Etiqueta para la acción de descarga de datos. */
  readonly exportActionLabelLiteral: string;
}

/**
 * Aparato encargado de la identidad visual y acciones de la página del observatorio.
 *
 * @param properties - Propiedades de contenido inyectadas por el orquestador.
 * @returns {React.ReactElement} Estructura HTML5 semántica y responsiva.
 */
export const ObservatoryHeader: React.FC<IObservatoryHeaderProperties> = ({
  titleLiteral,
  descriptionLiteral,
  exportActionLabelLiteral,
}) => {
  return (
    <header
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 print:hidden animate-in fade-in slide-in-from-top-4 duration-700"
      role="banner"
    >
      {/* SECCIÓN 1: Identidad y Misión */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
          <ShieldCheck className="text-amber-500 w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
          {titleLiteral}
        </h1>
        <p className="text-slate-500 font-medium border-l-4 border-amber-500/30 pl-4 py-1">
          {descriptionLiteral}
        </p>
      </div>

      {/* SECCIÓN 2: Acciones Globales (Toolbox) */}
      <div className="w-full md:w-auto flex gap-4">
        <GlobalActionButton
          visualIntentConfiguration="OUTLINE"
          className="bg-white w-full md:w-auto px-8"
          onClick={() => {
            /**
             * @future_implementation
             * Inyectar lógica de generación de CSV/PDF (Fase 14).
             */
          }}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm uppercase tracking-widest">{exportActionLabelLiteral}</span>
        </GlobalActionButton>
      </div>
    </header>
  );
};
