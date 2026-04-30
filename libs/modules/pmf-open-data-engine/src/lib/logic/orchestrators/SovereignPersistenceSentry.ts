/**
 * @section PMF Engine Logic - Sovereign Persistence Sentry (Orchestrator)
 * @description Orquestador de persistencia encargado de la gestión del ciclo de vida
 * de los datos. Implementa la lógica de "Cero Duplicados" e historización.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & ISO Technical Naming.
 * SANEADO Zenith: Atomización de I/O y resolución de complejidad.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';
import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN de Dominio */
import type { IPublicExpenditure } from '../../schemas/sovereign/PublicExpenditure.schema';

/* 2. Enjambre Atómico (Internal Swarm) */
import { CalculateContentSignature } from '../atomic/persistence/CalculateContentSignature';
import { FetchExpenditureState } from '../atomic/persistence/FetchExpenditureState';
import { UpdateExpenditureHeartbeat } from '../atomic/persistence/UpdateExpenditureHeartbeat';

/** Identificador técnico del aparato. */
const PERSISTENCE_SENTRY_IDENTIFIER = 'SOVEREIGN_PERSISTENCE_SENTRY';

/**
 * Gestiona el guardado inteligente de un gasto público mediante triaje de firmas.
 *
 * @param publicExpenditurePayload - Gasto normalizado por el motor.
 * @param correlationIdentifier - Identificador de trazabilidad digital.
 */
export const SovereignPersistenceSentry = async (
  publicExpenditurePayload: IPublicExpenditure,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<void> => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = ValidateEnvironmentAduana();

  try {
    // 1. GENERACIÓN DE HUELLA DIGITAL (Fingerprint)
    const currentContentHash = await CalculateContentSignature({
      amount: publicExpenditurePayload.totalExecutedAmountNumeric,
      description: publicExpenditurePayload.serviceDescriptionLiteral,
      provider: publicExpenditurePayload.providerMetadata.taxIdentificationNumber
    }, correlationIdentifier);

    // 2. CONSULTA DE SOBERANÍA (Delegación Atómica)
    const previousStateSnapshot = await FetchExpenditureState(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      publicExpenditurePayload.expenditureIdentifier
    );

    // 3. DECISIÓN LÓGICA: ¿Hay mutación o novedad?
    const isDataIdenticalBoolean = previousStateSnapshot?.contentHash === currentContentHash;

    if (isDataIdenticalBoolean) {
      /**
       * CASO A: Registro Idéntico.
       * Refrescamos el pulso de vida (Heartbeat) para confirmar vigencia.
       */
      await UpdateExpenditureHeartbeat(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        publicExpenditurePayload.expenditureIdentifier
      );
      return;
    }

    /**
     * CASO B: Registro Nuevo o Mutado.
     * Persistimos el registro completo con su nueva firma.
     */
    await fetch(`${SUPABASE_URL}/rest/v1/territorial_master_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        ibge_id: publicExpenditurePayload.expenditureIdentifier,
        name_literal: publicExpenditurePayload.governmentTechnicalReferenceLiteral,
        metadata_snapshot: { ...publicExpenditurePayload, contentHash: currentContentHash },
        last_sync_at: new Date().toISOString()
      })
    });

    // 4. REPORTE DE SINCRONIZACIÓN NOMINAL
    void EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: PERSISTENCE_SENTRY_IDENTIFIER,
      operationCode: previousStateSnapshot ? 'EXPENDITURE_MUTATED' : 'NEW_EXPENDITURE_SAVED',
      correlationIdentifier,
      message: 'Sincronización de gasto público consolidada en el Data Lake.',
      contextMetadata: {
        id: publicExpenditurePayload.expenditureIdentifier,
        isMutation: !!previousStateSnapshot
      }
    });

  } catch (caughtError: unknown) {
    throw new InternalSystemException('FALLO_EN_PERSISTENCIA_DE_DATOS_ABIERTOS_SRE', {
      originalErrorLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError),
      correlationIdentifier
    });
  }
};
