/**
 * @section Messaging Logic - Notification Read Receipt Mutator
 * @description Átomo de lógica encargado de la transición de estado de una alerta
 * institucional hacia el estatus de 'Leída'. Registra la marca temporal de 
 * reconocimiento y garantiza la integridad del contador de la campanita.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Query-Level Security.
 * Vision: Real-time Notification Sync & Forensic Traceability.
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
import { z } from 'zod';

/* 1. ADN de Entrada (Aduana de Intención) */
const MarkAsReadRequestSchema = z.object({
  /** Identificador único de la notificación capturada. */
  notificationIdentifier: z.string().uuid()
    .describe('ID de la alerta de sistema que el ciudadano ha visualizado.'),
  
  /** UUID del destinatario legítimo para validación de propiedad. */
  recipientIdentifier: z.string().uuid()
    .describe('Identificador del ciudadano para prevenir manipulaciones cruzadas.'),
}).readonly();

/** Identificador técnico del aparato para el Neural Sentinel. */
const NOTIFICATION_MUTATOR_IDENTIFIER = 'MARK_NOTIFICATION_READ_MUTATOR';

/**
 * Ejecuta la transición de estado en la nube, marcando una notificación como leída.
 * Implementa el protocolo de persistencia asíncrona para no bloquear el renderizado.
 *
 * @param unvalidatedRequestSnapshot - Payload con el ID del mensaje y del receptor.
 * @returns {Promise<boolean>} Verdadero si la mutación fue aceptada por la infraestructura.
 * @throws {ValidationException | InternalSystemException}
 */
export const MarkNotificationAsRead = async (
  unvalidatedRequestSnapshot: unknown
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA (Hardware Isolation)
  const {
    SUPABASE_URL: cloudStorageUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    NOTIFICATION_MUTATOR_IDENTIFIER,
    'EXECUTE_NOTIFICATION_ACKNOWLEDGE_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        // 2. ADUANA DE ADN (Safe Parsing)
        const validationResult = MarkAsReadRequestSchema.safeParse(unvalidatedRequestSnapshot);

        if (!validationResult.success) {
          throw new ValidationException('DATOS_DE_LECTURA_INVALIDOS', {
            issuesCollection: validationResult.error.flatten()
          });
        }

        const { notificationIdentifier, recipientIdentifier } = validationResult.data;

        /**
         * 3. MUTACIÓN EN EL TIER DE DATOS (PostgREST Protocol)
         * Se realiza un PATCH condicional: La notificación solo se actualiza si 
         * pertenece físicamente al ciudadano que lo solicita.
         */
        const cloudPersistenceResponse = await fetch(
          `${cloudStorageUrlLiteral}/rest/v1/system_notifications_ledger?notification_id=eq.${notificationIdentifier}&recipient_id=eq.${recipientIdentifier}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': cloudSecurityKeySecret,
              'Authorization': `Bearer ${cloudSecurityKeySecret}`,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              interaction_status: 'ACKNOWLEDGED_READ',
              acknowledged_at: new Date().toISOString(),
              mutation_correlation_id: correlationIdentifier,
            }),
          }
        );

        if (!cloudPersistenceResponse.ok) {
          throw new Error(`CLOUD_DATABASE_FAULT_${cloudPersistenceResponse.status}`);
        }

        // 4. REPORTE DE ÉXITO (SRE Analytics)
        EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: NOTIFICATION_MUTATOR_IDENTIFIER,
          operationCode: 'NOTIFICATION_MARKED_AS_READ',
          correlationIdentifier,
          message: 'Notificación reconocida y sincronizada exitosamente.',
          contextMetadata: {
            notificationIdentifier,
            recipientIdentifier
          },
        });

        return true;

      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE FALLO
        const errorDescriptionLiteral = caughtError instanceof Error 
          ? caughtError.message 
          : String(caughtError);

        EmitTelemetrySignal({
          severityLevel: 'ERROR',
          moduleIdentifier: NOTIFICATION_MUTATOR_IDENTIFIER,
          operationCode: 'MARK_READ_PROCESS_COLLAPSE',
          correlationIdentifier,
          message: 'Error crítico al intentar transicionar el estado de la notificación.',
          contextMetadata: { errorTrace: errorDescriptionLiteral },
        });

        throw new InternalSystemException('FALLO_EN_PERSISTENCIA_DE_LECTURA_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};