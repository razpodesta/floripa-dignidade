/**
 * @section Observatory Shell - Public Expenditure Page (Orchestrator)
 * @description Punto de acceso soberano para la auditoría de recursos públicos.
 * Coordina la captura de datos gubernamentales, la validación de autoridad
 * y el montaje del enjambre visual del dashboard forense.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Resolución de TS2322, TS2307 y cumplimiento de 'await' en accesos.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { notFound } from 'next/navigation';

/* 1. Infraestructura Core & Routing (Alphabetical Sort) */
import {
  SupportedLocaleSchema,
  ValidateLinguisticContract
} from '@floripa-dignidade/routing';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 2. Motores de Datos (PMF Domain) */
/**
 * 🛡️ SANEADO Zenith: Importación de lógica y tipos nominales.
 * Si TS2307 persiste en el IDE, ejecute 'pnpm nx build pmf-open-data-engine'.
 */
import { SyncMunicipalityExpenditure } from '@floripa-dignidade/pmf-open-data-engine';
import type { IPublicExpenditure } from '@floripa-dignidade/pmf-open-data-engine';

/* 3. Enjambre Atómico Local (UI & Logic) */
import { ObservatoryI18nSchema } from '../i18n/ObservatoryI18n.schema';
import { CalculateObservatoryMetrics } from './logic/CalculateObservatoryMetrics';
import { ValidateObservatoryAccess } from './logic/ValidateObservatoryAccess';
import { ExpenditureTable } from './components/ExpenditureTable';
import { ObservatoryHeader } from './components/ObservatoryHeader';
import { ObservatoryMetricsGrid } from './components/ObservatoryMetricsGrid';

/**
 * @interface IObservatoryPageProperties
 * @description Contrato de parámetros de ruta para el App Router.
 */
interface IObservatoryPageProperties {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Componente de Servidor principal del Observatorio.
 */
export default async function PublicExpenditureObservatoryPage({
  params
}: IObservatoryPageProperties) {
  const { locale: rawLocaleIdentifier } = await params;
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. ADUANA DE ADN LINGÜÍSTICO
  const localeValidationResult = SupportedLocaleSchema.safeParse(rawLocaleIdentifier);
  if (!localeValidationResult.success) notFound();
  const validatedLocaleIdentifier = localeValidationResult.data;

  /**
   * 2. SEGURIDAD PERIMETRAL (RBAC Guard)
   * 🛡️ SANEADO Zenith: Se añade 'await' para cumplir con el contrato asíncrono
   * y resolver el error de promesas flotantes (ESLint).
   */
  await ValidateObservatoryAccess(validatedLocaleIdentifier);

  // 3. CARGA DE ALMA LINGÜÍSTICA (Isomorphic Dictionary)
  let dictionary;
  try {
    const rawDictionaryData = await import(`./i18n/${validatedLocaleIdentifier}.json`);
    ValidateLinguisticContract(
      'OBSERVATORY_SHELL',
      ObservatoryI18nSchema,
      rawDictionaryData.default,
      validatedLocaleIdentifier
    );
    dictionary = rawDictionaryData.default;
  } catch (_error) {
    notFound();
  }

  // 4. CAPTURA DE DATOS GUBERNAMENTALES (Data Acquisition)
  const publicExpenditureCollection: IPublicExpenditure[] = await SyncMunicipalityExpenditure({
    municipalitySlugLiteral: 'florianopolis',
    periodRange: { initial: '01/2026', final: '04/2026' }
  });

  // 5. INTELIGENCIA DE DASHBOARD (Aritmética Pura)
  const calculatedMetrics = CalculateObservatoryMetrics(publicExpenditureCollection);

  // 6. REPORTE DE ESTADO (SRE Visibility)
  void EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'OBSERVATORY_SHELL',
    operationCode: 'FORENSIC_DASHBOARD_ASSEMBLED',
    correlationIdentifier,
    message: `Dashboard del observatorio montado para [${validatedLocaleIdentifier}].`,
    contextMetadata: { recordCount: publicExpenditureCollection.length }
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12 print:bg-white animate-in fade-in duration-1000">
      <ObservatoryHeader
        titleLiteral={dictionary.metadata.pageTitleLiteral}
        descriptionLiteral={dictionary.metadata.pageDescriptionLiteral}
        exportActionLabelLiteral={dictionary.actions.exportCsvLabel}
      />

      <ObservatoryMetricsGrid
        metrics={calculatedMetrics}
        labels={dictionary.dashboard}
      />

      {/* 🛡️ SANEADO Zenith: Sincronización de nombre de propiedad (Fix TS2322) */}
      <ExpenditureTable
        publicExpenditureCollection={publicExpenditureCollection}
        tableHeadlineLiteral={dictionary.table.columnEntity}
      />
    </main>
  );
}
