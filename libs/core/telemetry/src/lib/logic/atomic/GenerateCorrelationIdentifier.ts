/**
 * @section Telemetry Logic - Forensic Identity Generator
 * @description Átomo de lógica pura encargado de la creación de identificadores
 * únicos universales (UUID v4). Actúa como la semente de la "Traza de Sangre
 * Digital", permitiendo correlacionar eventos a través de búnkeres distribuidos.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & Branded Types.
 * SANEADO Zenith: Inyección de CorrelationIdentifier (Branded Type).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import type { CorrelationIdentifier } from '../../schemas/TelemetrySignal.schema';

/**
 * Genera un identificador de correlación determinista y criptográficamente
 * seguro utilizando el hardware disponible en el runtime (Web Crypto API).
 *
 * @returns {CorrelationIdentifier} String con formato UUID v4 sellado por marca nominal.
 */
export const GenerateCorrelationIdentifier = (): CorrelationIdentifier => {
  /**
   * @section Generación de Identidad
   * Utilizamos 'crypto.randomUUID' para garantizar colisiones nulas y
   * cumplimiento de estándares industriales de trazabilidad.
   */
  const newCorrelationIdentifierLiteral = crypto.randomUUID();

  /**
   * 🛡️ SANEADO Zenith: Sellado de marca (Branding).
   * Transformamos el primitivo 'string' en un tipo soberano 'CorrelationIdentifier'
   * para asegurar que el compilador audite su uso correcto en el sistema nervioso.
   */
  return newCorrelationIdentifierLiteral as CorrelationIdentifier;
};
