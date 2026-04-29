/**
 * @section UI Molecule - Public Expenditure Forensic Table
 * @description Orquestador de visualización tabular para el observatorio ciudadano.
 * Garantiza la integridad responsiva y delega el renderizado de filas al átomo especializado.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swiss-Watch Architecture.
 * SANEADO Zenith: Erradicación de código muerto (TS6133) y atomización implacable.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import type { IPublicExpenditure } from '@floripa-dignidade/pmf-open-data-engine';
import { ExpenditureTableRow } from './ExpenditureTableRow';

interface IExpenditureTableProperties {
  /** Colección purificada de gastos procesados por el motor soberano. */
  readonly publicExpenditureCollection: IPublicExpenditure[];
}

export const ExpenditureTable: React.FC<IExpenditureTableProperties> = ({
  publicExpenditureCollection,
}) => {
  return (
    <section className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="p-8 border-b border-slate-100 bg-slate-900 text-white">
        <h2 className="text-xl font-black uppercase tracking-tighter">
          Registros de Execução em Tempo Real
        </h2>
      </header>

      {/*
          ZONA DE DESBORDAMIENTO (Mobile First)
          Garantiza usabilidad en dispositivos con pantallas < 900px.
      */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/80 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <th className="p-6">Identificador Soberano</th>
              <th className="p-6">Fornecedor / Identidade Fiscal</th>
              <th className="p-6">Objeto do Contrato</th>
              <th className="p-6 text-right">Valor Líquido Executado</th>
              <th className="p-6 text-center">Saúde Cognitiva</th>
            </tr>
          </thead>

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

      <footer className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Sincronizado via Zenith Engine • Florianópolis, SC
        </span>
      </footer>
    </section>
  );
};
