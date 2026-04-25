/**
 * @section API Route Handler - Newsletter Subscription Gateway
 * @description Punto de entrada físico para la captación de ciudadanos en la red
 * de transparencia. Actúa como puente entre la interacción de la interfaz y
 * los átomos de lógica de dominio, gestionando validación y rastro forense.
 *
 * Protocolo OEDP-V16.0 - High Performance Edge Architecture.
 * Vision: Hyper-Holistic Resilience & Cloud Sovereign Integration.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/* 1. Infraestructura Core (PascalCase Atoms - Sorted Alphabetically) */
import {
  GlobalBaseException,
  mapHttpErrorToException,
} from '@floripa-dignidade/exceptions';

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  ReportForensicException,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 2. Lógica de Dominio (Modular Lego) */
import { ProcessNewsletterSubscriptionRequest } from '@floripa-dignidade/newsletter';

/**
 * @section Gobernanza de Ejecución
 * Cumplimiento ADR 0015: Ejecución Stateless en el Edge de Vercel para latencia < 50ms.
 */
export const runtime = 'edge';

/** Identificador técnico del sensor de frontera para el Neural Sentinel. */
const GATEWAY_IDENTIFIER = 'API_NEWSLETTER_SUBSCRIBE_GATEWAY';

/**
 * Manejador de solicitudes POST para el inicio del embudo de suscripción.
 *
 * @param incomingRequest - Objeto de solicitud nativa del motor Next.js.
 * @returns {Promise<NextResponse>} Respuesta estandarizada con rastro forense.
 */
export const POST = async (incomingRequest: NextRequest): Promise<NextResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    GATEWAY_IDENTIFIER,
    'GATEWAY_SUBSCRIBE_OPERATION',
    correlationIdentifier,
    async () => {
      try {
        // 1. EXTRACCIÓN DE ADN DE LA PETICIÓN
        const incomingRequestPayload = await incomingRequest.json();

        if (!incomingRequestPayload) {
          throw mapHttpErrorToException(400, 'PAYLOAD_VACIO_DETECTADO');
        }

        // 2. INVOCACIÓN DEL ORQUESTADOR LÓGICO
        // Delega la validación Zod, persistencia en Supabase y despacho de Resend.
        const processResultCorrelationId = await ProcessNewsletterSubscriptionRequest(
          incomingRequestPayload
        );

        // 3. RESPUESTA DE ÉXITO ZENITH
        return NextResponse.json(
          {
            isOperationSuccessfulBoolean: true,
            /** 🛡️ SANEADO: Uso de identificador semántico para i18n en el cliente */
            messageIdentifierLiteral: 'SUBSCRIPTION_REQUEST_PENDING_VERIFICATION',
            trackingIdentifier: processResultCorrelationId,
            occurrenceTimestampISO: new Date().toISOString(),
          },
          {
            status: 202, // Accepted: El proceso de verificación ha comenzado.
            headers: { 'X-Floripa-Correlation-ID': correlationIdentifier },
          }
        );

      } catch (caughtExecutionError: unknown) {
        // 4. GESTIÓN FORENSE DE FALLOS (Resilience Layer)

        /** 🛡️ SANEADO: Normalización de excepción con soporte para tipos 'unknown' */
        const normalizedException = caughtExecutionError instanceof GlobalBaseException
          ? caughtExecutionError
          : mapHttpErrorToException(500, 'UNEXPECTED_GATEWAY_FAILURE', {
              originalErrorLiteral: caughtExecutionError instanceof Error
                ? caughtExecutionError.message
                : String(caughtExecutionError),
            });

        // Reporte automático al Neural Sentinel
        ReportForensicException(normalizedException, correlationIdentifier);

        // Alerta de severidad crítica para errores de servidor (>= 500)
        if (normalizedException.httpStatusCode >= 500) {
          EmitTelemetrySignal({
            severityLevel: 'CRITICAL',
            moduleIdentifier: GATEWAY_IDENTIFIER,
            operationCode: 'GATEWAY_PROCESS_CRITICAL_FAULT',
            correlationIdentifier,
            message: 'TELEMETRY.SIGNALS.PROCESS_FAULT_DETECTED',
            contextMetadata: { ...normalizedException.runtimeContextSnapshot },
          });
        }

        return NextResponse.json(
          {
            isOperationSuccessfulBoolean: false,
            errorIdentifierLiteral: normalizedException.operationalErrorCode,
            forensicSnapshot: normalizedException.runtimeContextSnapshot,
          },
          {
            status: normalizedException.httpStatusCode,
            headers: { 'X-Floripa-Correlation-ID': correlationIdentifier },
          }
        );
      }
    }
  );
};
