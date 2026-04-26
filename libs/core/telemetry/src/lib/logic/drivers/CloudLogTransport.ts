/**
 * @section Telemetry - Cloud Log Transport
 * @description Adaptador físico de red para la persistencia en el Data Lake.
 *
 * Protocolo OEDP-V16.0 - Stateless I/O & Cloud Native (ADR 0015).
 */

import type { ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';

/**
 * Ejecuta la transmisión física hacia Supabase vía PostgREST.
 */
export const TransmitSignalsToCloud = async (
  signalsCollection: ITelemetrySignal[],
  supabaseUrlLiteral: string,
  supabaseSecurityKeySecret: string
): Promise<void> => {
  try {
    await fetch(`${supabaseUrlLiteral}/rest/v1/system_telemetry_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseSecurityKeySecret,
        'Authorization': `Bearer ${supabaseSecurityKeySecret}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(signalsCollection)
    });
  } catch (_caughtError) {
    // Silencio operativo: El fallo de logs no debe interrumpir el flujo principal.
  }
};
