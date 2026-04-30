/**
 * @section UI Molecule - Public Expenditure Forensic Table
 * @description Orquestador de visualización tabular. Delega el renderizado
 * a un enjambre de átomos especializados para cumplimiento de SRP.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Atomic Visual DNA.
 * SANEADO Zenith: Resolución de error TS2307 y erradicación de Hardcoded Strings.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';

/**
 * 🛡️ SANEADO Zenith: Importación de ADN mediante Verbatim Module Syntax.
 * Si TS2307 persiste, ejecute 'pnpm nx build pmf-open-data-engine'
 * para generar las declaraciones .d.ts en la carpeta dist.
 */
import type { IPublicExpenditure } from '@floripa-dignidade/pmf-open-data-engine';

import { ExpenditureTableHeader } from './ExpenditureTableHeader';
import { ExpenditureTableRow } from './ExpenditureTableRow';
import { ExpenditureTableFooter } from './ExpenditureTableFooter';

/**
 * @interface IExpenditureTableProperties
 * @description Contrato inmutable para la colección de gastos.
 */
interface IExpenditureTableProperties {
  /** Colección purificada de gastos procesados por el motor soberano. */
  readonly publicExpenditureCollection: IPublicExpenditure[];
  /** Título localizado para el bloque de la tabla. */
  readonly tableHeadlineLiteral: string;
}

/**
 * Molécula encargada de coordinar el enjambre visual de la tabla presupuestaria.
 */
export const ExpenditureTable: React.FC<IExpenditureTableProperties> = ({
  publicExpenditureCollection,
  tableHeadlineLiteral,
}) => {
  return (
    <section className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="p-8 border-b border-slate-100 bg-slate-900 text-white">
        <h2 className="text-xl font-black uppercase tracking-tighter">
          {tableHeadlineLiteral}
        </h2>
      </header>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <ExpenditureTableHeader />

          <tbody className="text-sm">
            {publicExpenditureCollection.map((expenditureSnapshot) => (
              <ExpenditureTableRow
                key={expenditureSnapshot.expenditureIdentifier}
                expenditureSnapshot={expenditureSnapshot}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ExpenditureTableFooter />
    </section>
  );
};
