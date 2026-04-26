/**
 * @section Tools - Persistence Atom
 * @description Transforma los objetos en memoria en archivos JSON físicos
 * y emite el reporte de auditoría forense para CI/CD.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity.
 */

import { promises as filesystemPromises } from 'node:fs';
import * as path from 'node:path';
import { WEAVER_CONFIGURATION } from '../constants/WeaverConfiguration';
import type { IForensicAuditEntry, ILinguisticModulePayload } from '../constants/WeaverConfiguration';

export const PersistDictionariesAndAuditReport = async (
  aggregatedLinguisticDictionaries: Record<string, ILinguisticModulePayload>,
  forensicAuditTrail: IForensicAuditEntry[],
  correlationIdentifier: string
): Promise<void> => {

  // 1. Persistencia de Diccionarios Ensamblados
  await Promise.all(
    WEAVER_CONFIGURATION.SUPPORTED_LOCALES_COLLECTION.map(async (localeCodeLiteral) => {
      const outputFilePathLiteral = path.join(
        WEAVER_CONFIGURATION.TARGET_OUTPUT_DIRECTORY_LITERAL,
        `${localeCodeLiteral}.json`
      );
      await filesystemPromises.writeFile(
        outputFilePathLiteral,
        JSON.stringify(aggregatedLinguisticDictionaries[localeCodeLiteral], null, 2),
        'utf-8'
      );
    })
  );

  // 2. Persistencia de Rastro Forense (Health Sentry)
  const finalReportPayload = {
    generationTimestampISO: new Date().toISOString(),
    correlationIdentifier,
    totalModulesProcessedQuantity: forensicAuditTrail.length,
    auditTrail: forensicAuditTrail
  };

  const reportFilePathLiteral = path.join(
    WEAVER_CONFIGURATION.FORENSIC_REPORTS_DIRECTORY_LITERAL,
    'internationalization-audit-report.json'
  );

  await filesystemPromises.writeFile(
    reportFilePathLiteral,
    JSON.stringify(finalReportPayload, null, 2),
    'utf-8'
  );
};
