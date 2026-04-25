/**
 * @section Routing Logic - Global Request Swarm Orchestrator
 * @description Orquestador superior de sensores de frontera. Ejecuta una tubería
 * de handlers cognitivos para procesar y enriquecer la solicitud en el Edge.
 *
 * Protocolo OEDP-V15.0 - Swarm Intelligence Pattern & Zero Noise.
 * Saneamiento: Eliminación de importaciones huérfanas tras atomización.
 *
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/** 🛡️ SANEAMIENTO Zenith: Importación exclusiva de ADN estructural */
import type { IRoutingContext } from '../schemas/RoutingContext.schema';

import { DetermineDeviceLocale } from './atomic/DetermineDeviceLocale';
import { ApplyLinguisticRedirection } from './handlers/ApplyLinguisticRedirection';

const ROUTING_MODULE_IDENTIFIER = 'GLOBAL_SWARM_ORCHESTRATOR';

/**
 * Ejecuta el enjambre de sensores sobre la petición entrante.
 * Orquesta la secuencia de handlers y gestiona el cortocircuito de respuestas.
 *
 * @param incomingRequest - Objeto de solicitud nativa capturado en el middleware.
 * @returns {Promise<NextResponse>} Respuesta final procesada y autorizada.
 */
export const GlobalRequestOrchestrator = async (
  incomingRequest: NextRequest
): Promise<NextResponse> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    ROUTING_MODULE_IDENTIFIER,
    'EDGE_SWARM_EXECUTION',
    correlationIdentifier,
    async () => {

      // 1. INFERENCIA DE CONTEXTO INICIAL
      // Se delega la lógica de fallback de idioma al átomo especializado.
      const routingContext: IRoutingContext = {
        correlationIdentifier,
        detectedLocale: DetermineDeviceLocale(incomingRequest.headers.get('accept-language')),
        clientMetadata: {
          ipAddressLiteral: 'unknown',
          userAgentLiteral: 'unknown'
        },
        isRequestAuthorizedBoolean: true,
      };

      // 2. DEFINICIÓN DE LA TUBERÍA (Pipeline) PLUG-AND-PLAY
      // El orden de los sensores define la prioridad de ejecución.
      const swarmSensorsCollection = [
        ApplyLinguisticRedirection,
        /**
         * @future_sensors
         * - EnforceSecurityHeaders (Protección XSS/CSP)
         * - ValidateRouteAuthority (RBAC en frontera)
         * - DetectBehavioralAnomaly (IA Anti-Bot)
         */
      ];

      // 3. EJECUCIÓN SERIAL DE SENSORES COGNITIVOS
      for (const executeSensorAction of swarmSensorsCollection) {
        const sensorResponseSignal = await executeSensorAction(incomingRequest, routingContext);

        /**
         * Lógica de Cortocircuito (Short-circuit):
         * Si un sensor genera una respuesta (ej. redirección), se aborta el enjambre.
         */
        if (sensorResponseSignal) {
          return sensorResponseSignal;
        }
      }

      // 4. RESPUESTA NOMINAL (Si ningún sensor solicitó interrupción)
      const nominalOutgoingResponse = NextResponse.next();

      // Inyección de cabeceras de trazabilidad forense
      nominalOutgoingResponse.headers.set('X-Floripa-Correlation-ID', correlationIdentifier);
      nominalOutgoingResponse.headers.set('X-Floripa-Detected-Locale', routingContext.detectedLocale);

      return nominalOutgoingResponse;
    }
  );
};
