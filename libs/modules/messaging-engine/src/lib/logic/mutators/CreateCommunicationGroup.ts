/**
 * @section Messaging Logic - Communication Group Orchestrator
 * @description Orquestador de élite encargado de la creación y registro de Action Hubs.
 * Realiza la validación de autoridad institucional, purificación de ADN estructural 
 * mediante la aduana Zod y persistencia en el Data Lake soberano.
 * 
 * Protocolo OEDP-V17.0 - Swarm Intelligence & ISO Standards.
 * SANEADO Zenith: Resolución definitiva de TS6059, TS6307 y Purga de Cronología.
 * 
 * @author Raz Podestá - MetaShark Tech
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException, ValidationException } from '@floripa-dignidade/exceptions';

/** 
 * 🛡️ SANEADO Zenith: Separación estricta de ADN y Lógica.
 * Al usar Project References, la importación de 'identity' es ahora nominal y segura.
 */
import { USER_ROLES } from '@floripa-dignidade/identity';
import type { IUserIdentity } from '@floripa-dignidade/identity';

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural del Dominio de Mensajería */
import { CommunicationGroupSchema } from '../../schemas/CommunicationGroup.schema';
import type { ICommunicationGroup } from '../../schemas/CommunicationGroup.schema';

/* 2. Enjambre Atómico Interno (Responsabilidad Única) */
import { MapCommunicationGroupToPersistence } from '../mappers/MapCommunicationGroupToPersistence';
import { PersistCommunicationGroup } from '../dispatchers/PersistCommunicationGroup';

/** Identificador técnico del aparato para el Neural Sentinel. */
const GROUP_CREATOR_IDENTIFIER = 'MESSAGING_GROUP_CREATOR_ORCHESTRATOR';

/**
 * Ejecuta la creación integral de un Círculo de Comunicación (Action Hub).
 * Valida que el actor posea la jerarquía necesaria para alterar el ecosistema.
 * 
 * @param unvalidatedGroupPayload - Datos propuestos para el grupo (slug, nombre, descripción).
 * @param activeActorIdentitySnapshot - ADN de la identidad que solicita la operación.
 * @returns {Promise<ICommunicationGroup>} Instancia del grupo validada, persistida y auditada.
 * @throws {ValidationException} Si el contrato de datos es inválido o la autoridad es insuficiente.
 * @throws {InternalSystemException} Si la infraestructura cloud colapsa durante la persistencia.
 */
export const CreateCommunicationGroup = async (
  unvalidatedGroupPayload: unknown,
  activeActorIdentitySnapshot: IUserIdentity
): Promise<ICommunicationGroup> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  /**
   * 1. CAPTURA DE INFRAESTRUCTURA (Hardware Isolation)
   * SANEADO: La aduana garantiza la existencia de secretos de Supabase y Resend.
   */
  const {
    SUPABASE_URL: cloudUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    GROUP_CREATOR_IDENTIFIER,
    'EXECUTE_ACTION_HUB_CREATION_FLOW',
    correlationIdentifier,
    async () => {
      try {
        /**
         * 2. AUDITORÍA DE AUTORIDAD (Identity Enforcement)
         * Se restringe la creación de hubs a roles con capacidad de orquestación global.
         */
        const authorizedRolesCollection: string[] = [
          USER_ROLES.INFRASTRUCTURE_SOVEREIGN_AUDITOR,
          USER_ROLES.PLATFORM_GLOBAL_MANAGER,
          USER_ROLES.ORGANIZATION_ADMINISTRATOR
        ];

        const activeAuthorityRoleLiteral = activeActorIdentitySnapshot.assignedAuthorityRoleLiteral;
        
        /** 🛡️ SANEADO: Verificación de autoridad contra el catálogo soberano */
        const isActorAuthorizedBoolean = authorizedRolesCollection.includes(
          activeAuthorityRoleLiteral as string
        );

        if (!isActorAuthorizedBoolean) {
          throw new ValidationException('MESSAGING.ERRORS.UNAUTHORIZED_THREAD_ACCESS', {
            activeRoleLiteral: activeAuthorityRoleLiteral,
            requiredRolesCollection: authorizedRolesCollection,
            actionAttemptedLiteral: 'CREATE_COMMUNICATION_GROUP'
          });
        }

        /**
         * 3. ADUANA DE ADN (Safe Parsing)
         * Purificación de los datos de entrada según el esquema de grupo inmutable.
         */
        const validationResult = CommunicationGroupSchema.safeParse(unvalidatedGroupPayload);

        if (!validationResult.success) {
          throw new ValidationException('MESSAGING.ERRORS.MESSAGE_ADN_CORRUPTED', {
            structuralIssuesCollection: validationResult.error.flatten(),
            apparatusIdentifierLiteral: 'CommunicationGroupSchema'
          });
        }

        const validatedGroupData: ICommunicationGroup = validationResult.data;

        /**
         * 4. TRANSFORMACIÓN Y PERSISTENCIA (Delegación Atómica)
         * Se delega el mapeo de columnas y la transacción física a átomos especializados.
         */
        const databasePersistencePayload = MapCommunicationGroupToPersistence(
          validatedGroupData,
          activeActorIdentitySnapshot.identityIdentifier,
          correlationIdentifier
        );

        await PersistCommunicationGroup(
          cloudUrlLiteral, 
          cloudSecurityKeySecret, 
          databasePersistencePayload
        );

        // 5. REPORTE DE ÉXITO (SRE Cognitive Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: GROUP_CREATOR_IDENTIFIER,
          operationCode: 'ACTION_HUB_CREATED_SUCCESSFULLY',
          correlationIdentifier,
          message: 'MESSAGING.LOGS.NOTIFICATION_BROADCAST_SUCCESS',
          contextMetadata: { 
            groupIdentifier: validatedGroupData.groupIdentifier,
            technicalSlugLiteral: validatedGroupData.technicalSlugLiteral,
            creatorIdentityIdentifier: activeActorIdentitySnapshot.identityIdentifier
          },
        });

        return validatedGroupData;

      } catch (caughtExecutionError: unknown) {
        // 6. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        if (caughtExecutionError instanceof ValidationException) {
          throw caughtExecutionError;
        }

        const errorDescriptionLiteral = caughtExecutionError instanceof Error 
          ? caughtExecutionError.message 
          : String(caughtExecutionError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: GROUP_CREATOR_IDENTIFIER,
          operationCode: 'GROUP_CREATION_FLOW_COLAPSE',
          correlationIdentifier,
          message: 'Error crítico en el orquestador de creación de grupos institucionales.',
          contextMetadata: { errorTraceLiteral: errorDescriptionLiteral },
        });

        throw new InternalSystemException('FALLO_EN_ORQUESTACION_DE_GRUPO_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};