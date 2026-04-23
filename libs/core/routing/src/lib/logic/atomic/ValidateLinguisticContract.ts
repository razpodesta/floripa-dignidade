/**
 * @section Routing Logic - Linguistic Contract Guardian
 * @description Aparato de auditoría estructural que garantiza que los diccionarios
 * JSON cumplan estrictamente con el ADN (Zod Schema) definido en el búnker.
 *
 * Protocolo OEDP-V13.0 - Structural Integrity.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { z } from 'zod';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/**
 * Valida la integridad de un aparato lingüístico contra su esquema soberano.
 *
 * @param apparatusIdentifierLiteral - Nombre técnico del búnker (ej: "SHARED_UI").
 * @param contractSchema - Esquema de Zod que define la estructura obligatoria.
 * @param jsonDictionaryObject - Contenido crudo del archivo JSON de traducción.
 * @param targetLocaleLiteral - Idioma que se está auditando (pt-BR, es-ES, etc).
 */
export const ValidateLinguisticContract = (
  apparatusIdentifierLiteral: string,
  contractSchema: z.ZodObject<any>,
  jsonDictionaryObject: unknown,
  targetLocaleLiteral: string
): void => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. Auditoría de ADN (Safe Parsing)
  const validationResult = contractSchema.safeParse(jsonDictionaryObject);

  if (!validationResult.success) {
    const errorMetadata = validationResult.error.format();

    EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: 'INTEGRITY_GUARDIAN',
      operationCode: 'LINGUISTIC_CONTRACT_VIOLATION',
      correlationIdentifier,
      message: `Integridad de Aparato Fallida: [${apparatusIdentifierLiteral}] en [${targetLocaleLiteral}]`,
      contextMetadata: {
        apparatus: apparatusIdentifierLiteral,
        locale: targetLocaleLiteral,
        missingFields: errorMetadata
      }
    });

    // Lanzamos error crítico para detener el proceso (fail-fast en build/runtime)
    throw new Error(`[INTEGRITY_VIOLATION]: El diccionario del aparato ${apparatusIdentifierLiteral} está incompleto para el idioma ${targetLocaleLiteral}.`);
  }

  // 2. Reporte de Salud Estructural
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: 'INTEGRITY_GUARDIAN',
    operationCode: 'APPARATUS_CONTRACT_VERIFIED',
    correlationIdentifier,
    message: `Aparato íntegro: ${apparatusIdentifierLiteral} (${targetLocaleLiteral})`
  });
};
