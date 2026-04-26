/**
 * @section Tools - Initialization Atom
 * @description Garantiza que los directorios de salida existan físicamente antes
 * de iniciar el volcado de datos.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity.
 */

import { promises as filesystemPromises } from 'node:fs';
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import { WEAVER_CONFIGURATION } from '../constants/WeaverConfiguration';

export const InitializeWeaverInfrastructure = async (): Promise<void> => {
  try {
    await Promise.all([
      filesystemPromises.mkdir(WEAVER_CONFIGURATION.TARGET_OUTPUT_DIRECTORY_LITERAL, { recursive: true }),
      filesystemPromises.mkdir(WEAVER_CONFIGURATION.FORENSIC_REPORTS_DIRECTORY_LITERAL, { recursive: true })
    ]);
  } catch (caughtError) {
    throw new InternalSystemException('FALLO_CREACION_DIRECTORIOS_WEAVER', {
      originalErrorLiteral: String(caughtError)
    });
  }
};
