/**
 * @section PMF Engine Logic - Expenditure Hash Generator
 * @description Átomo encargado de la integridad forense. Genera un
 * identificador único determinista garantizando que cada registro 
 * de gasto sea inalterable ante múltiples sincronizaciones.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Cryptographic Integrity.
 * SANEADO Zenith: Atomización de sub-rutinas criptográficas y blindaje TS2724.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 1. ADN de Destino (Branded Type) */
/** 
 * 🛡️ FIX TS2724 & ESM: Sincronización de nomenclatura con el prefijo 'T' 
 * e inyección de extensión '.js' obligatoria.
 */
import type { TPublicExpenditureIdentifier } from '../../../schemas/sovereign/PublicExpenditure.schema.js';

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
 * 🔒 ATOMIZACIÓN PRIVADA: Motor Criptográfico
 * Aísla la complejidad de la Web Crypto API y la manipulación de Buffers.
 * Función pura: (String) -> (String Hexadecimal).
 */
const ComputeSha256HexLiteral = async (sourceLiteral: string): Promise<string> => {
  const encoderInstance = new TextEncoder();
  const dataBuffer = encoderInstance.encode(sourceLiteral);

  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

  const hashArrayCollection = Array.from(new Uint8Array(hashBuffer));
  return hashArrayCollection
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Genera un identificador único basado en una suma de comprobación criptográfica.
 * Implementa ejecución asíncrona optimizada para el Edge de Vercel.
 *
 * @param metadata - Datos inmutables del registro gubernamental.
 * @param correlationIdentifier - ID de trazabilidad forense.
 * @returns {Promise<TPublicExpenditureIdentifier>} Hash en formato hexadecimal con marca institucional.
 */
export const GenerateExpenditureHashIdentifier = async (
  metadata: IHashSourceMetadata,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<TPublicExpenditureIdentifier> => {

  try {
    // 1. CONSTRUCCIÓN DE LA CADENA DE IDENTIDAD (Business Logic)
    const identityStringSourceLiteral =[
      metadata.municipalitySlugLiteral.toLowerCase(),
      metadata.fiscalYearNumeric.toString(),
      metadata.governmentReferenceLiteral.trim()
    ].join('|');

    // 2. PROCESAMIENTO CRIPTOGRÁFICO (Delegación Atómica)
    const hexDigestLiteral = await ComputeSha256HexLiteral(identityStringSourceLiteral);

    // 3. SELLADO INSTITUCIONAL
    const finalSovereignIdentifierLiteral = `FD-${hexDigestLiteral.substring(0, 16).toUpperCase()}`;

    /** 🛡️ CASTING SOBERANO: Elevación del string al tipo bridado requerido */
    return finalSovereignIdentifierLiteral as TPublicExpenditureIdentifier;

  } catch (caughtError: unknown) {
    // 4. GESTIÓN DE FALLO CRÍTICO (Resilience)
    void EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: CRYPTO_HASHER_IDENTIFIER,
      operationCode: 'CRYPTOGRAPHIC_ALGORITHM_FAULT',
      correlationIdentifier,
      message: 'No se pudo generar la firma de integridad del gasto público.',
      /** 🛡️ SANEADO: Alineación con el estándar OEDP-V17 (Snapshot) */
      contextMetadataSnapshot: { errorTrace: String(caughtError) }
    });

    /**
     * Fallback de seguridad: ID aleatorio pero marcado como no-determinista
     * para evitar detención del sistema, aunque requiere auditoría manual.
     */
    return `TEMP-UNCERTIFIED-${GenerateCorrelationIdentifier()}` as TPublicExpenditureIdentifier;
  }
};