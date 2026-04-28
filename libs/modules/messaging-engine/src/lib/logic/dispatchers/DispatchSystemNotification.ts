/**
 * @section Messaging Logic - System Notification Dispatcher
 * @description Orquestador de élite encargado de la emisión física de alertas 
 * institucionales. Gestiona la validación de ADN, la persistencia en el Data Lake 
 * (Supabase) y la emisión de señales telemétricas para auditoría forense.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Inyección de CreateSovereignDatabaseHeaders y resolución de TS6059.
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
import { SystemNotificationSchema } from '../../schemas/SystemNotification.schema';
import type { ISystemNotification } from '../../schemas/SystemNotification.schema';

/* 2. Átomos de Infraestructura Internos (Atomic DRY) */
import { CreateSovereignDatabaseHeaders } from './CreateSovereignDatabaseHeaders';

/** Identificador técnico del aparato para el Neural Sentinel. */
const NOTIFICATION_DISPATCHER_IDENTIFIER = 'SYSTEM_NOTIFICATION_DISPATCHER';

/**
 * Ejecuta el despacho de una notificación del sistema hacia un ciudadano o grupo.
 * Implementa un patrón de ejecución Stateless optimizado para el Edge Runtime.
 *
 * @param unvalidatedNotificationPayloadSnapshot - Datos crudos de la alerta.
 * @returns {Promise<ISystemNotification>} Instancia de la notificación persistida y validada.
 * @throws {ValidationException} Si el contrato de datos es violado.
 * @throws {InternalSystemException} Si la infraestructura cloud no responde.
 */
export const DispatchSystemNotification = async (
  unvalidatedNotificationPayloadSnapshot: unknown
): Promise<ISystemNotification> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  /** 
   * 1. CAPTURA DE INFRAESTRUCTURA (Sovereign Secrets)
   * SANEADO: La aduana garantiza la existencia de las llaves maestras.
   */
  const {
    SUPABASE_URL: cloudStorageUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    NOTIFICATION_DISPATCHER_IDENTIFIER,
    'EXECUTE_NOTIFICATION_DISPATCH_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        // 2. ADUANA DE ADN (Safe Parsing)
        const validationResult = SystemNotificationSchema.safeParse(
          unvalidatedNotificationPayloadSnapshot
        );

        if (!validationResult.success) {
          /** 🛡️ SANEADO: Reporte de violación estructural antes del colapso */
          void EmitTelemetrySignal({
            severityLevel: 'CRITICAL',
            moduleIdentifier: NOTIFICATION_DISPATCHER_IDENTIFIER,
            operationCode: 'NOTIFICATION_SCHEMA_VIOLATION',
            correlationIdentifier,
            message: 'MESSAGING.ERRORS.MESSAGE_ADN_CORRUPTED',
            contextMetadata: {
              validationIssuesCollection: validationResult.error.flatten()
            }
          });

          throw new ValidationException('CONTRATO_DE_NOTIFICACION_VIOLADO', {
            issues: validationResult.error.flatten()
          });
        }

        const validatedNotificationData: ISystemNotification = validationResult.data;

        /**
         * 3. PERSISTENCIA CLOUD (PostgREST Protocol)
         * SANEADO Zenith: Uso del átomo 'CreateSovereignDatabaseHeaders' para 
         * cumplimiento estricto del protocolo de seguridad institucional.
         */
        const cloudPersistenceResponse = await fetch(
          `${cloudStorageUrlLiteral}/rest/v1/system_notifications_ledger`,
          {
            method: 'POST',
            headers: {
              ...CreateSovereignDatabaseHeaders(cloudSecurityKeySecret, 'representation')
            },
            body: JSON.stringify({
              notification_id: validatedNotificationData.notificationIdentifier,
              recipient_id: validatedNotificationData.targetRecipientIdentifierLiteral,
              priority_level: validatedNotificationData.notificationPriorityLiteral,
              category_tag: validatedNotificationData.notificationCategoryLiteral,
              headline_text: validatedNotificationData.headlineTitleLiteral,
              body_content: validatedNotificationData.contentBodyLiteral,
              action_route: validatedNotificationData.targetActionRouteLiteral,
              interaction_status: validatedNotificationData.interactionStatusLiteral,
              dispatched_at: validatedNotificationData.dispatchTimestampISO,
              correlation_id: correlationIdentifier,
            }),
          }
        );

        if (!cloudPersistenceResponse.ok) {
          throw new Error(`CLOUD_PROVIDER_FAULT_${cloudPersistenceResponse.status}`);
        }

        // 4. REPORTE DE ÉXITO OPERACIONAL (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: NOTIFICATION_DISPATCHER_IDENTIFIER,
          operationCode: 'NOTIFICATION_DISPATCH_NOMINAL',
          correlationIdentifier,
          message: 'MESSAGING.LOGS.NOTIFICATION_BROADCAST_SUCCESS',
          contextMetadata: {
            recipientId: validatedNotificationData.targetRecipientIdentifierLiteral,
            priorityLiteral: validatedNotificationData.notificationPriorityLiteral,
          },
        });

        return validatedNotificationData;

      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        
        /** 🛡️ SANEADO: Propagación de excepciones de validación puras */
        if (caughtError instanceof ValidationException) {
          throw caughtError;
        }

        const errorDescriptionLiteral = caughtError instanceof Error 
          ? caughtError.message 
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: NOTIFICATION_DISPATCHER_IDENTIFIER,
          operationCode: 'NOTIFICATION_DISPATCH_COLLAPSE',
          correlationIdentifier,
          message: 'Fallo catastrófico al intentar emitir alerta de sistema.',
          contextMetadata: { errorTrace: errorDescriptionLiteral },
        });

        throw new InternalSystemException('FALLO_EN_DESPACHO_DE_NOTIFICACION_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};