/**
 * @section Routing Logic - Global Request Orchestrator
 * @description Punto de entrada soberano para la intercepción de solicitudes.
 * Coordina handlers de idioma, seguridad y metadatos con trazabilidad total.
 *
 * Protocolo OEDP-V13.0 - Higher Order Apparatus.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';
import { IRoutingContext } from '../schemas/RoutingContext.schema';
import { DetermineDeviceLocale } from './atomic/DetermineDeviceLocale';
import { AnalyzeRequestMetadata } from './atomic/AnalyzeRequestMetadata';

const ROUTING_MODULE_IDENTIFIER = 'GLOBAL_REQUEST_ORCHESTRATOR';

export const GlobalRequestOrchestrator = async (
  request: NextRequest
): Promise<NextResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. INICIALIZACIÓN DEL CONTEXTO SOBERANO
  let routingContext: IRoutingContext = {
    correlationIdentifier,
    detectedLocale: 'pt-BR', // Default inicial
    clientMetadata: {
      ipAddressLiteral: 'unknown',
      userAgentLiteral: 'unknown',
    },
    isRequestAuthorizedBoolean: true,
  };

  try {
    // 2. EJECUCIÓN DE HANDLERS ATÓMICOS (Pipeline)

    // A. Captura de metadatos técnicos
    routingContext = AnalyzeRequestMetadata(request.headers, routingContext);

    // B. Detección de localización
    const acceptLanguageHeader = request.headers.get('accept-language');
    routingContext = {
      ...routingContext,
      detectedLocale: DetermineDeviceLocale(acceptLanguageHeader)
    };

    // 3. TELEMETRÍA FORENSE DE LA SOLICITUD
    EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: ROUTING_MODULE_IDENTIFIER,
      operationCode: 'REQUEST_INTERCEPTION_SUCCESS',
      correlationIdentifier,
      message: `Solicitud procesada para locale: ${routingContext.detectedLocale}`,
      contextMetadata: {
        ...routingContext.clientMetadata,
        path: request.nextUrl.pathname
      }
    });

    // 4. LÓGICA DE REDIRECCIÓN (i18n Routing)
    const { pathname } = request.nextUrl;
    const pathnameIsMissingLocale = ['/pt-BR', '/es-ES', '/en-US'].every(
      (locale) => !pathname.startsWith(locale) && pathname !== locale
    );

    if (pathnameIsMissingLocale) {
      const localizedUrl = new URL(
        `/${routingContext.detectedLocale}${pathname}`,
        request.url
      );
      return NextResponse.redirect(localizedUrl);
    }

    return NextResponse.next();

  } catch (caughtError) {
    EmitTelemetrySignal({
      severityLevel: 'CRITICAL',
      moduleIdentifier: ROUTING_MODULE_IDENTIFIER,
      operationCode: 'REQUEST_INTERCEPTION_CRITICAL_FAILURE',
      correlationIdentifier,
      message: 'Fallo catastrófico en el orquestador de rutas.',
      contextMetadata: { error: String(caughtError) }
    });

    return NextResponse.next(); // Fallback de resiliencia: no bloquear al usuario
  }
};
