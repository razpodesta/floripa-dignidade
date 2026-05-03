/**
 * @section Messaging Logic - Communication Group Orchestrator
 * @description Orquestador de élite encargado de la creación y registro de Action Hubs.
 * Implementa el patrón Swarm Orchestration, delegando la lógica en átomos especializados.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance.
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException, ValidationException } from '@floripa-dignidade/exceptions';
import type { IUserIdentity } from '@floripa-dignidade/identity';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural */
import type { ICommunicationGroup } from '../../schemas/CommunicationGroup.schema';

/* 2. Enjambre Atómico Local (Internal Swarm) */
// 🛡️ Nota: Se asume corrección de rutas físicas para resolver TS2307.
import { ValidateGroupCreationAuthority } from '../atomic/ValidateGroupCreationAuthority';
import { ValidateCommunicationGroupAdn } from '../atomic/ValidateCommunicationGroupAdn';
import { MapCommunicationGroupToPersistence } from '../mappers/MapCommunicationGroupToPersistence';
import { PersistCommunicationGroup } from '../dispatchers/PersistCommunicationGroup';

const ORCHESTRATOR_IDENTIFIER = 'MESSAGING_GROUP_CREATOR_ORCHESTRATOR';

/**
 * Ejecuta el flujo integral de creación de un Action Hub.
 * 
 * @param unvalidatedPayload - Datos crudos del nuevo grupo.
 * @param actorIdentity - Identidad soberana que ejecuta la acción.
 */
export const CreateCommunicationGroup = async (
  unvalidatedPayload: unknown,
  actorIdentity: IUserIdentity
): Promise<ICommunicationGroup> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();
  
  // 1. ADUANA DE INFRAESTRUCTURA
  const {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_ACTION_HUB_CREATION',
    correlationIdentifier,
    async () => {
      try {
        // 2. VALIDACIÓN DE AUTORIDAD (Aduana de Seguridad)
        // Se delega al átomo la responsabilidad de lanzar UnauthorizedException si falla.
        ValidateGroupCreationAuthority(actorIdentity.assignedAuthorityRoleLiteral);

        // 3. VALIDACIÓN DE ADN (Aduana de Integridad)
        const validatedGroupData = ValidateCommunicationGroupAdn(unvalidatedPayload);

        // 4. MAPEO DE PERSISTENCIA
        const persistencePayload = MapCommunicationGroupToPersistence(
          validatedGroupData,
          actorIdentity.identityIdentifier,
          correlationIdentifier
        );

        // 5. DESPACHO A PERSISTENCIA CLOUD
        await PersistCommunicationGroup(
          SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY,
          persistencePayload
        );

        // 6. REPORTE SRE (Alineación Semántica)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: ORCHESTRATOR_IDENTIFIER,
          operationCode: 'ACTION_HUB_CREATED',
          correlationIdentifier,
          message: 'Nuevo Círculo de Comunicación registrado exitosamente.',
          contextMetadataSnapshot: {
            groupIdentifier: validatedGroupData.groupIdentifier,
            creatorIdentity: actorIdentity.identityIdentifier,
            technicalSlug: validatedGroupData.technicalSlugLiteral
          },
        });

        return validatedGroupData;

      } catch (caughtError: unknown) {
        // Gestión de excepciones de negocio (No relanzar como Internal si ya son conocidas)
        if (caughtError instanceof ValidationException) {
          throw caughtError;
        }

        const errorMessage = caughtError instanceof Error ? caughtError.message : String(caughtError);

        // Alerta Crítica para el Neural Sentinel
        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: ORCHESTRATOR_IDENTIFIER,
          operationCode: 'GROUP_CREATION_COLLAPSE',
          correlationIdentifier,
          message: 'Colapso crítico en la creación de Action Hub.',
          contextMetadataSnapshot: { errorTrace: errorMessage },
        });

        throw new InternalSystemException('ACTION_HUB_ORCHESTRATION_FAILURE', {
          originalError: errorMessage,
          correlationIdentifier,
          actorId: actorIdentity.identityIdentifier
        });
      }
    }
  );
};