/**
 * @section Tools - Scanning & Extraction Atom
 * @description Rastreador recursivo de búnkeres lingüísticos. Extrae, valida y 
 * agrega diccionarios de internacionalización para la compilación del Weaver.
 *
 * Protocolo OEDP-V17.0 - High Performance Tree Traversal & Clean Paths.
 * SANEADO Zenith: Remoción de extensiones .js para compatibilidad con Turbopack,
 * erradicación de TS7006 (Implicit Any) y restauración de rastro telemétrico.
 * 
 * @author Raz Podestá - MetaShark Tech
 */

import { promises as filesystemPromises } from 'node:fs';
import { join, normalize, relative, sep } from 'node:path';
import { EmitTelemetrySignal } from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural Local (RUTAS LIMPIAS) */
/** 
 * 🛡️ RESOLUCIÓN ZENITH: Se purga el rastro .js. El orquestador de build 
 * gestiona la resolución nativa de TypeScript.
 */
import { WEAVER_CONFIGURATION } from '../constants/WeaverConfiguration';
import type { IForensicAuditEntry, ILinguisticModulePayload } from '../constants/WeaverConfiguration';

/**
 * @interface IExtractionResult
 * @description Contrato de salida con los diccionarios agregados y el rastro forense.
 */
interface IExtractionResult {
  readonly aggregatedLinguisticDictionaries: Record<string, ILinguisticModulePayload>;
  readonly forensicAuditTrail: IForensicAuditEntry[];
}

/**
 * Escanea el monorepo en busca de silos i18n y consolida la infraestructura lingüística.
 * 
 * @param correlationIdentifier - ID de trazabilidad para el Neural Sentinel.
 * @returns {Promise<IExtractionResult>} Resultado integral de la extracción.
 */
export const ScanAndExtractLinguisticSilos = async (
  correlationIdentifier: string
): Promise<IExtractionResult> => {
  
  /** 
   * 🛡️ FIX TS7006: Inicialización dinámica con tipado explícito.
   * Evita desincronizaciones entre la configuración y el estado en memoria.
   */
  const aggregatedLinguisticDictionaries: Record<string, ILinguisticModulePayload> = 
    Object.fromEntries(
      WEAVER_CONFIGURATION.SUPPORTED_LOCALES_COLLECTION.map(
        (localeIdentifierLiteral: string) => [localeIdentifierLiteral, {}]
      )
    );

  const forensicAuditTrailCollection: IForensicAuditEntry[] = [];

  /**
   * 🔒 FUNCIÓN ATÓMICA INTERNA: Explorador de Árbol (Recursive Traversal)
   * @param currentPathLiteral - Directorio actual de escaneo.
   */
  const scanDirectoryRecursively = async (currentPathLiteral: string): Promise<void> => {
    const directoryEntriesCollection = await filesystemPromises.readdir(currentPathLiteral, { 
      withFileTypes: true 
    });

    for (const directoryEntry of directoryEntriesCollection) {
      const entryFullPathLiteral = join(currentPathLiteral, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        // DETECCIÓN DE BÚNKER i18n
        if (directoryEntry.name === 'i18n') {
          const relativePathFromLibsLiteral = relative(
            WEAVER_CONFIGURATION.LIBRARIES_SOURCE_DIRECTORY_LITERAL, 
            entryFullPathLiteral
          );
          
          const moduleIdentifierLiteral = relativePathFromLibsLiteral
            .split(sep)
            .slice(0, 2)
            .join('/');

          const processedLocalesForThisModuleCollection: string[] = [];

          // Procesamiento paralelo de locales soportadas
          await Promise.all(
            WEAVER_CONFIGURATION.SUPPORTED_LOCALES_COLLECTION.map(
              async (localeIdentifierLiteral: string) => {
                const translationFilePathLiteral = join(
                  entryFullPathLiteral, 
                  `${localeIdentifierLiteral}.json`
                );
                
                try {
                  const rawFileContentLiteral = await filesystemPromises.readFile(
                    translationFilePathLiteral, 
                    'utf-8'
                  );
                  
                  const parsedContentSnapshot = JSON.parse(rawFileContentLiteral) as Record<string, unknown>;

                  /** 
                   * 🛡️ PROTECCIÓN DE PUNTERO: Verificación de rama lingüística.
                   */
                  const targetDictionary = aggregatedLinguisticDictionaries[localeIdentifierLiteral];
                  
                  if (targetDictionary) {
                    targetDictionary[moduleIdentifierLiteral] = parsedContentSnapshot;
                    processedLocalesForThisModuleCollection.push(localeIdentifierLiteral);
                  }
                } catch (caughtError: unknown) {
                  // Reporte de corrupción si el JSON es inválido, silencio si el archivo no existe.
                  if (caughtError instanceof SyntaxError) {
                    void EmitTelemetrySignal({
                      severityLevel: 'ERROR',
                      moduleIdentifier: WEAVER_CONFIGURATION.WEAVER_ENGINE_IDENTIFIER_LITERAL,
                      operationCode: 'LINGUISTIC_CORRUPTION_DETECTED',
                      correlationIdentifier,
                      message: `ADN Lingüístico corrupto en: [${translationFilePathLiteral}]`,
                      contextMetadataSnapshot: { errorDetailsLiteral: caughtError.message }
                    });
                  }
                }
              }
            )
          );

          // Consolidación del rastro forense
          forensicAuditTrailCollection.push({
            moduleIdentifierLiteral,
            filesystemPathLiteral: normalize(entryFullPathLiteral),
            processedLocalesCollection: processedLocalesForThisModuleCollection
          });

          void EmitTelemetrySignal({
            severityLevel: 'INFO',
            moduleIdentifier: WEAVER_CONFIGURATION.WEAVER_ENGINE_IDENTIFIER_LITERAL,
            operationCode: 'SILO_WEAVED',
            correlationIdentifier,
            message: `Búnker lingüístico integrado: [${moduleIdentifierLiteral}]`,
            contextMetadataSnapshot: { 
              localesCollection: processedLocalesForThisModuleCollection 
            }
          });

        } else if (directoryEntry.name !== 'node_modules' && !directoryEntry.name.startsWith('.')) {
          // Inmersión recursiva protegiendo fronteras físicas
          await scanDirectoryRecursively(entryFullPathLiteral);
        }
      }
    }
  };

  // Inicio de la operación sobre el directorio raíz de librerías
  await scanDirectoryRecursively(
    normalize(WEAVER_CONFIGURATION.LIBRARIES_SOURCE_DIRECTORY_LITERAL)
  );

  return { 
    aggregatedLinguisticDictionaries, 
    forensicAuditTrail: forensicAuditTrailCollection 
  };
};