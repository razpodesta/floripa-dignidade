/**
 * @section Tools - Initialization Atom
 * @description Garantiza la integridad de la infraestructura física para el Weaver.
 * Implementa normalización de rutas, auditoría de permisos y rastro de telemetría.
 * 
 * Protocolo OEDP-V17.0 - Zenith Architecture Standard & Clean Paths.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con el motor 
 * de resolución 'bundler' y restauración de visibilidad del Grafo Core.
 * 
 * @author Raz Podestá - MetaShark Tech
 */

import { promises as filesystemPromises, constants as fsConstants } from 'node:fs';
import { resolve, normalize } from 'node:path';

/* 1. Infraestructura Core (Atmos PascalCase - RUTAS LIMPIAS) */
/**
 * 🛡️ RESOLUCIÓN ZENITH: Al purgar las extensiones .js de este archivo, 
 * el compilador recupera la capacidad de resolver estos alias institucionalmente.
 */
import { InternalSystemException } from '@floripa-dignidade/exceptions';
import { EmitTelemetrySignal } from '@floripa-dignidade/telemetry';

/* 2. ADN Estructural Local */
/**
 * 🛡️ FIX TS2835: Remoción de la extensión .js. 
 * El Bundler (Turbopack/SWC) gestiona la resolución nativa de TypeScript.
 */
import { WEAVER_CONFIGURATION } from '../constants/WeaverConfiguration';

const INITIALIZER_IDENTIFIER = 'WEAVER_INFRASTRUCTURE_INITIALIZER';

/**
 * Inicializa los directorios base para el procesamiento lingüístico.
 * @throws {InternalSystemException} Si falla la creación o el acceso físico.
 */
export const InitializeWeaverInfrastructure = async (): Promise<void> => {
  const targetPathsCollection = [
    normalize(resolve(WEAVER_CONFIGURATION.TARGET_OUTPUT_DIRECTORY_LITERAL)),
    normalize(resolve(WEAVER_CONFIGURATION.FORENSIC_REPORTS_DIRECTORY_LITERAL))
  ];

  try {
    // 1. EJECUCIÓN: Creación idempotente de directorios (Hardware Isolation)
    await Promise.all(
      targetPathsCollection.map((pathLiteral) => 
        filesystemPromises.mkdir(pathLiteral, { recursive: true })
      )
    );

    // 2. AUDITORÍA: Verificación de permisos de escritura pre-vuelo (SRE Check)
    await Promise.all(
      targetPathsCollection.map((pathLiteral) =>
        filesystemPromises.access(pathLiteral, fsConstants.W_OK)
      )
    );

    // 3. TELEMETRÍA: Reporte de salud de infraestructura de build
    void EmitTelemetrySignal({
      severityLevel: 'INFO',
      moduleIdentifier: INITIALIZER_IDENTIFIER,
      operationCode: 'INFRA_READY',
      message: 'Infraestructura de persistencia para el Weaver inicializada correctamente.',
      contextMetadataSnapshot: { initializedPathsCollection: targetPathsCollection }
    });
    
  } catch (caughtError: unknown) {
    const errorInstance = caughtError as NodeJS.ErrnoException;
    
    throw new InternalSystemException('WEAVER_INFRASTRUCTURE_FAILURE', {
      intentLiteral: 'INITIALIZE_BUILD_DIRECTORIES',
      faultyPathsCollection: targetPathsCollection,
      systemErrorCodeLiteral: errorInstance.code ?? 'FS_ERROR',
      originalErrorLiteral: errorInstance.message
    });
  }
};