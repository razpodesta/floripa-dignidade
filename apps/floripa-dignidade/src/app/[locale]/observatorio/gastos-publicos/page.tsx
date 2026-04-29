/**
 * @section Observatory Shell - Public Expenditure Page (Orchestrator)
 * @description Punto de acceso soberano para la auditoría de recursos públicos.
 *
 * Protocolo OEDP-V17.0 - High Performance, SRP & Zero Abbreviations.
 * SANEADO Zenith: Reducción de líneas (168 -> 72), ordenamiento alfabético
 * y gestión de promesas telemétricas con 'void'.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { redirect } from 'next/navigation';
import { AlertTriangle, BarChart3, FileText, ShieldCheck } from 'lucide-react';

/* 1. Infraestructura Core e Identidad (Alphabetical Sort) */
import { USER_ROLES, ValidateUserAccess } from '@floripa-dignidade/identity';
import { EmitTelemetrySignal, GenerateCorrelationIdentifier } from '@floripa-dignidade/telemetry';

/* 2. Motores de Inteligencia (PMF Domain) */
import { SyncMunicipalityExpenditure } from '@floripa-dignidade/pmf-open-data-engine';
import type { IPublicExpenditure } from '@floripa-dignidade/pmf-open-data-engine';

/* 3. Componentes Visuales y Átomos Locales */
import { GlobalActionButton } from '@floripa-dignidade/shared';
import { MetricCard } from './components/MetricCard';
import { ExpenditureTable } from './components/ExpenditureTable';

interface IObservatoryPageProperties {
  readonly params: Promise<{ locale: string }>;
}

export default async function PublicExpenditureObservatoryPage({ params }: IObservatoryPageProperties) {
  const { locale } = await params;
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // FASE 1: VALIDACIÓN DE AUTORIDAD (Identity Guardian)
  const mockUserIdentity = { assignedAuthorityRoleLiteral: 'INFRASTRUCTURE_SOVEREIGN_AUDITOR' as const };
  try {
    ValidateUserAccess(mockUserIdentity, USER_ROLES.INFRASTRUCTURE_SOVEREIGN_AUDITOR);
  } catch (_caughtException: unknown) {
    redirect(`/${locale}/unauthorized`);
  }

  // REPORTE DE ACCESO (SRE Visibility - Fix no-floating-promises)
  void EmitTelemetrySignal({
    severityLevel: 'WARNING',
    moduleIdentifier: 'OBSERVATORY_SHELL',
    operationCode: 'RESERVED_DATA_ACCESSED',
    correlationIdentifier,
    message: `Acceso administrativo al observatorio en [${locale}].`,
    contextMetadata: { role: mockUserIdentity.assignedAuthorityRoleLiteral }
  });

  // FASE 2: CAPTURA DE DATOS (Data Acquisition)
  const publicExpenditureCollection: IPublicExpenditure[] = await SyncMunicipalityExpenditure({
    municipalitySlugLiteral: 'florianopolis',
    periodRange: { initial: '01/2026', final: '04/2026' }
  });

  const totalAuditedNumeric = publicExpenditureCollection.reduce(
    (sum: number, item: IPublicExpenditure) => sum + item.totalExecutedAmountNumeric, 0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 print:bg-white">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 print:hidden">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
            <ShieldCheck className="text-amber-500" size={36} />
            Observatório de Gastos
          </h1>
          <p className="text-slate-500 font-medium">Auditoria forense da execução orçamentária PMF</p>
        </div>
        <GlobalActionButton visualIntentConfiguration="OUTLINE" className="bg-white">
          <FileText size={18} />
          <span>Exportar Relatório</span>
        </GlobalActionButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <MetricCard iconNode={<BarChart3 />} labelLiteral="Total Auditado" valueLiteral={`R$ ${totalAuditedNumeric.toLocaleString('pt-BR')}`} />
        <MetricCard iconNode={<AlertTriangle />} labelLiteral="Anomalias Detectadas" valueLiteral="02" isAlertVariantBoolean />
        <MetricCard iconNode={<ShieldCheck className="text-green-500" />} labelLiteral="Integridade" valueLiteral="100%" />
      </div>

      <ExpenditureTable expenditureCollection={publicExpenditureCollection} />
    </main>
  );
}
