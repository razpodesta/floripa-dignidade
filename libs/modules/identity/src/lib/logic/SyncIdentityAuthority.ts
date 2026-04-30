/**
 * @section Identity Logic - Authority Synchronization Orchestrator
 * @description Átomo encargado de la persistencia física del coeficiente de autoridad
 * bayesiana en el Ledger Soberano (Supabase). Convierte la matemática volátil en
 * credibilidad institucional inmutable.
 *
 * Protocolo OEDP-V17.0 - Cloud Sovereign & High Performance SRE.
 * Vision: Stateless Persistance & Zero Trust Loss.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 🛡️ SANEADO Zenith: Verbatim Module Syntax para importación de ADN */
import type { IIdentityAuthorityResult } from './atomic/schemas/CalculateIdentityAuthority.schema';

/** Identificador técnico del aparato para el Neural Sentinel. */
const AUTHORITY_SYNC_IDENTIFIER = 'IDENTITY_AUTHORITY_SYNC_ORCHESTRATOR';

/**
 * Ejecuta la transacción de persistencia del coeficiente de credibilidad ciudadana.
 *
 * @param citizenIdentifierLiteral - UUID del ciudadano.
 * @param authoritySnapshot - Resultado del cálculo matemático de autoridad.
 * @param correlationIdentifier - Identificador para el rastro forense (Opcional).
 * @returns {Promise<void>}
 * @throws {InternalSystemException} Si la infraestructura cloud rechaza la transacción.
 */
export const SyncIdentityAuthority = async (
  citizenIdentifierLiteral: string,
  authoritySnapshot: IIdentityAuthorityResult,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<void> => {

  // 1. CAPTURA DE SOBERANÍA CLOUD (Aislamiento de Entorno)
  const {
    SUPABASE_URL: cloudStorageUrlLiteral,
    SUPABASE_SERVICE_ROLE_KEY: cloudSecurityKeySecret
  } = ValidateEnvironmentAduana();

  return await TraceExecutionTime(
    AUTHORITY_SYNC_IDENTIFIER,
    'EXECUTE_AUTHORITY_PERSISTENCE_TRANSACTION',
    correlationIdentifier,
    async () => {
      try {
        /**
         * 2. TRANSMISIÓN FÍSICA (PostgREST Protocol)
         * Actualizamos el perfil del ciudadano inyectando el nuevo coeficiente bayesiano.
         */
        const cloudPersistenceResponse = await fetch(
          `${cloudStorageUrlLiteral}/rest/v1/citizen_identities_ledger?citizen_id=eq.${citizenIdentifierLiteral}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': cloudSecurityKeySecret,
              'Authorization': `Bearer ${cloudSecurityKeySecret}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              trust_weight_score: authoritySnapshot.authorityCoefficientNumeric,
              is_verified_human: authoritySnapshot.isVerifiedHumanBoolean,
              last_authority_sync_at: new Date().toISOString(),
              sync_correlation_id: correlationIdentifier
            })
          }
        );

        if (!cloudPersistenceResponse.ok) {
          throw new Error(`CLOUD_PROVIDER_FAULT_${cloudPersistenceResponse.status}`);
        }

        // 3. REPORTE DE ÉXITO (SRE Analytics)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: AUTHORITY_SYNC_IDENTIFIER,
          operationCode: 'AUTHORITY_SYNC_NOMINAL',
          correlationIdentifier,
          message: 'Coeficiente de autoridad bayesiana persistido con éxito.',
          contextMetadata: {
            citizenIdentifier: citizenIdentifierLiteral,
            assignedWeightNumeric: authoritySnapshot.authorityCoefficientNumeric
          }
        });

      } catch (caughtError: unknown) {
        // 4. GESTIÓN FORENSE DE FALLO (Resilience Layer)
        const errorDescriptionLiteral = caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);

        void EmitTelemetrySignal({
          severityLevel: 'CRITICAL',
          moduleIdentifier: AUTHORITY_SYNC_IDENTIFIER,
          operationCode: 'AUTHORITY_SYNC_COLLAPSE',
          correlationIdentifier,
          message: 'Fallo al intentar grabar la autoridad en la base de datos.',
          contextMetadata: { errorTrace: errorDescriptionLiteral }
        });

        throw new InternalSystemException('FALLO_EN_PERSISTENCIA_DE_AUTORIDAD_SRE', {
          originalErrorLiteral: errorDescriptionLiteral,
          correlationIdentifier
        });
      }
    }
  );
};
