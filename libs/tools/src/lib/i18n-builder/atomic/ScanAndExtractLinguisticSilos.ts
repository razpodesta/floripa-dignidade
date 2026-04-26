/**
 * @section Tools - Scanning & Extraction Atom
 * @description Recorre recursivamente el monorepo en busca de carpetas 'i18n',
 * extrayendo y validando el JSON en memoria.
 *
 * Protocolo OEDP-V16.0 - High Performance Tree Traversal.
 */

import { promises as filesystemPromises } from 'node:fs';
import * as path from 'node:path';
import { EmitTelemetrySignal } from '@floripa-dignidade/telemetry';
import { WEAVER_CONFIGURATION } from '../constants/WeaverConfiguration';
import type { IForensicAuditEntry, ILinguisticModulePayload } from '../constants/WeaverConfiguration';

interface IExtractionResult {
  readonly aggregatedLinguisticDictionaries: Record<string, ILinguisticModulePayload>;
  readonly forensicAuditTrail: IForensicAuditEntry[];
}

export const ScanAndExtractLinguisticSilos = async (
  correlationIdentifier: string
): Promise<IExtractionResult> => {
  const aggregatedLinguisticDictionaries: Record<string, ILinguisticModulePayload> = {
    'pt-BR': {},
    'es-ES': {},
    'en-US': {}
  };

  const forensicAuditTrail: IForensicAuditEntry[] =[];

  const scanDirectoryRecursively = async (currentPathLiteral: string): Promise<void> => {
    const directoryEntriesCollection = await filesystemPromises.readdir(currentPathLiteral, { withFileTypes: true });

    for (const directoryEntry of directoryEntriesCollection) {
      const entryFullPathLiteral = path.join(currentPathLiteral, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        if (directoryEntry.name === 'i18n') {
          const relativePathFromLibsLiteral = path.relative(
            WEAVER_CONFIGURATION.LIBRARIES_SOURCE_DIRECTORY_LITERAL,
            entryFullPathLiteral
          );
          const pathSegmentsCollection = relativePathFromLibsLiteral.split(path.sep);
          const moduleIdentifierLiteral = pathSegmentsCollection.slice(0, 2).join('/');

          const processedLocalesForThisModuleCollection: string[] =[];

          await Promise.all(
            WEAVER_CONFIGURATION.SUPPORTED_LOCALES_COLLECTION.map(async (localeCodeLiteral) => {
              const translationFilePathLiteral = path.join(entryFullPathLiteral, `${localeCodeLiteral}.json`);
              try {
                const rawFileContentLiteral = await filesystemPromises.readFile(translationFilePathLiteral, 'utf-8');

                aggregatedLinguisticDictionaries[localeCodeLiteral][moduleIdentifierLiteral] =
                  JSON.parse(rawFileContentLiteral) as Record<string, unknown>;

                processedLocalesForThisModuleCollection.push(localeCodeLiteral);
              } catch (_caughtError) {
                // Silencio operativo: El idioma no es obligatorio para todos los búnkeres
              }
            })
          );

          forensicAuditTrail.push({
            moduleIdentifierLiteral,
            filesystemPathLiteral: entryFullPathLiteral,
            processedLocalesCollection: processedLocalesForThisModuleCollection
          });

          EmitTelemetrySignal({
            severityLevel: 'INFO',
            moduleIdentifier: WEAVER_CONFIGURATION.WEAVER_ENGINE_IDENTIFIER_LITERAL,
            operationCode: 'SILO_WEAVED_SUCCESSFULLY',
            correlationIdentifier,
            message: `Búnker lingüístico integrado:[${moduleIdentifierLiteral}]`
          });

        } else if (directoryEntry.name !== 'node_modules' && !directoryEntry.name.startsWith('.')) {
          await scanDirectoryRecursively(entryFullPathLiteral);
        }
      }
    }
  };

  await scanDirectoryRecursively(WEAVER_CONFIGURATION.LIBRARIES_SOURCE_DIRECTORY_LITERAL);

  return { aggregatedLinguisticDictionaries, forensicAuditTrail };
};
