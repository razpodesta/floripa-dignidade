/**
 * @section WhatsApp Logic - Incoming Event Orchestrator
 * @description Orquestador superior de frontera. Valida la integridad del paquete
 * de datos de Meta y dirige el triaje mediante un enjambre de átomos funcionales.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & High Performance.
 * @author Engineering Department - Floripa Dignidade
 */

import { ValidationException } from '@floripa-dignidade/exceptions';
import {
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/** 🛡️ SANEAMIENTO Zenith: Importación de ADN y Átomos segregados */
import { HandleIndividualWhatsAppMessage } from '../atomic/HandleIndividualWhatsAppMessage';
import { WhatsAppWebhookPayloadSchema } from '../../schemas/WhatsAppWebhook.schema';
import type { IWhatsAppWebhookPayload } from '../../schemas/WhatsAppWebhook.schema';

/** Identificador técnico para el Neural Sentinel. */
const WHATSAPP_ORCHESTRATOR_IDENTIFIER = 'WHATSAPP_EVENT_ORCHESTRATOR';

/**
 * Recibe y valida señales físicas de Meta, delegando el triaje al enjambre.
 *
 * @param rawWebhookEventPayload - Objeto JSON recibido en el Gateway de la App.
 * @throws {ValidationException} Si el ADN del evento es ilegítimo.
 * @returns {Promise<void>}
 */
export const ProcessIncomingWhatsAppEvent = async (
  rawWebhookEventPayload: unknown,
): Promise<void> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    WHATSAPP_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_WEBHOOK_SWARM_ORCHESTRATION',
    correlationIdentifier,
    async () => {

      // 1. ADUANA DE ADN (Safe Parsing)
      const payloadValidationResult = WhatsAppWebhookPayloadSchema.safeParse(rawWebhookEventPayload);

      if (!payloadValidationResult.success) {
        throw new ValidationException('ADN_WEBHOOK_WHATSAPP_CORRUPTO', {
          structuralIssuesCollection: payloadValidationResult.error.flatten(),
          correlationIdentifier,
        });
      }

      const validatedPayload: IWhatsAppWebhookPayload = payloadValidationResult.data;

      /**
       * 2. DESCOMPOSICIÓN DE SEÑALES (Swarm Triaje)
       * Iteramos sobre las entradas (entry) y cambios (changes) para capturar
       * cada mensaje de forma atómica.
       */
      for (const entrySnapshot of validatedPayload.entry) {
        for (const changeSnapshot of entrySnapshot.changes) {
          const incomingChangeValue = changeSnapshot.value;

          // Escenario: Procesamiento de Colección de Mensajes
          const isMessageCollectionPresentBoolean =
            incomingChangeValue.messages && incomingChangeValue.messages.length > 0;

          if (isMessageCollectionPresentBoolean) {
            /** 🛡️ SANEADO: El uso de '!' es seguro tras la validación booleana previa */
            for (const individualMessageSnapshot of incomingChangeValue.messages!) {
              await HandleIndividualWhatsAppMessage(
                individualMessageSnapshot,
                correlationIdentifier
              );
            }
          }

          // Escenario: Actualización de rastro de entrega (Statuses)
          if (incomingChangeValue.statuses && incomingChangeValue.statuses.length > 0) {
            // TODO: Crear átomo 'UpdateMessageTraceStatus.ts'
          }
        }
      }
    },
  );
};
