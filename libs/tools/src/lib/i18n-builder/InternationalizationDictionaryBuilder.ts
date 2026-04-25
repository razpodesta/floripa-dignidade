/**
 * @section Tools - Internationalization Dictionary Weaver
 * @description Motor lógico encargado de la recolección, validación y
 * ensamble de los silos lingüísticos distribuidos en el monorepo.
 *
 * Protocolo OEDP-V14.0 - Functional Atomicity.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import { promises as filesystem } from 'node:fs';
import * as path from 'node:path';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';
import { InternalSystemException } from '@floripa-dignidade/exceptions';

/**
 * @section Configuración de Rutas Institucionales
 */
const WORKSPACE_ROOT_DIRECTORY = path.resolve(process.cwd());
const LIBRARIES_SOURCE_DIRECTORY = path.join(WORKSPACE_ROOT_DIRECTORY, 'libs');
const TARGET_OUTPUT_DIRECTORY = path.join(
  WORKSPACE_ROOT_DIRECTORY,
  'apps/floripa-dignidade/src/app/i18n/dictionaries'
);
const FORENSIC_REPORTS_DIRECTORY = path.join(WORKSPACE_ROOT_DIRECTORY, 'reports');
const SUPPORTED_LOCALES_COLLECTION = ['pt-BR', 'es-ES', 'en-US'] as const;

const WEAVER_ENGINE_IDENTIFIER = 'INTERNATIONALIZATION_WEAVER_ENGINE';

interface IForensicAuditEntry {
  readonly moduleIdentifierLiteral: string;
  readonly filesystemPathLiteral: string;
  readonly processedLocalesCollection: string[];
}

type ILinguisticModulePayload = Record<string, Record<string, unknown>>;

/**
 * Ejecuta el proceso de consolidación de diccionarios multilingües.
 * Realiza un escaneo recursivo de los búnkeres para unificar el lenguaje del sistema.
 */
export const BuildInternationalizationDictionaries = async (): Promise<void> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    WEAVER_ENGINE_IDENTIFIER,
    'DICTIONARY_CONSOLIDATION_PROCESS',
    correlationIdentifier,
    async () => {
      try {
        await Promise.all([
          filesystem.mkdir(TARGET_OUTPUT_DIRECTORY, { recursive: true }),
          filesystem.mkdir(FORENSIC_REPORTS_DIRECTORY, { recursive: true })
        ]);
      } catch (caughtError) {
        throw new InternalSystemException('FALLO_CREACION_DIRECTORIOS_WEAVER', {
          originalErrorLiteral: String(caughtError)
        });
      }

      const aggregatedLinguisticDictionaries: Record<string, ILinguisticModulePayload> = {
        'pt-BR': {},
        'es-ES': {},
        'en-US': {}
      };

      const forensicAuditTrail: IForensicAuditEntry[] = [];

      const scanAndWeaveSilos = async (currentPath: string): Promise<void> => {
        const directoryEntries = await filesystem.readdir(currentPath, { withFileTypes: true });

        for (const entry of directoryEntries) {
          const entryFullPath = path.join(currentPath, entry.name);

          if (entry.isDirectory()) {
            if (entry.name === 'i18n') {
              const relativePathFromLibs = path.relative(LIBRARIES_SOURCE_DIRECTORY, entryFullPath);
              const pathSegments = relativePathFromLibs.split(path.sep);
              const moduleIdentifierLiteral = pathSegments.slice(0, 2).join('/');

              const processedLocalesForThisModule: string[] = [];

              await Promise.all(SUPPORTED_LOCALES_COLLECTION.map(async (localeCode) => {
                const translationFilePath = path.join(entryFullPath, `${localeCode}.json`);

                try {
                  const rawFileContent = await filesystem.readFile(translationFilePath, 'utf-8');
                  aggregatedLinguisticDictionaries[localeCode][moduleIdentifierLiteral] =
                    JSON.parse(rawFileContent) as Record<string, unknown>;

                  processedLocalesForThisModule.push(localeCode);
                } catch (_caughtError) {
                  // Silencio operativo: El idioma no es obligatorio para cada búnker individual
                }
              }));

              forensicAuditTrail.push({
                moduleIdentifierLiteral,
                filesystemPathLiteral: entryFullPath,
                processedLocalesCollection: processedLocalesForThisModule
              });

              EmitTelemetrySignal({
                severityLevel: 'INFO',
                moduleIdentifier: WEAVER_ENGINE_IDENTIFIER,
                operationCode: 'SILO_WEAVED_SUCCESSFULLY',
                correlationIdentifier,
                message: `Búnker lingüístico integrado: [${moduleIdentifierLiteral}]`
              });

            } else if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
              await scanAndWeaveSilos(entryFullPath);
            }
          }
        }
      };

      await scanAndWeaveSilos(LIBRARIES_SOURCE_DIRECTORY);

      await Promise.all(SUPPORTED_LOCALES_COLLECTION.map(async (localeCode) => {
        const outputFilePath = path.join(TARGET_OUTPUT_DIRECTORY, `${localeCode}.json`);
        await filesystem.writeFile(
          outputFilePath,
          JSON.stringify(aggregatedLinguisticDictionaries[localeCode], null, 2),
          'utf-8'
        );
      }));

      const finalReportPayload = {
        generationTimestampISO: new Date().toISOString(),
        correlationIdentifier,
        totalModulesProcessedQuantity: forensicAuditTrail.length,
        auditTrail: forensicAuditTrail
      };

      await filesystem.writeFile(
        path.join(FORENSIC_REPORTS_DIRECTORY, 'internationalization-audit-report.json'),
        JSON.stringify(finalReportPayload, null, 2),
        'utf-8'
      );

      EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: WEAVER_ENGINE_IDENTIFIER,
        operationCode: 'WEAVER_PIPELINE_COMPLETED',
        correlationIdentifier,
        message: 'Construcción de diccionarios finalizada con precisión industrial.'
      });
    }
  );
};
