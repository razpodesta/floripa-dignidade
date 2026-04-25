/**
 * @section API Route Handler - WhatsApp Webhook Gateway
 * @description Receptor soberano de señales de Meta. Gestiona el desafío de
 * verificación institucional y la recepción segura de mensajes y estados.
 *
 * Protocolo OEDP-V16.0 - High Performance Infrastructure & Swarm Integration.
 * Vision: Cryptographic Integrity, Type Safety & Forensic Capture.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/* 1. Infraestructura Core (PascalCase Atoms - Sorted Alphabetically) */
import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';

import {
  GlobalBaseException,
  InternalSystemException
} from '@floripa-dignidade/exceptions';

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 2. Lógica de Dominio (WhatsApp Bunker) */
import {
  ProcessIncomingWhatsAppEvent,
  ValidateMetaSignature,
} from '@floripa-dignidade/whatsapp-communication-service';

/**
 * @section Gobernanza de Ejecución
 * Se utiliza el runtime de Node.js para soporte nativo de operaciones
 * con Buffer y validación criptográfica HMAC SHA256.
 */
export const runtime = 'nodejs';

/** Identificador técnico del sensor de frontera para auditoría. */
const WEBHOOK_IDENTIFIER = 'API_WHATSAPP_WEBHOOK_GATEWAY';

/**
 * Manejador GET: Protocolo de Verificación de Meta (Handshake).
 * Valida el token de suscripción configurado en el Dashboard de Desarrolladores.
 *
 * @param incomingRequest - Objeto de solicitud nativa.
 * @returns {Promise<NextResponse>} Respuesta con el desafío de Meta o error de identidad.
 */
export const GET = async (incomingRequest: NextRequest): Promise<NextResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();
  const { searchParams } = new URL(incomingRequest.url);

  // 1. CAPTURA DE ADN DE ENTORNO (Sovereign Infrastructure)
  const { WHATSAPP_VERIFY_TOKEN: systemVerifyTokenLiteral } = ValidateEnvironmentAduana();

  const modeLiteral = searchParams.get('hub.mode');
  const tokenLiteral = searchParams.get('hub.verify_token');
  const challengeLiteral = searchParams.get('hub.challenge');

  if (modeLiteral === 'subscribe' && tokenLiteral === systemVerifyTokenLiteral) {
    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: WEBHOOK_IDENTIFIER,
      operationCode: 'WEBHOOK_VERIFICATION_SUCCESS',
      correlationIdentifier,
      message: 'Desafío de verificación superado. Canal de Meta nominal.',
    });

    return new NextResponse(challengeLiteral, { status: 200 });
  }

  EmitTelemetrySignal({
    severityLevel: 'WARNING',
    moduleIdentifier: WEBHOOK_IDENTIFIER,
    operationCode: 'WEBHOOK_VERIFICATION_FAILED',
    correlationIdentifier,
    message: 'Intento de verificación rechazado: Identidad de token no validada.',
  });

  return new NextResponse('FORBIDDEN_SIGNAL', { status: 403 });
};

/**
 * Manejador POST: Recepción Física de Eventos Ciudadanos.
 * Realiza la validación criptográfica de la firma de Meta y delega el triaje al enjambre.
 *
 * @param incomingRequest - Objeto de solicitud nativa con el payload del evento.
 * @returns {Promise<NextResponse>} Confirmación de recepción (200 OK).
 */
export const POST = async (incomingRequest: NextRequest): Promise<NextResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    WEBHOOK_IDENTIFIER,
    'WEBHOOK_RECEIVE_ORCHESTRATION',
    correlationIdentifier,
    async () => {
      try {
        const rawRequestBodyLiteral = await incomingRequest.text();
        const xHubSignatureHeaderLiteral = incomingRequest.headers.get('x-hub-signature-256');

        if (!xHubSignatureHeaderLiteral) {
          throw new InternalSystemException('CABECERA_DE_INTEGRIDAD_FALTANTE');
        }

        // 2. ADUANA CRIPTOGRÁFICA (HMAC SHA256)
        // Se valida que el paquete provenga de Meta utilizando el App Secret soberano.
        const isIdentityLegitimateBoolean = ValidateMetaSignature(
          rawRequestBodyLiteral,
          xHubSignatureHeaderLiteral
        );

        if (!isIdentityLegitimateBoolean) {
          EmitTelemetrySignal({
            severityLevel: 'CRITICAL',
            moduleIdentifier: WEBHOOK_IDENTIFIER,
            operationCode: 'UNAUTHORIZED_WEBHOOK_SIGNAL',
            correlationIdentifier,
            message: 'Fallo de firma criptográfica detectado en la frontera de WhatsApp.',
          });
          return new NextResponse('UNAUTHORIZED_SIGNAL', { status: 401 });
        }

        // 3. PARSEO Y DELEGACIÓN AL ENJAMBRE (Triaje)
        let eventPayload: unknown;
        try {
          eventPayload = JSON.parse(rawRequestBodyLiteral);
        } catch (_caughtError) {
          throw new InternalSystemException('PAYLOAD_JSON_MALFORMADO');
        }

        // Invocación del orquestador cognitivo del dominio de WhatsApp
        await ProcessIncomingWhatsAppEvent(eventPayload);

        return new NextResponse('EVENT_ACKNOWLEDGED', { status: 200 });

      } catch (caughtError: unknown) {
        // 4. GESTIÓN FORENSE DE FALLOS (Resilience Layer)

        /** 🛡️ SANEADO: Normalización de excepción con soporte para tipos 'unknown' */
        const isStandardExceptionBoolean = caughtError instanceof GlobalBaseException;

        const normalizedException = isStandardExceptionBoolean
          ? (caughtError as GlobalBaseException)
          : mapHttpErrorToException(500, 'UNEXPECTED_WEBHOOK_FAULT', {
              originalErrorLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError),
            });

        // Reporte automático al Neural Sentinel
        EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: WEBHOOK_IDENTIFIER,
          operationCode: 'WEBHOOK_PROCESS_COLAPSE',
          correlationIdentifier,
          message: `Colapso en procesamiento de señal externa: ${normalizedException.message}`,
          contextMetadata: { ...normalizedException.runtimeContextSnapshot },
        });

        return new NextResponse('INTERNAL_SERVER_ERROR', { status: 500 });
      }
    }
  );
};

// --- SOPORTE TÉCNICO PARA MAPPING HTTP ---
function mapHttpErrorToException(statusCode: number, code: string, metadata: Record<string, unknown>) {
  return new InternalSystemException(`${code}_${statusCode}`, metadata);
}
