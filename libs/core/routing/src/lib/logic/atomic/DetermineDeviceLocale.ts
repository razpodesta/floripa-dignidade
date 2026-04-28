/**
 * @section Routing Logic - Device Locale Inerence Apparatus
 * @description Analiza las cabeceras de solicitud HTTP para determinar el idioma 
 * óptimo del ciudadano basándose en la configuración institucional. Implementa 
 * una estrategia de coincidencia exacta contra el ADN soberano y proporciona 
 * un fallback resiliente para garantizar la continuidad del tráfico.
 * 
 * Protocolo OEDP-V17.0 - Atomic Functional & Sovereign Type Safety.
 * SANEADO Zenith: Integración de Branded Types (ISupportedLocale) y Purga de Cronología.
 * 
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

import { SupportedLocaleSchema } from '../../schemas/RoutingConfiguration.schema';

/** 🛡️ SANEAMIENTO Zenith: Importación de ADN nominal inmutable */
import type { ISupportedLocale } from '../../schemas/RoutingConfiguration.schema';

/** Identificador técnico del sensor para el Neural Sentinel. */
const ROUTING_LOCALE_SENSOR_IDENTIFIER = 'CORE_ROUTING_LOCALE_SENSOR';

/**
 * Determina el identificador de localización soberano procesando la cabecera 'accept-language'.
 * 
 * @param acceptLanguageHeaderLiteral - Valor crudo de la cabecera de lenguaje del navegador.
 * @param fallbackLocaleIdentifier - Idioma por defecto (Default: pt-BR).
 * @returns {ISupportedLocale} El código de localización validado y tipado nominalmente.
 */
export const DetermineDeviceLocale = (
  acceptLanguageHeaderLiteral: string | null,
  fallbackLocaleIdentifier: ISupportedLocale = 'pt-BR' as ISupportedLocale
): ISupportedLocale => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. REPORTE DE INICIO DE INFERENCIA (SRE Visibility)
  void EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: ROUTING_LOCALE_SENSOR_IDENTIFIER,
    operationCode: 'LOCALE_INFERENCE_STARTED',
    correlationIdentifier,
    message: 'Iniciando algoritmo de detección de soberanía lingüística del dispositivo.'
  });

  // Guardia de seguridad: Si no hay rastro en la cabecera, retornamos el fallback tipado.
  if (!acceptLanguageHeaderLiteral) {
    return fallbackLocaleIdentifier;
  }

  try {
    /**
     * 2. ALGORITMO DE EMPAREJAMIENTO (ISO Matching)
     * Fragmentamos la cabecera (ej: "pt-BR,pt;q=0.9") para extraer los candidatos.
     */
    const preferredLocalesCollection = acceptLanguageHeaderLiteral
      .split(',')
      .map((segmentLiteral) => {
        const segmentPartsCollection = segmentLiteral.split(';');
        const targetLocaleCandidate = segmentPartsCollection[0];

        /** 🛡️ SANEADO: Cumplimiento de "noUncheckedIndexedAccess" */
        return targetLocaleCandidate ? targetLocaleCandidate.trim() : '';
      })
      .filter((purifiedLiteral) => purifiedLiteral.length > 0);

    /**
     * 3. ADUANA DE ADN (Safe Parsing contra Branded Type)
     * Buscamos el primer candidato que cumpla estrictamente con nuestro esquema.
     */
    for (const localeCandidateLiteral of preferredLocalesCollection) {
      const validationResult = SupportedLocaleSchema.safeParse(localeCandidateLiteral);

      if (validationResult.success) {
        const detectedLocale: ISupportedLocale = validationResult.data;

        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: ROUTING_LOCALE_SENSOR_IDENTIFIER,
          operationCode: 'LOCALE_MATCH_CONFIRMED',
          correlationIdentifier,
          message: `Coincidencia lingüística detectada: [${detectedLocale}]`,
          contextMetadata: { detectedLocale }
        });

        return detectedLocale;
      }
    }

  } catch (caughtError: unknown) {
    /**
     * @section Gestión de Anomalía Sensorial
     * Reportamos el fallo de parseo sin interrumpir el flujo del ciudadano.
     */
    const errorDescriptionLiteral = caughtError instanceof Error 
      ? caughtError.message 
      : String(caughtError);

    void EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: ROUTING_LOCALE_SENSOR_IDENTIFIER,
      operationCode: 'LOCALE_PARSING_ANOMALY',
      correlationIdentifier,
      message: 'Se detectó una irregularidad al procesar las señales de lenguaje del cliente.',
      contextMetadata: { errorTraceLiteral: errorDescriptionLiteral }
    });
  }

  // 4. RETORNO DE SOBERANÍA POR DEFECTO (Resilience)
  return fallbackLocaleIdentifier;
};