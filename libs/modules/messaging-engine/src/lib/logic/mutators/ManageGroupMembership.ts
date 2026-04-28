/**
 * @section Messaging Logic - Group Membership Orchestrator
 * @description Orquestador de élite encargado de gestionar la vinculación de 
 * ciudadanos con Action Hubs territoriales. Coordina la validación de ADN, 
 * la seguridad de red y la persistencia inmutable del historial.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Inyección de CreateSovereignDatabaseHeaders y atomización I/O.
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

/* 1. ADN de Intención (Aduana Atómica) */
const MembershipActionSchema = z.object({
  groupIdentifier: z.string().uuid()
    .describe('Identificador del Hub de Comunicación de destino.'),
  citizenIdentifier: z.string().uuid()
    .describe('UUID de la identidad ciudadana solicitante.'),
  membershipActionLiteral: z.enum(['JOIN', 'LEAVE'])
    .describe('Tipo de transición de membresía.'),
}).readonly();

/* 2. Enjambre Atómico (Internal Swarm) */
import { CreateSovereignDatabaseHeaders } from '../dispatchers/CreateSovereignDatabaseHeaders';
import { PersistMembershipTransition } from '../dispatchers/PersistMembershipTransition';

/** Identificador técnico del aparato. */
const MEMBERSHIP_ORCHESTRATOR_IDENTIFIER = 'GROUP_MEMBERSHIP_ORCHESTRATOR';

/**
 * Gestiona integralmente la entrada o salida de un ciudadano en un grupo.
 * 
 * @param unvalidatedRequestSnapshot - Datos crudos de la solicitud.
 * @returns {Promise<boolean>} Verdadero si el estado fue sincronizado.
 */
export const ManageGroupMembership = async (
  unvalidatedRequestSnapshot: unknown
): Promise<boolean> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  // 1. CAPTURA DE INFRAESTRUCTURA (Sovereign Secrets)
  const {
    SUPABASE_URL: cloudUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret,
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    MEMBERSHIP_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_MEMBERSHIP_FLOW',
    correlationIdentifier,
    async () => {
      try {
        // 2. ADUANA DE ADN (Safe Parsing)
        const validationResult = MembershipActionSchema.safeParse(unvalidatedRequestSnapshot);

        if (!validationResult.success) {
          throw new ValidationException('DATOS_DE_MEMBRESIA_INVALIDOS', {
            issues: validationResult.error.flatten()
          });
        }

        const { groupIdentifier, citizenIdentifier, membershipActionLiteral } = validationResult.data;

        // 3. LÓGICA DE ESTADO (Join/Leave Mapping)
        const targetStatus = membershipActionLiteral === 'JOIN' ? 'ACTIVE' : 'LEFT_INACTIVE';

        // 4. SEGURIDAD Y PERSISTENCIA (Delegación Atómica)
        /**
         * @section DRY Standard 
         * Reutilizamos el generador de cabeceras con preferencia 'minimal' para performance.
         */
        const securityHeaders = CreateSovereignDatabaseHeaders(cloudSecurityKeySecret, 'minimal');

        await PersistMembershipTransition(
          cloudUrlLiteral,
          securityHeaders,
          {
            group_id: groupIdentifier,
            citizen_id: citizenIdentifier,
            membership_status: targetStatus,
            last_action_correlation_id: correlationIdentifier,
            updated_at: new Date().toISOString(),
          }
        );

        // 5. REPORTE DE ÉXITO (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: MEMBERSHIP_ORCHESTRATOR_IDENTIFIER,
          operationCode: `MEMBERSHIP_${membershipActionLiteral}_NOMINAL`,
          correlationIdentifier,
          message: `Soberanía de membresía actualizada: [${membershipActionLiteral}]`,
          contextMetadata: { groupIdentifier, citizenIdentifier }
        });

        return true;

      } catch (caughtError: unknown) {
        // 6. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        if (caughtError instanceof ValidationException) throw caughtError;

        const errorLiteral = caughtError instanceof Error ? caughtError.message : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: MEMBERSHIP_ORCHESTRATOR_IDENTIFIER,
          operationCode: 'MEMBERSHIP_FLOW_COLLAPSE',
          correlationIdentifier,
          message: 'Error crítico en el orquestador de membresías.',
          contextMetadata: { errorTrace: errorLiteral },
        });

        throw new InternalSystemException('FALLO_EN_ORQUESTACION_DE_MEMBRESIA_SRE', {
          originalError: errorLiteral,
          correlationIdentifier,
        });
      }
    }
  );
};