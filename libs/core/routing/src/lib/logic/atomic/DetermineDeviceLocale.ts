/**
 * @section Routing Logic - Device Locale Detection Apparatus
 * @description Analiza las cabeceras de solicitud HTTP para determinar el idioma
 * óptimo del ciudadano. Implementa una estrategia de coincidencia exacta y
 * fallback resiliente.
 *
 * Protocolo OEDP-V13.0 - Atomic Functional & Zero Abbreviations.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';
import {
  ISupportedLocale, // SANEADO: Ordenado alfabéticamente (I < S)
  SupportedLocaleSchema,
} from '../../schemas/RoutingConfiguration.schema';

/** Identificador técnico del búnker de ruteo para el Neural Sentinel. */
const ROUTING_ENGINE_IDENTIFIER = 'CORE_ROUTING_ENGINE';

/**
 * Determina el locale soberano procesando la cabecera 'accept-language'.
 *
 * @param acceptLanguageHeaderLiteral - Valor crudo de la cabecera de lenguaje del navegador.
 * @param fallbackLocaleIdentifier - Idioma por defecto definido en la configuración (Default: pt-BR).
 * @returns El código de localización validado por el esquema soberano.
 */
export const DetermineDeviceLocale = (
  acceptLanguageHeaderLiteral: string | null,
  fallbackLocaleIdentifier: ISupportedLocale = 'pt-BR'
): ISupportedLocale => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. TELEMETRÍA DE PROCESAMIENTO (Audit Start)
  EmitTelemetrySignal({
    severityLevel: 'INFO',
    moduleIdentifier: ROUTING_ENGINE_IDENTIFIER,
    operationCode: 'LOCALE_DETECTION_PROCESS_STARTED',
    correlationIdentifier,
    message: 'Iniciando algoritmo de inferencia de lenguaje del dispositivo.'
  });

  // Guardia de seguridad: Si no hay cabecera, retornamos la soberanía por defecto.
  if (!acceptLanguageHeaderLiteral) {
    return fallbackLocaleIdentifier;
  }

  try {
    /**
     * 2. ALGORITMO DE EMPAREJAMIENTO (Matching Logic)
     * Parseamos la cabecera que suele venir como: "pt-BR,pt;q=0.9,en-US;q=0.8"
     */
    const preferredLocalesCollection = acceptLanguageHeaderLiteral
      .split(',')
      .map((segment) => segment.split(';')[0].trim());

    /**
     * Buscamos la primera coincidencia exacta dentro de nuestro ADN de idiomas soportados.
     */
    for (const localeCandidateLiteral of preferredLocalesCollection) {
      const validationResult = SupportedLocaleSchema.safeParse(localeCandidateLiteral);

      if (validationResult.success) {
        const detectedLocale = validationResult.data;

        EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: ROUTING_ENGINE_IDENTIFIER,
          operationCode: 'LOCALE_MATCH_FOUND',
          correlationIdentifier,
          message: `Coincidencia detectada exitosamente: ${detectedLocale}`,
          contextMetadata: { detectedLocale }
        });

        return detectedLocale;
      }
    }

    /**
     * @todo Futura Mejora: Implementar 'Fuzzy Language Matcher'
     * (ej: si el dispositivo pide 'es-AR' y solo tenemos 'es-ES', retornar 'es-ES').
     */

  } catch (caughtError) {
    EmitTelemetrySignal({
      severityLevel: 'WARNING',
      moduleIdentifier: ROUTING_ENGINE_IDENTIFIER,
      operationCode: 'LOCALE_PARSING_ANOMALY',
      correlationIdentifier,
      message: 'Se detectó una anomalía al procesar las cabeceras de lenguaje.',
      contextMetadata: { error: String(caughtError) }
    });
  }

  // 3. RETORNO DE FALLBACK (Resilience)
  return fallbackLocaleIdentifier;
};
