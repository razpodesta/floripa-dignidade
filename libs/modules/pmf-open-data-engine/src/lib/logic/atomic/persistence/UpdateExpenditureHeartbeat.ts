/**
 * @section PMF Engine Logic - Expenditure Heartbeat Atom
 * @description Ejecuta una actualización parcial (PATCH) para confirmar la
 * vigencia de un gasto sin mutar sus datos técnicos.
 */

export const UpdateExpenditureHeartbeat = async (
  cloudUrl: string,
  cloudKey: string,
  expenditureIdentifier: string
): Promise<void> => {
  await fetch(`${cloudUrl}/rest/v1/territorial_master_data?ibge_id=eq.${expenditureIdentifier}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': cloudKey,
      'Authorization': `Bearer ${cloudKey}`
    },
    body: JSON.stringify({ last_seen_at: new Date().toISOString() })
  });
};
