/**
 * @section PMF Engine Logic - E-Pública to Sovereign Mapper
 * @description Átomo de lógica pura encargado de la homogenización de datos.
 * Transforma el registro crudo del protocolo gubernamental en el ADN de Gasto Público
 * Soberano. Realiza la agregación de flujos de caja, normaliza identificadores
 * fiscales y prepara la entidad para el cruzamiento territorial.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Mathematical Precision.
 * Vision: Data Sanitization & Integrity for Civic Auditing.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/* 1. ADN de Entrada (Protocolo Crudo) */
import type { IEPublicaExpenseRaw } from '../../../schemas/protocol/EPublicaExpense.schema';

/* 2. ADN de Salida (Soberanía Normalizada) */
import { PublicExpenditureSchema } from '../../../schemas/sovereign/PublicExpenditure.schema';
import type {
  IPublicExpenditure,
  ExpenditureIdentifier,
  ProviderCnpj
} from '../../../schemas/sovereign/PublicExpenditure.schema';

/** Identificador técnico del aparato para el Neural Sentinel. */
const DATA_MAPPER_IDENTIFIER = 'EPUBLICA_SOVEREIGN_MAPPER';

/**
 * Mapea y purifica un registro individual de la Prefeitura.
 *
 * @param rawExpenseSnapshot - Registro extraído directamente de la API de red.
 * @param correlationIdentifier - Identificador de trazabilidad del hilo superior.
 * @returns {Promise<IPublicExpenditure>} Entidad homogenizada validada por la aduana Zod.
 */
export const MapEPublicaToSovereign = async (
  rawExpenseSnapshot: IEPublicaExpenseRaw,
  correlationIdentifier: string
): Promise<IPublicExpenditure> => {

  return await TraceExecutionTime(
    DATA_MAPPER_IDENTIFIER,
    'MAP_GOVERNMENT_RECORD_TO_SOVEREIGN_ADN',
    correlationIdentifier,
    async () => {
      const { registro } = rawExpenseSnapshot;

      /**
       * 1. AGREGACIÓN FINANCIERA (Liquidity Calculus)
       * Sumamos todos los movimientos de caja asociados al empenho.
       * Esto nos da el valor real EJECUTADO, no solo el valor previsto.
       */
      const totalExecutedAmountNumeric = registro.listMovimentos.reduce(
        (accumulator, movement) => accumulator + movement.valorMovimento,
        0
      );

      /**
       * 2. SANEAMIENTO DE IDENTIDAD FISCAL (CNPJ Normalization)
       * Eliminamos puntos, guiones y barras para obtener los 14 dígitos puros.
       */
      const purifiedCnpjLiteral = registro.fornecedor.pessoa.cpfCnpj.replace(/\D/g, '');

      /**
       * 3. CONSTRUCCIÓN DE LA ENTIDAD SOBERANA
       * Mapeamos la jerarquía técnica de la Prefeitura a nuestro ADN plano.
       */
      const sovereignExpenditureSnapshot = {
        /** Generamos un ID basado en el número de empenho y ejercicio para evitar duplicados */
        expenditureIdentifier: `PMF-EXP-${registro.empenho.numero}` as ExpenditureIdentifier,

        governmentTechnicalReferenceLiteral: registro.empenho.numero.toString(),

        /**
         * @future_integration
         * TODO: Invocar LinkExpenditureToTerritory.ts para determinar el ID del IBGE.
         * De momento, se asigna el ID global de Florianópolis.
         */
        targetTerritoryIdentifier: '4205407',

        totalExecutedAmountNumeric,

        providerMetadata: {
          legalNameLiteral: registro.fornecedor.pessoa.nome,
          taxIdentificationNumber: purifiedCnpjLiteral as ProviderCnpj,
        },

        functionalCategory: {
          functionNameLiteral: registro.despesa.funcao.denominacao,
          subFunctionNameLiteral: registro.despesa.subfuncao.denominacao,
          programNameLiteral: registro.despesa.programa.denominacao,
        },

        serviceDescriptionLiteral: registro.empenho.objetoResumido.trim(),

        auditMetadata: {
          sourceSoftwareLiteral: 'E-PUBLICA',
          extractionTimestampISO: new Date().toISOString(),
          lastAnomalyScoreNumeric: 0,
        },
      };

      // 4. ADUANA DE ADN (Validación de Salida)
      const validationResult = PublicExpenditureSchema.safeParse(sovereignExpenditureSnapshot);

      if (!validationResult.success) {
        void EmitTelemetrySignal({
          severityLevel: 'ERROR',
          moduleIdentifier: DATA_MAPPER_IDENTIFIER,
          operationCode: 'SOVEREIGN_MAPPING_VIOLATION',
          correlationIdentifier,
          message: 'Fallo al homogenizar el registro gubernamental: ADN de salida corrupto.',
          contextMetadata: {
            issues: validationResult.error.flatten(),
            governmentId: registro.empenho.numero
          }
        });

        throw new Error('MAPPING_TRANSFORMATION_FAULT');
      }

      // 5. REPORTE DE TRAZABILIDAD
      void EmitTelemetrySignal({
        severityLevel: 'DEBUG',
        moduleIdentifier: DATA_MAPPER_IDENTIFIER,
        operationCode: 'RECORD_SUCCESSFULLY_NORMALIZED',
        correlationIdentifier,
        message: 'PMF_ENGINE.LOGS.RECORD_MAPPED',
        contextMetadata: { id: sovereignExpenditureSnapshot.expenditureIdentifier }
      });

      return validationResult.data;
    }
  );
};
