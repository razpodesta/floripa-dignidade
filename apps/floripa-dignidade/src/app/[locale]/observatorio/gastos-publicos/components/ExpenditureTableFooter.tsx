/**
 * @section UI Atom - Expenditure Table Footer
 * @description Sello de transparencia y rastro de origen de datos.
 */

import React from 'react';

export const ExpenditureTableFooter: React.FC = () => (
  <footer className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
      Sincronizado com o Portal de Transparência PMF via Zenith Engine • Florianópolis, SC
    </span>
  </footer>
);
