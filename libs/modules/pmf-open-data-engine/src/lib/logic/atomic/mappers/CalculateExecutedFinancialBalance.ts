/**
 * @section PMF Engine Logic - Financial Balance Atom
 * @description Átomo de lógica pura encargado de computar el saldo ejecutado real.
 * Analiza el flujo de movimientos financieros, gestionando la suma de pagos y
 * la resta de anulaciones (estornos) con precisión de punto flotante.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Verbatim Module Syntax.
 * SANEADO Zenith: Erradicación de importaciones híbridas y normalización ISO.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 1. ADN de Entrada (Protocolo de Movimientos) */
/**
 * 🛡️ SANEADO Zenith: Uso estricto de 'import type'.
 * Se elimina la dependencia de 'zod' en este archivo para optimizar el bundle.
 */
import type { IEPublicaMovementSnapshot } from '../../../schemas/protocol/EPublicaExpense.schema';

/** Identificador técnico del aparato para el Neural Sentinel. */
const FINANCIAL_ATOM_IDENTIFIER = 'FINANCIAL_BALANCE_CALCULATOR';

/**
 * Calcula el balance final ejecutado sumando algebraicamente todos los movimientos.
 * Implementa una reducción inmutable de alta performance.
 *
 * @param movementCollection - Lista de transacciones financieras del protocolo gubernamental.
 * @param correlationIdentifier - Identificador de trazabilidad del hilo superior.
 * @returns {number} Monto final resultante (Net Balance).
 */
export const CalculateExecutedFinancialBalance = (
  movementCollection: readonly IEPublicaMovementSnapshot[],
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): number => {

  /**
   * @section Algoritmo de Consolidación Financiera
   * Realizamos un acumulador puramente numérico basado en la propiedad 'valorMovimento'.
   */
  const finalExecutedBalanceNumeric = movementCollection.reduce(
    (financialBalanceAccumulator, currentMovementSnapshot) => {
      return financialBalanceAccumulator + currentMovementSnapshot.valorMovimento;
    },
    0
  );

  /**
   * @section Vigilancia SRE (Anomaly Detection)
   * Un balance negativo o exactamente cero tras varios movimientos es una
   * anomalía contable que el Neural Sentinel debe auditar.
   */
  const hasMovementsButNoBalanceBoolean = finalExecutedBalanceNumeric <= 0 && movementCollection.length > 0;

  if (hasMovementsButNoBalanceBoolean) {
    void EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: FINANCIAL_ATOM_IDENTIFIER,
      operationCode: 'SUSPICIOUS_NULL_BALANCE_DETECTED',
      correlationIdentifier,
      message: 'Se ha detectado un gasto con saldo neto cero o negativo tras ejecución física.',
      contextMetadata: {
        movementsQuantity: movementCollection.length,
        calculatedBalanceAmount: finalExecutedBalanceNumeric
      }
    });
  }

  return finalExecutedBalanceNumeric;
};
