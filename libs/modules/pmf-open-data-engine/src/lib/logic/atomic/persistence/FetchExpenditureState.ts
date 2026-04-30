/**
 * @section PMF Engine Logic - Expenditure State Fetcher
 * @description Átomo encargado exclusivamente de la consulta física al Ledger
 * para recuperar metadatos previos de un gasto.
 *
 * Protocolo OEDP-V17.0 - Stateless I/O & Cloud Sovereign.
 */

import { InternalSystemException } from '@floripa-dignidade/exceptions';

export const FetchExpenditureState = async (
  cloudUrl: string,
  cloudKey: string,
  expenditureIdentifier: string
): Promise<{ readonly contentHash: string } | null> => {
  const outgoingResponse = await fetch(
    `${cloudUrl}/rest/v1/territorial_master_data?ibge_id=eq.${expenditureIdentifier}&select=metadata_snapshot`,
    { headers: { apikey: cloudKey, Authorization: `Bearer ${cloudKey}` } }
  );

  if (!outgoingResponse.ok) {
    throw new InternalSystemException('FALLO_CONSULTA_ESTADO_PREVIO_SRE', {
      httpStatus: outgoingResponse.status,
      expenditureIdentifier
    });
  }

  const resultCollection = await outgoingResponse.json();
  const existingMetadata = resultCollection[0]?.metadata_snapshot;

  return existingMetadata ? { contentHash: existingMetadata.contentHash } : null;
};
