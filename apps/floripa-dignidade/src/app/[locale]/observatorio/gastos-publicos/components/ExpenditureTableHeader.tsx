/**
 * @section UI Atom - Expenditure Table Header
 * @description Renderiza la cabecera técnica de la tabla forense.
 * Protocolo OEDP-V17.0 - Functional Atomicity.
 */

import React from 'react';

export const ExpenditureTableHeader: React.FC = () => (
  <thead>
    <tr className="bg-slate-50/80 text-slate-400 text-[10px] uppercase tracking-widest font-black">
      <th className="p-6">Identificador Soberano</th>
      <th className="p-6">Fornecedor / Identidade Fiscal</th>
      <th className="p-6">Objeto do Contrato</th>
      <th className="p-6 text-right">Valor Líquido Executado</th>
      <th className="p-6 text-center">Saúde Cognitiva</th>
    </tr>
  </thead>
);
