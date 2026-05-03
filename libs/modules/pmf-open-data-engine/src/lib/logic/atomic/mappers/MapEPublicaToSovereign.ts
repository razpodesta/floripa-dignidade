/**
 * @section PMF Engine Logic - E-Pública to Sovereign Mapper (Orchestrator)
 * @description Átomo de lógica pura encargado de la homogenización de datos.
 * Coordina el enjambre de sub-mapeadores para transformar registros gubernamentales
 * en inteligencia civil inmutable y validada por Zod.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & ISO Technical Naming.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con Next.js 16,
 * sincronización de Branded Types y cumplimiento de Rutas Limpias.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { EmitTelemetrySignal, TraceExecutionTime } from '@floripa-dignidade/telemetry';

/* 1. ADN de Entrada y Salida (Verbatim Module Syntax - RUTAS LIMPIAS) */
/**
 * 🛡️ RESOLUCIÓN ZENITH: Se purgan las extensiones .js. El Bundler orquestado
 * por Next.js 16 resolverá los archivos .ts de forma nativa.
 */
import {
  PublicExpenditureSchema,
  type IPublicExpenditure,
  type TPublicExpenditureIdentifier,
  type TTerritorialTechnicalIdentifier,
} from '../../../schemas/sovereign/PublicExpenditure.schema';

import type { IEPublicaExpenseRaw } from '../../../schemas/protocol/EPublicaExpense.schema';

/* 2. Enjambre Atómico de Soporte (Mappers especializados) */
import { CalculateExecutedFinancialBalance } from './CalculateExecutedFinancialBalance';
import { MapBudgetTaxonomy } from './MapBudgetTaxonomy';
import { MapProviderIdentity } from './MapProviderIdentity';

/** Identificador técnico del aparato para el Neural Sentinel. */
const DATA_MAPPER_IDENTIFIER = 'EPUBLICA_SOVEREIGN_MAPPER';

/**
 * Mapea y purifica un registro individual de la Prefeitura.
 *
 * @param rawExpenseSnapshot - Registro extraído de la API de red.
 * @param correlationIdentifier - Identificador de trazabilidad del hilo superior.
 * @returns {Promise<IPublicExpenditure>} Entidad homogenizada y validada.
 */
export const MapEPublicaToSovereign = async (
  rawExpenseSnapshot: IEPublicaExpenseRaw,
  correlationIdentifier: string,
): Promise<IPublicExpenditure> => {
  return await TraceExecutionTime(
    DATA_MAPPER_IDENTIFIER,
    'MAP_GOVERNMENT_RECORD_TO_SOVEREIGN_ADN',
    correlationIdentifier,
    async () => {
      const { registro } = rawExpenseSnapshot;

      /**
       * FASE 1: INTELIGENCIA FINANCIERA Y FISCAL
       * Delegamos los cálculos y limpiezas a los átomos correspondientes.
       */
      const totalExecutedAmountNumeric = CalculateExecutedFinancialBalance(
        registro.listMovimentos,
        correlationIdentifier,
      );

      const providerMetadata = MapProviderIdentity(
        registro.fornecedor.pessoa.nome,
        registro.fornecedor.pessoa.cpfCnpj,
      );

      const functionalCategory = MapBudgetTaxonomy(
        registro.despesa.funcao.denominacao,
        registro.despesa.subfuncao.denominacao,
        registro.despesa.programa.denominacao,
      );

      /**
       * FASE 2: ENSAMBLAJE DE LA ENTIDAD SOBERANA
       * Construimos el snapshot inmutable para el Data Lake.
       */
      const sovereignExpenditureSnapshot = {
        /** 🛡️ CASTING SOBERANO: Vinculación con los tipos bridados nominales */
        expenditureIdentifier: `PMF-EXP-${registro.empenho.numero}` as TPublicExpenditureIdentifier,
        governmentTechnicalReferenceLiteral: registro.empenho.numero.toString(),

        /**
         * @future_integration
         * Vinculación geográfica basada en el rastro del IBGE (Fase 8).
         */
        targetTerritoryIdentifier: '4205407' as TTerritorialTechnicalIdentifier,

        totalExecutedAmountNumeric,
        providerMetadata,
        functionalCategory,
        serviceDescriptionLiteral: registro.empenho.objetoResumido.trim(),

        auditMetadata: {
          sourceSoftwareLiteral: 'E-PUBLICA',
          extractionTimestampISO: new Date().toISOString(),
          lastAnomalyScoreNumeric: 0,
        },
      };

      // 3. ADUANA DE ADN (Validación Final)
      const validationResult = PublicExpenditureSchema.safeParse(sovereignExpenditureSnapshot);

      if (!validationResult.success) {
        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: DATA_MAPPER_IDENTIFIER,
          operationCode: 'SOVEREIGN_MAPPING_VIOLATION',
          correlationIdentifier,
          message: 'Fallo al homogenizar registro: El ADN de salida viola el contrato.',
          contextMetadataSnapshot: { issuesCollection: validationResult.error.flatten() },
        });

        throw new Error('PMF_ENGINE.ERRORS.MAPPING_TRANSFORMATION_FAULT');
      }

      // 4. REPORTE DE ÉXITO (SRE Visibility)
      void EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: DATA_MAPPER_IDENTIFIER,
        operationCode: 'RECORD_NORMALIZATION_SUCCESS',
        correlationIdentifier,
        message: 'PMF_ENGINE.LOGS.RECORD_MAPPED',
        contextMetadataSnapshot: { id: sovereignExpenditureSnapshot.expenditureIdentifier },
      });

      return validationResult.data;
    },
  );
};