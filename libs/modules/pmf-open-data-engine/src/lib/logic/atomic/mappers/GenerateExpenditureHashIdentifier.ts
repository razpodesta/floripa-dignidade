/**
 * @section PMF Engine Logic - Expenditure Hash Generator
 * @description Átomo de lógica pura encargado de la integridad forense. Genera un
 * identificador único determinista utilizando el algoritmo SHA-256. Asegura que
 * cada registro de gasto sea inalterable y previene la duplicidad de datos en el
 * Data Lake ante múltiples sincronizaciones.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Cryptographic Integrity.
 * Vision: Immutable Civic Audit Trail.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 1. ADN de Destino (Branded Type) */
import type { ExpenditureIdentifier } from '../../../schemas/sovereign/PublicExpenditure.schema';

/** Identificador técnico del aparato para el Neural Sentinel. */
const CRYPTO_HASHER_IDENTIFIER = 'EXPENDITURE_FORENSIC_HASHER';

/**
 * @interface IHashSourceMetadata
 * @description Componentes base para la generación de la firma única.
 */
interface IHashSourceMetadata {
  readonly municipalitySlugLiteral: string;
  readonly fiscalYearNumeric: number;
  readonly governmentReferenceLiteral: string;
}

/**
 * Genera un identificador único basado en una suma de comprobación criptográfica.
 * Implementa ejecución asíncrona optimizada para el Edge de Vercel.
 *
 * @param metadata - Datos inmutables del registro gubernamental.
 * @param correlationIdentifier - ID de trazabilidad forense.
 * @returns {Promise<ExpenditureIdentifier>} Hash en formato hexadecimal con marca institucional.
 */
export const GenerateExpenditureHashIdentifier = async (
  metadata: IHashSourceMetadata,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<ExpenditureIdentifier> => {

  try {
    /**
     * 1. CONSTRUCCIÓN DE LA CADENA DE IDENTIDAD
     * Combinamos los factores que definen la unicidad del gasto.
     */
    const identityStringSource = [
      metadata.municipalitySlugLiteral.toLowerCase(),
      metadata.fiscalYearNumeric.toString(),
      metadata.governmentReferenceLiteral.trim()
    ].join('|');

    /**
     * 2. PROCESAMIENTO CRIPTOGRÁFICO (SHA-256)
     * Utilizamos la Web Crypto API nativa para garantizar latencia cero
     * y evitar dependencias de Node.js en el Edge.
     */
    const encoderInstance = new TextEncoder();
    const dataBuffer = encoderInstance.encode(identityStringSource);

    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

    // Transformación del buffer a cadena hexadecimal técnica
    const hashArrayCollection = Array.from(new Uint8Array(hashBuffer));
    const hexDigestLiteral = hashArrayCollection
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    /**
     * 3. SELLADO INSTITUCIONAL
     * El prefijo FD- (Floripa Dignidade) marca la autoridad del dato.
     */
    const finalSovereignIdentifier = `FD-${hexDigestLiteral.substring(0, 16).toUpperCase()}`;

    return finalSovereignIdentifier as ExpenditureIdentifier;

  } catch (caughtError: unknown) {
    /**
     * @section Gestión de Fallo Crítico (Resilience)
     * Si la API de criptografía falla, emitimos señal de emergencia.
     */
    void EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: CRYPTO_HASHER_IDENTIFIER,
      operationCode: 'CRYPTOGRAPHIC_ALGORITHM_FAULT',
      correlationIdentifier,
      message: 'No se pudo generar la firma de integridad del gasto público.',
      contextMetadata: { errorTrace: String(caughtError) }
    });

    /**
     * Fallback de seguridad: ID aleatorio pero marcado como no-determinista
     * para evitar detención del sistema, aunque requiere auditoría manual.
     */
    return `TEMP-UNCERTIFIED-${GenerateCorrelationIdentifier()}` as ExpenditureIdentifier;
  }
};
