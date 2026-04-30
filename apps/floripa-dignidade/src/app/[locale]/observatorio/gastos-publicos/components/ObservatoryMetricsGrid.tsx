/**
 * @section UI Molecule - Observatory Metrics Grid
 * @description Orquestador de indicadores de alto nivel. Distribuye los datos
 * procesados por el motor de analítica en una grilla responsiva optimizada
 * para la lectura rápida (Dashboard style).
 *
 * Protocolo OEDP-V17.0 - Mobile First & Performance SRE.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import React from 'react';
import { AlertTriangle, BarChart3, ShieldCheck, Activity } from 'lucide-react';

/* 1. Átomos Locales */
import { MetricCard } from './MetricCard';

/* 2. ADN Lingüístico (Sovereign Schema) */
import type { IObservatoryI18n } from '../../i18n/ObservatoryI18n.schema';

/**
 * @interface IObservatoryMetricsGridProperties
 * @description Contrato inmutable para la inyección de datos calculados y etiquetas.
 */
interface IObservatoryMetricsGridProperties {
  /** Snapshot de métricas procesadas por 'CalculateObservatoryMetrics.ts'. */
  readonly metrics: {
    readonly totalAuditedAmountNumeric: number;
    readonly anomalyCountQuantity: number;
  };

  /** Diccionario localizado del dominio del observatorio. */
  readonly labels: IObservatoryI18n['dashboard'];
}

/**
 * Aparato encargado de la disposición estructural de las tarjetas de métricas.
 *
 * @param properties - Propiedades de datos y lenguaje.
 * @returns {React.ReactElement} Grid responsivo de indicadores.
 */
export const ObservatoryMetricsGrid: React.FC<IObservatoryMetricsGridProperties> = ({
  metrics,
  labels,
}) => {
  /**
   * @section Formateo de Identidad Financiera (BRL)
   * Localización inmediata para el ciudadano de Florianópolis.
   */
  const formattedTotalAmountLiteral = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(metrics.totalAuditedAmountNumeric);

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-2 duration-1000"
      aria-label="Dashboard de indicadores de auditoría"
    >
      {/* 1. INDICADOR DE VOLUMEN FINANCIERO */}
      <MetricCard
        iconNode={<BarChart3 className="w-5 h-5" />}
        labelLiteral={labels.totalInvestedLabel}
        valueLiteral={formattedTotalAmountLiteral}
      />

      {/* 2. INDICADOR DE RIESGO COGNITIVO (Anomaly Detection) */}
      <MetricCard
        iconNode={<AlertTriangle className="w-5 h-5" />}
        labelLiteral={labels.anomalyCountLabel}
        valueLiteral={metrics.anomalyCountQuantity.toString().padStart(2, '0')}
        isAlertVariantBoolean={metrics.anomalyCountQuantity > 0}
      />

      {/* 3. INDICADOR DE ALCANCE TERRITORIAL (Fase 8) */}
      <MetricCard
        iconNode={<Activity className="w-5 h-5" />}
        labelLiteral={labels.territorialReachLabel}
        valueLiteral="12/12" // TODO: Inyectar conteo real del territorial-engine
      />

      {/* 4. INDICADOR DE SALUD DEL ALGORITMO */}
      <MetricCard
        iconNode={<ShieldCheck className="w-5 h-5 text-green-500" />}
        labelLiteral={labels.aiAuditStatusLabel}
        valueLiteral="100%"
      />
    </section>
  );
};
