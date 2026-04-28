/**
 * @section Messaging Logic - Direct Message Orchestrator
 * @description Orquestador de élite encargado de la transmisión de mensajes privados.
 * Coordina la validación de ADN, la transformación de datos, la inyección de 
 * seguridad y la persistencia cloud.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & SRP Perfection.
 * SANEADO Zenith: Integración de CreateSovereignDatabaseHeaders y resolución TS6059.
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
import { DirectMessageSchema } from '../../schemas/DirectMessage.schema';
import type { IDirectMessage } from '../../schemas/DirectMessage.schema';

/* 2. Enjambre Atómico (Internal Swarm) */
import { MapDirectMessageToPersistence } from '../mappers/MapDirectMessageToPersistence';
import { PersistDirectMessageTransaction } from './PersistDirectMessageTransaction';
import { CreateSovereignDatabaseHeaders } from './CreateSovereignDatabaseHeaders';

/** Identificador técnico del aparato para el Neural Sentinel. */
const MESSAGE_DISPATCHER_IDENTIFIER = 'DIRECT_MESSAGE_TRANSACTION_ORCHESTRATOR';

/**
 * Ejecuta el envío integral de un mensaje privado con soporte multimedia.
 * 
 * @param unvalidatedMessagePayloadSnapshot - Datos crudos del mensaje.
 * @returns {Promise<IDirectMessage>} Instancia del mensaje validado y persistido.
 */
export const SendDirectMessage = async (
  unvalidatedMessagePayloadSnapshot: unknown
): Promise<IDirectMessage> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA (Sovereign Secrets)
  const {
    SUPABASE_URL: cloudStorageUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    MESSAGE_DISPATCHER_IDENTIFIER,
    'EXECUTE_P2P_MESSAGE_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 2. ADUANA DE ADN (Safe Parsing)
        const validationResult = DirectMessageSchema.safeParse(unvalidatedMessagePayloadSnapshot);

        if (!validationResult.success) {
          /** Reporte de violación estructural antes del colapso */
          void EmitTelemetrySignal({
            severityLevel: 'WARNING',
            moduleIdentifier: MESSAGE_DISPATCHER_IDENTIFIER,
            operationCode: 'MESSAGE_CONTRACT_VIOLATION',
            correlationIdentifier,
            message: 'MESSAGING.ERRORS.MESSAGE_ADN_CORRUPTED',
            contextMetadata: { issues: validationResult.error.flatten() }
          });

          throw new ValidationException('ESTRUCTURA_DE_MENSAJE_INVALIDA', {
            issues: validationResult.error.flatten()
          });
        }

        const validatedMessage: IDirectMessage = validationResult.data;

        // 3. SEGURIDAD Y TRANSFORMACIÓN
        const databaseHeaders = CreateSovereignDatabaseHeaders(cloudSecurityKeySecret, 'representation');
        const databasePayload = MapDirectMessageToPersistence(validatedMessage, correlationIdentifier);

        // 4. PERSISTENCIA FÍSICA (Delegación Atómica)
        await PersistDirectMessageTransaction(
          cloudStorageUrlLiteral,
          databaseHeaders,
          databasePayload
        );

        // 5. REPORTE DE ÉXITO (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: MESSAGE_DISPATCHER_IDENTIFIER,
          operationCode: 'DIRECT_MESSAGE_SENT_SUCCESSFULLY',
          correlationIdentifier,
          message: 'MESSAGING.LOGS.DIRECT_MESSAGE_DISPATCHED',
          contextMetadata: {
            attachmentsQuantity: validatedMessage.attachedMediaIdentifiersCollection.length,
            isSensitive: validatedMessage.containsSensitiveInformationBoolean
          },
        });

        return validatedMessage;

      } catch (caughtError: unknown) {
        // 6. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        if (caughtError instanceof ValidationException) throw caughtError;

        const errorDescriptionLiteral = caughtError instanceof Error 
          ? caughtError.message 
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: MESSAGE_DISPATCHER_IDENTIFIER,
          operationCode: 'MESSAGE_DISPATCH_COLLAPSE',
          correlationIdentifier,
          message: 'Colapso crítico en el orquestador de mensajería directa.',
          contextMetadata: { errorTrace: errorDescriptionLiteral },
        });

        throw new InternalSystemException('FALLO_EN_PERSISTENCIA_DE_MENSAJERIA_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};