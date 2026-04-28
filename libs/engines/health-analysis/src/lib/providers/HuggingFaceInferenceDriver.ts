/**
 * @section AI Providers - Hugging Face Edge Driver
 * @description Adaptador físico para la comunicación con modelos de inteligencia
 * artificial (SLM) alojados en Hugging Face Inference API. Implementa el protocolo
 * de transporte seguro y gestión de rastro telemétrico de red.
 *
 * Protocolo OEDP-V16.0 - High Performance & Cloud Sovereign (ADR 0015).
 * SANEADO Zenith: Transición de Mock a I/O real con soporte Edge Runtime.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
} from '@floripa-dignidade/telemetry';

/**
 * @interface IGlobalEnvironmentReference
 * @description Puente de tipos para el acceso a secretos de IA sin dependencias circulares.
 */
interface IGlobalEnvironmentReference {
  readonly process?: {
    readonly env: Record<string, string | undefined>;
  };
}

/** Identificador técnico del driver para el Neural Sentinel. */
const HUGGING_FACE_DRIVER_IDENTIFIER = 'HUGGING_FACE_INFERENCE_DRIVER';

/**
 * Ejecuta una petición de inferencia física hacia el proveedor externo.
 *
 * @param unvalidatedIntelligencePayloadSnapshot - Datos a procesar por el modelo de IA.
 * @returns {Promise<unknown>} Respuesta cruda del proveedor para ser procesada por la aduana.
 */
export const executeHuggingFaceInference = async (
  unvalidatedIntelligencePayloadSnapshot: unknown
): Promise<unknown> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();
  const globalContext = globalThis as unknown as IGlobalEnvironmentReference;

  /**
   * @section Captura de Infraestructura
   * SANEADO: Se extraen los secretos de IA validados por el enjambre.
   */
  const huggingFaceApiTokenSecret = globalContext.process?.env['HUGGING_FACE_API_TOKEN'];
  const huggingFaceModelUrlLiteral = globalContext.process?.env['HUGGING_FACE_MODEL_URL'];

  /** Fallback preventivo si la infraestructura no está cableada */
  if (!huggingFaceApiTokenSecret || !huggingFaceModelUrlLiteral) {
    return {
      analysisId: correlationIdentifier,
      confidenceScore: 0,
      observation: 'HEALTH_ANALYSIS.ERRORS.INFRASTRUCTURE_UNAVAILABLE',
      suggestedAction: 'NONE',
      detectedAnomalies: ['MISSING_HF_CONFIGURATION'],
      metadata: { statusLiteral: 'FALLBACK_TRIGGERED' }
    };
  }

  try {
    const payloadStringifiedLiteral = JSON.stringify(unvalidatedIntelligencePayloadSnapshot);

    // REPORTE DE SALIDA (Network Outbound)
    EmitTelemetrySignal({
      severityLevel: 'DEBUG',
      moduleIdentifier: HUGGING_FACE_DRIVER_IDENTIFIER,
      operationCode: 'INFERENCE_REQUEST_DISPATCHED',
      correlationIdentifier,
      message: 'HEALTH_ANALYSIS.LOGS.NETWORK_REQUEST_STARTED',
      contextMetadata: {
        payloadSizeBytesQuantity: payloadStringifiedLiteral.length,
        targetModelUrlLiteral: huggingFaceModelUrlLiteral
      }
    });

    /**
     * @section Ejecución Física (Fetch Standard)
     * Implementa timeout agresivo para evitar bloqueos en el Edge.
     */
    const inferenceResponse = await fetch(huggingFaceModelUrlLiteral, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiTokenSecret}`,
        'Content-Type': 'application/json',
        'X-Floripa-Correlation-ID': correlationIdentifier
      },
      body: payloadStringifiedLiteral,
      signal: AbortSignal.timeout(10000) // 10 segundos de límite soberano
    });

    if (!inferenceResponse.ok) {
      throw new Error(`HF_PROVIDER_ERROR_${inferenceResponse.status}`);
    }

    const rawResultPayload = await inferenceResponse.json();

    return {
      ...rawResultPayload,
      analysisId: correlationIdentifier, // Inyectamos trazabilidad local
      metadata: {
        ...(rawResultPayload.metadata ?? {}),
        providerStatusNumeric: inferenceResponse.status
      }
    };

  } catch (caughtError: unknown) {
    const errorDescriptionLiteral = caughtError instanceof Error
      ? caughtError.message
      : String(caughtError);

    // REPORTE DE FALLO DE TRANSPORTE
    EmitTelemetrySignal({
      severityLevel: 'ERROR',
      moduleIdentifier: HUGGING_FACE_DRIVER_IDENTIFIER,
      operationCode: 'INFERENCE_NETWORK_FAULT',
      correlationIdentifier,
      message: 'HEALTH_ANALYSIS.ERRORS.PROVIDER_COMMUNICATION_FAILED',
      contextMetadata: { errorTraceLiteral: errorDescriptionLiteral }
    });

    /**
     * Retornamos un objeto de fallo compatible con el esquema de salida
     * para que el orquestador pueda tomar decisiones de contingencia.
     */
    return {
      analysisId: correlationIdentifier,
      confidenceScore: 0,
      observation: 'HEALTH_ANALYSIS.ERRORS.INFERENCE_TIMEOUT_OR_FAULT',
      suggestedAction: 'RESTART_MODULE',
      detectedAnomalies: [errorDescriptionLiteral],
      metadata: { isFaultyBoolean: true }
    };
  }
};
