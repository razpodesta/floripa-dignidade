/**
 * @section UI Atom - Expenditure Table Row
 * @description Renderiza una única entrada del ledger presupuestario.
 * Implementa lógica de formateo de divisas e integridad visual del proveedor.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & ISO Standards.
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import type { IPublicExpenditure } from '@floripa-dignidade/pmf-open-data-engine';
import { AiAuditBadge } from './AiAuditBadge';

interface IExpenditureTableRowProperties {
  /** Snapshot inmutable de un registro de gasto gubernamental. */
  readonly expenditureSnapshot: IPublicExpenditure;
}

export const ExpenditureTableRow: React.FC<IExpenditureTableRowProperties> = ({
  expenditureSnapshot,
}) => {
  /**
   * @section Formateo de Divisas (BRL)
   * Centralizamos la localización financiera para consistencia institucional.
   */
  const formattedAmountLiteral = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(expenditureSnapshot.totalExecutedAmountNumeric);

  const formattedExtractionDateLiteral = new Date(
    expenditureSnapshot.auditMetadata.extractionTimestampISO
  ).toLocaleDateString('pt-BR');

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-300 group">
      {/* 1. IDENTIFICACIÓN FORENSE */}
      <td className="p-6 font-mono text-[10px] text-slate-400">
        <span className="text-slate-900 font-bold block mb-1 group-hover:text-amber-600 transition-colors">
          {expenditureSnapshot.expenditureIdentifier}
        </span>
        {formattedExtractionDateLiteral}
      </td>

      {/* 2. IDENTIDAD DEL PROVEEDOR */}
      <td className="p-6">
        <span className="font-bold text-slate-900 block leading-none mb-1">
          {expenditureSnapshot.providerMetadata.legalNameLiteral}
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          CNPJ: {expenditureSnapshot.providerMetadata.taxIdentificationNumber}
        </span>
      </td>

      {/* 3. OBJETO DEL CONTRATO */}
      <td className="p-6 text-slate-600 max-w-xs">
        <p className="line-clamp-2 leading-relaxed text-xs">
          {expenditureSnapshot.serviceDescriptionLiteral}
        </p>
      </td>

      {/* 4. PRECISIÓN FINANCIERA */}
      <td className="p-6 text-right font-black text-slate-900 tabular-nums">
        {formattedAmountLiteral}
      </td>

      {/* 5. AUDITORÍA COGNITIVA */}
      <td className="p-6 text-center">
        <AiAuditBadge
          anomalyScoreNumeric={expenditureSnapshot.auditMetadata.lastAnomalyScoreNumeric}
        />
      </td>
    </tr>
  );
};
