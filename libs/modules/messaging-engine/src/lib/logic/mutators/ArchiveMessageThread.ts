/**
 * @section Messaging Logic - Thread Archiving Orchestrator
 * @description Orquestador encargado de la eliminación lógica (Soft Delete) de hilos.
 * Coordina la validación de ADN, la seguridad de red y la delegación a la persistencia.
 *
 * Protocolo OEDP-V16.0 - Swarm Intelligence & SRP Perfection.
 * SANEADO Zenith: Resolución de error de resolución TS2307 e inyección de cabeceras.
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
const ArchiveThreadRequestSchema = z.object({
  targetThreadIdentifier: z.string().uuid()
    .describe('ID del hilo de conversación a archivar.'),
  activeActorIdentifier: z.string().uuid()
    .describe('ID del ciudadano solicitante para validación de propiedad.'),
}).readonly();

/* 2. Enjambre Atómico (Internal Swarm) */
import { CreateSovereignDatabaseHeaders } from '../dispatchers/CreateSovereignDatabaseHeaders';
import { UpdateMessageThreadStatus } from './UpdateMessageThreadStatus';

/** Identificador técnico del aparato para el Neural Sentinel. */
const THREAD_MUTATOR_IDENTIFIER = 'MESSAGE_THREAD_ARCHIVE_ORCHESTRATOR';

/**
 * Ejecuta el proceso de archivado de una conversación privada.
 * 
 * @param unvalidatedRequestSnapshot - Datos crudos de la solicitud.
 * @returns {Promise<boolean>} Verdadero si la operación fue consolidada.
 */
export const ArchiveMessageThread = async (
  unvalidatedRequestSnapshot: unknown
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA (Sovereign Secrets)
  const {
    SUPABASE_URL: cloudUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    THREAD_MUTATOR_IDENTIFIER,
    'EXECUTE_THREAD_ARCHIVE_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 2. ADUANA DE ADN (Safe Parsing)
        const validationResult = ArchiveThreadRequestSchema.safeParse(unvalidatedRequestSnapshot);

        if (!validationResult.success) {
          throw new ValidationException('DATOS_DE_ARCHIVADO_INVALIDOS', {
            issues: validationResult.error.flatten()
          });
        }

        const { targetThreadIdentifier, activeActorIdentifier } = validationResult.data;

        // 3. SEGURIDAD Y PERSISTENCIA (Delegación Atómica)
        const securityHeaders = CreateSovereignDatabaseHeaders(cloudSecurityKeySecret, 'minimal');

        await UpdateMessageThreadStatus(
          cloudUrlLiteral,
          securityHeaders,
          targetThreadIdentifier,
          activeActorIdentifier,
          'ARCHIVED_BY_USER',
          correlationIdentifier
        );

        // 4. REPORTE DE ÉXITO (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: THREAD_MUTATOR_IDENTIFIER,
          operationCode: 'THREAD_ARCHIVED_SUCCESSFULLY',
          correlationIdentifier,
          message: 'MESSAGING.LOGS.THREAD_ARCHIVED_NOMINAL',
          contextMetadata: { targetThreadIdentifier }
        });

        return true;

      } catch (caughtError: unknown) {
        // 5. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        if (caughtError instanceof ValidationException) throw caughtError;

        const errorDescriptionLiteral = caughtError instanceof Error 
          ? caughtError.message 
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: THREAD_MUTATOR_IDENTIFIER,
          operationCode: 'THREAD_ARCHIVE_COLLAPSE',
          correlationIdentifier,
          message: 'Error crítico al intentar archivar el hilo de conversación.',
          contextMetadata: { errorTrace: errorDescriptionLiteral },
        });

        throw new InternalSystemException('FALLO_EN_MUTACION_DE_HILO_SRE', {
          originalError: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};