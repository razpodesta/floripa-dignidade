/**
 * @section Routing Logic - Global Request Swarm Orchestrator
 * @description Orquestador superior de frontera encargado de coordinar el enjambre 
 * de sensores cognitivos en el Edge Runtime. Gestiona el ciclo de vida de la 
 * solicitud entrante, inyectando trazabilidad forense, detectando la soberanía 
 * lingüística y aplicando políticas de seguridad perimetral antes del renderizado.
 * 
 * Protocolo OEDP-V17.0 - Relentless Atomization & SRE Resilience.
 * SANEADO Zenith: Purga de Cronología (Next.js 16+), Resiliencia Catch-All y ISO Naming.
 * 
 * @author Raz Podestá - MetaShark Tech
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/* 1. Infraestructura Core: Telemetría y Excepciones (Atmos PascalCase) */
import { 
  InternalSystemException, 
  mapHttpErrorToException 
} from '@floripa-dignidade/exceptions';

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  ReportForensicException,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/* 2. Enjambre de Soporte y Registro de Sensores */
import { InitializeRoutingContext } from './atomic/InitializeRoutingContext';
import { SWARM_SENSORS_PIPELINE } from './constants/RoutingSensorRegistry';

/** Identificador técnico del orquestador para el Neural Sentinel. */
const ROUTING_ORCHESTRATOR_IDENTIFIER = 'ROUTING_EDGE_ORCHESTRATOR';

/**
 * Ejecuta el enjambre de sensores sobre la petición entrante en el Edge de Vercel.
 * Implementa un patrón de ejecución serial con capacidad de interrupción inmediata (Short-circuit).
 * 
 * @param incomingRequestSnapshot - Objeto de solicitud nativa capturado por el Middleware.
 * @returns {Promise<NextResponse>} Respuesta procesada, redirigida o autorizada para continuar.
 */
export const GlobalRequestOrchestrator = async (
  incomingRequestSnapshot: NextRequest
): Promise<NextResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    ROUTING_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_EDGE_PIPELINE_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        /**
         * FASE 1: INICIALIZACIÓN DE CONTEXTO (Identity & Metadata)
         * Generamos el ADN inicial de la solicitud (IP, User Agent, Locale).
         */
        const routingContext = InitializeRoutingContext(incomingRequestSnapshot, correlationIdentifier);

        /**
         * FASE 2: EJECUCIÓN DEL ENJAMBRE (Cognitive Sensor Triaje)
         * Recorremos el pipeline de sensores (Anti-bot, Redirección, Auth).
         * Si un sensor decide que la solicitud debe morir o desviarse, retorna un NextResponse.
         */
        for (const executeSensorAction of SWARM_SENSORS_PIPELINE) {
          const sensorResponseSignal = await executeSensorAction(
            incomingRequestSnapshot, 
            routingContext
          );

          if (sensorResponseSignal) {
            /** 
             * @section Inyección de Trazabilidad en Salidas Prematuras
             * Garantizamos que incluso los bloqueos de seguridad lleven el ID de rastreo.
             */
            sensorResponseSignal.headers.set('X-Floripa-Correlation-ID', correlationIdentifier);
            return sensorResponseSignal;
          }
        }

        /**
         * FASE 3: CIERRE DE CICLO NOMINAL
         * La solicitud ha superado todas las aduanas de frontera.
         */
        const nominalOutgoingResponse = NextResponse.next();

        // Inyección de Identidad Técnica para el App Router y el Ciudadano.
        nominalOutgoingResponse.headers.set('X-Floripa-Correlation-ID', correlationIdentifier);
        nominalOutgoingResponse.headers.set('X-Floripa-Detected-Locale', routingContext.detectedLocale);

        return nominalOutgoingResponse;

      } catch (caughtExecutionError: unknown) {
        /**
         * @section Gestión de Resiliencia Perimetral (Panic Mode)
         * Si el orquestador falla, capturamos el rastro forense antes de que 
         * el Edge Runtime emita un error no controlado.
         */
        const normalizedException = caughtExecutionError instanceof InternalSystemException
          ? caughtExecutionError
          : mapHttpErrorToException(500, 'EDGE_ORCHESTRATION_COLLAPSE', {
              originalErrorLiteral: caughtExecutionError instanceof Error 
                ? caughtExecutionError.message 
                : String(caughtExecutionError)
            });

        // Reporte automático al Neural Sentinel.
        ReportForensicException(normalizedException, correlationIdentifier);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: ROUTING_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'EDGE_PIPELINE_CRITICAL_FAULT',
          correlationIdentifier,
          message: 'Colapso catastrófico en el orquestador de ruteo perimetral.',
          contextMetadata: { ...normalizedException.runtimeContextSnapshot }
        });

        /**
         * Retornamos una respuesta de error estandarizada para evitar 
         * exponer las "tripas" del servidor al cliente.
         */
        return new NextResponse('INTERNAL_SERVICE_RELIABILITY_FAULT', { 
          status: 500,
          headers: { 'X-Floripa-Correlation-ID': correlationIdentifier }
        });
      }
    }
  );
};