/**
 * @section Telemetry Logic - Sovereign Storage Configuration
 * @description Única Fuente de Verdad (SSOT) para las constantes de persistencia local.
 * Protocolo OEDP-V17.0 - Internal State Isolation.
 */

export const SOVEREIGN_STORAGE_CONFIGURATION = {
  /** Identificador físico en el hardware del cliente. */
  VAULT_KEY_LITERAL: 'FLORIPA_DIGNIDADE_TELEMETRY_VAULT',

  /** Límite de cuota (5MB) para evitar denegación de servicio por almacenamiento. */
  MAXIMUM_BYTE_CAPACITY_QUANTITY: 5242880,

  /** Cantidad de registros a preservar en caso de poda de emergencia. */
  PRUNING_RETENTION_QUANTITY: 100,
} as const;
