/**
 * @section Telemetry Logic - LocalStorage Purge Atom
 * @description Átomo encargado de la eliminación física del rastro local tras el éxito cloud.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE.
 */

import { GetLocalStorageSafeReference } from './internal/GetLocalStorageSafeReference';
import { SOVEREIGN_STORAGE_CONFIGURATION } from './internal/SovereignStorageConfiguration';

/**
 * Borra físicamente la bóveda de telemetría del hardware local.
 * Se invoca tras la confirmación de recepción (HTTP 201) del Data Lake.
 *
 * @returns {void}
 */
export const ClearSovereignTelemetryVaultAction = (): void => {
  const localStorageReference = GetLocalStorageSafeReference();

  if (!localStorageReference) {
    return;
  }

  localStorageReference.removeItem(SOVEREIGN_STORAGE_CONFIGURATION.VAULT_KEY_LITERAL);
};
