/**
 * @section Messaging Logic - Push Notification Orchestrator
 * @description Orquestador de élite encargado de la gestión de alertas PWA.
 * Coordina la validación de ADN visual, la detección de tokens de hardware
 * y el despacho físico mediante el enjambre de átomos especializados.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & SRP Perfection.
 * SANEADO Zenith: Resolución de errores TS6059 e inyección de cabeceras soberanas.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException, ValidationException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import { PushPayloadSchema } from '../../schemas/PushPayload.schema';
import type { IPushPayload } from '../../schemas/PushPayload.schema';

/* 2. Enjambre Atómico Interno (Swiss-Watch Swarm) */
import { GetCitizenPushToken } from '../queries/GetCitizenPushToken';
import { TransmitPushSignal } from './TransmitPushSignal';
import { CreateSovereignDatabaseHeaders } from './CreateSovereignDatabaseHeaders';

/** Identificador técnico del aparato para el Neural Sentinel. */
const PUSH_DISPATCHER_IDENTIFIER = 'WEB_PUSH_GATEWAY_ORCHESTRATOR';

/**
 * Ejecuta el despacho integral de una notificación Push al dispositivo del ciudadano.
 * 
 * @param targetCitizenIdentifier - UUID del destinatario legítimo.
 * @param unvalidatedPushPayloadSnapshot - Datos visuales de la alerta.
 * @returns {Promise<boolean>} Verdadero si la señal fue aceptada por el Gateway.
 */
export const DispatchPushNotification = async (
  targetCitizenIdentifier: string,
  unvalidatedPushPayloadSnapshot: unknown
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA (Aislamiento de Hardware)
  const {
    SUPABASE_URL: cloudUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    PUSH_DISPATCHER_IDENTIFIER,
    'EXECUTE_PUSH_NOTIFICATION_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 2. ADUANA DE ADN (Safe Parsing)
        const validationResult = PushPayloadSchema.safeParse(unvalidatedPushPayloadSnapshot);

        if (!validationResult.success) {
          /** Reporte de violación estructural antes del colapso */
          void EmitTelemetrySignal({
            severityLevel: 'WARNING',
            moduleIdentifier: PUSH_DISPATCHER_IDENTIFIER,
            operationCode: 'PUSH_ADN_CONTRACT_VIOLATION',
            correlationIdentifier,
            message: 'MESSAGING.ERRORS.MESSAGE_ADN_CORRUPTED',
            contextMetadata: { issues: validationResult.error.flatten() }
          });

          throw new ValidationException('CONTRATO_PUSH_INVALIDO', {
            issues: validationResult.error.flatten()
          });
        }

        const validatedPayload: IPushPayload = validationResult.data;

        // 3. SENSOR DE PRESENCIA (Recuperación de Token de Hardware)
        const activePushTokenLiteral = await GetCitizenPushToken(
          targetCitizenIdentifier,
          cloudUrlLiteral,
          cloudSecurityKeySecret
        );

        if (!activePushTokenLiteral) {
          void EmitTelemetrySignal({
            severityLevel: 'INFO',
            moduleIdentifier: PUSH_DISPATCHER_IDENTIFIER,
            operationCode: 'CITIZEN_DEVICE_UNREACHABLE',
            correlationIdentifier,
            message: 'Notificación cancelada: El ciudadano no posee PWA instalada o autorizada.',
          });
          return false;
        }

        // 4. SEGURIDAD Y TRANSMISIÓN (Delegación Atómica)
        const securityHeaders = CreateSovereignDatabaseHeaders(cloudSecurityKeySecret, 'minimal');

        await TransmitPushSignal(
          cloudUrlLiteral,
          securityHeaders,
          activePushTokenLiteral,
          validatedPayload,
          correlationIdentifier
        );

        // 5. REPORTE DE ÉXITO (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: PUSH_DISPATCHER_IDENTIFIER,
          operationCode: 'PUSH_DELIVERY_CONFIRMED',
          correlationIdentifier,
          message: 'Señal de alerta entregada al sistema operativo del ciudadano.',
          contextMetadata: { citizenId: targetCitizenIdentifier }
        });

        return true;

      } catch (caughtError: unknown) {
        // 6. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        if (caughtError instanceof ValidationException) throw caughtError;

        const errorDescriptionLiteral = caughtError instanceof Error 
          ? caughtError.message 
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: PUSH_DISPATCHER_IDENTIFIER,
          operationCode: 'PUSH_FLOW_COLLAPSE',
          correlationIdentifier,
          message: 'Colapso crítico en el orquestador de notificaciones Push.',
          contextMetadata: { errorTrace: errorDescriptionLiteral },
        });

        throw new InternalSystemException('FALLO_EN_DESPACHO_PUSH_SRE', {
          originalError: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};