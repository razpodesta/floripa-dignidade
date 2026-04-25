/**
 * @section API Route Handler - Newsletter Confirmation Gateway
 * @description Orquestador soberano para la transición de ciudadanos de estado
 * PENDING a ACTIVE. Valida el desafío de identidad y gestiona la redirección localizada.
 *
 * Protocolo OEDP-V16.0 - High Performance Edge Architecture.
 * Vision: Hyper-Holistic UX & Cloud Sovereign Integration.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

/* 1. Infraestructura Core (PascalCase Atoms - Sorted Alphabetically) */
import {
  mapHttpErrorToException,
  ValidationException,
} from '@floripa-dignidade/exceptions';

import { DetermineDeviceLocale } from '@floripa-dignidade/routing';

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  ReportForensicException,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 2. Lógica de Dominio (Modular Lego) */
import { ActivateCloudSubscription } from '@floripa-dignidade/newsletter';

/**
 * @section Gobernanza de Ejecución
 * Cumplimiento ADR 0015: Ejecución Stateless en el Edge de Vercel para latencia < 50ms.
 */
export const runtime = 'edge';

/** Identificador técnico para el Neural Sentinel. */
const CONFIRMATION_GATEWAY_IDENTIFIER = 'API_NEWSLETTER_CONFIRM_GATEWAY';

/**
 * @name NewsletterConfirmationQuerySchema
 * @description Aduana de ADN para los parámetros de búsqueda de la URL.
 * SANEADO: Se utiliza el estándar UUID para el token de seguridad.
 */
const NewsletterConfirmationQuerySchema = z.object({
  token: z.string()
    .uuid({ message: 'INVALID_TOKEN_FORMAT' })
    .describe('Token de verificación generado en el registro inicial.'),
}).readonly();

/**
 * Manejador de solicitudes GET para la consolidación de suscripción.
 * Realiza el triaje de identidad y redirige al ciudadano a su destino final.
 *
 * @param incomingRequest - Objeto de solicitud nativa del motor Next.js.
 * @returns {Promise<NextResponse>} Redirección localizada basada en el resultado de activación.
 */
export const GET = async (incomingRequest: NextRequest): Promise<NextResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. INFERENCIA DE LOCALIZACIÓN PARA REDIRECCIÓN (UX Localization)
  const acceptLanguageHeaderLiteral = incomingRequest.headers.get('accept-language');
  const detectedLocaleIdentifier = DetermineDeviceLocale(acceptLanguageHeaderLiteral);

  return await TraceExecutionTime(
    CONFIRMATION_GATEWAY_IDENTIFIER,
    'GATEWAY_CONFIRMATION_ORCHESTRATION',
    correlationIdentifier,
    async () => {
      try {
        // 2. EXTRACCIÓN Y AUDITORÍA DE ADN (Search Parameters)
        const { searchParams } = new URL(incomingRequest.url);
        const queryValidationResult = NewsletterConfirmationQuerySchema.safeParse({
          token: searchParams.get('token'),
        });

        if (!queryValidationResult.success) {
          throw new ValidationException('TOKEN_DE_CONFIRMACION_INVALIDO', {
            validationIssues: queryValidationResult.error.flatten(),
          });
        }

        const { token: verificationTokenLiteral } = queryValidationResult.data;

        // 3. INVOCACIÓN DEL ÁTOMO DE ACTIVACIÓN (Soberanía Cloud)
        const activationResult = await ActivateCloudSubscription(verificationTokenLiteral);

        // 4. ORQUESTACIÓN DE SALIDA (Redirección Inteligente)
        if (activationResult.isActivationSuccessfulBoolean) {
          const targetSuccessUrlLiteral = new URL(
            `/${detectedLocaleIdentifier}/newsletter/welcome?status=success`,
            incomingRequest.url
          );

          EmitTelemetrySignal({
            severityLevel: 'INFO',
            moduleIdentifier: CONFIRMATION_GATEWAY_IDENTIFIER,
            operationCode: 'CITIZEN_ACTIVATION_REDIRECTION',
            correlationIdentifier,
            message: `Ciudadano activado exitosamente. Redirigiendo a zona de bienvenida [${detectedLocaleIdentifier}].`,
          });

          return NextResponse.redirect(targetSuccessUrlLiteral);
        }

        // Caso: Token válido pero no encontrado en base o ya utilizado (Anomalía)
        const targetFailureUrlLiteral = new URL(
          `/${detectedLocaleIdentifier}/newsletter/invalid-token`,
          incomingRequest.url
        );

        EmitTelemetrySignal({
          severityLevel: 'WARNING',
          moduleIdentifier: CONFIRMATION_GATEWAY_IDENTIFIER,
          operationCode: 'ACTIVATION_TOKEN_NOT_FOUND',
          correlationIdentifier,
          message: 'Intento de activación con token inexistente o expirado.',
        });

        return NextResponse.redirect(targetFailureUrlLiteral);

      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE FALLOS (Resilience Layer)

        /** 🛡️ SANEADO: Extracción segura de la excepción para reporte forense */
        const normalizedException = caughtError instanceof ValidationException
          ? caughtError
          : mapHttpErrorToException(500, 'UNEXPECTED_CONFIRMATION_FAULT', {
              originalErrorLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError),
            });

        // Reporte automático al Neural Sentinel
        ReportForensicException(normalizedException, correlationIdentifier);

        // Redirección de seguridad a página de error del sistema
        const targetErrorUrlLiteral = new URL(
          `/${detectedLocaleIdentifier}/error?code=CONFIRMATION_FAULT&trace=${correlationIdentifier}`,
          incomingRequest.url
        );

        return NextResponse.redirect(targetErrorUrlLiteral);
      }
    }
  );
};
