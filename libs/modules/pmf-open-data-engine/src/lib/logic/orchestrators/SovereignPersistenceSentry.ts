/**
 * @section PMF Engine Logic - Sovereign Persistence Sentry
 * @description Orquestador de persistencia encargado de la gestión del ciclo de vida
 * de los datos. Implementa la lógica de "Cero Duplicados" y "Historización por Cambio",
 * garantizando que la base de datos solo crezca cuando hay información nueva o mutada.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Data Sovereignty.
 * Vision: Efficient Historical Archiving.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

import { ValidateEnvironmentAduana } from '@floripa-dignidade/environment-validator';
import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 1. ADN del Dominio */
import type { IPublicExpenditure } from '../../schemas/sovereign/PublicExpenditure.schema';
import { CalculateContentSignature } from '../atomic/persistence/CalculateContentSignature';

/** Identificador técnico del aparato. */
const PERSISTENCE_SENTRY_IDENTIFIER = 'SOVEREIGN_PERSISTENCE_SENTRY';

/**
 * Gestiona el guardado inteligente de un gasto público.
 *
 * @param expenditure - Gasto normalizado.
 * @param correlationIdentifier - ID de trazabilidad.
 */
export const SovereignPersistenceSentry = async (
  expenditure: IPublicExpenditure,
  correlationIdentifier: string = GenerateCorrelationIdentifier()
): Promise<void> => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = ValidateEnvironmentAduana();

  try {
    // FASE 1: GENERACIÓN DE FIRMA DE CONTENIDO ACTUAL
    const currentContentHash = await CalculateContentSignature({
      amount: expenditure.totalExecutedAmountNumeric,
      description: expenditure.serviceDescriptionLiteral,
      provider: expenditure.providerMetadata.taxIdentificationNumber
    }, correlationIdentifier);

    // FASE 2: CONSULTA DE ESTADO PREVIO (Sovereign Check)
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/territorial_master_data?ibge_id=eq.${expenditure.expenditureIdentifier}&select=metadata_snapshot`,
      { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } }
    );

    const existingRecordCollection = await checkResponse.json();
    const existingRecord = existingRecordCollection[0];

    // FASE 3: DECISIÓN LOGICA (Excelencia en Performance)
    if (existingRecord && existingRecord.metadata_snapshot?.contentHash === currentContentHash) {
      /**
       * CASO A: Registro idéntico.
       * Solo actualizamos la marca de "Última vez visto" para confirmar que sigue vigente.
       */
      await fetch(`${SUPABASE_URL}/rest/v1/territorial_master_data?ibge_id=eq.${expenditure.expenditureIdentifier}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ last_seen_at: new Date().toISOString() })
      });
      return;
    }

    /**
     * CASO B: Registro nuevo o Mutado.
     * Si existía un previo con diferente Hash, el Trigger de la DB (o lógica manual)
     * moverá el anterior a la tabla de históricos.
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
        ibge_id: expenditure.expenditureIdentifier,
        name_literal: expenditure.governmentTechnicalReferenceLiteral,
        metadata_snapshot: { ...expenditure, contentHash: currentContentHash },
        last_sync_at: new Date().toISOString()
      })
    });

    void EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: PERSISTENCE_SENTRY_IDENTIFIER,
      operationCode: existingRecord ? 'EXPENDITURE_MUTATED_AND_SAVED' : 'NEW_EXPENDITURE_PERSISTED',
      correlationIdentifier,
      message: 'Soberanía de datos actualizada tras detección de cambio o novedad.'
    });

  } catch (caughtError: unknown) {
    throw new InternalSystemException('FALLO_EN_ADUANA_DE_PERSISTENCIA_SRE', {
      errorTrace: String(caughtError),
      correlationIdentifier
    });
  }
};
