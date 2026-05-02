/**
 * @section Scripts - Exceptions Build Audit Trigger
 * @description Disparador CLI para la verificación física de artefactos.
 * Protocolo OEDP-V16.0 - Trigger Pattern.
 */

import { AuditExceptionsBuildArtifacts } from '../../libs/tools/src/lib/build-auditor/AuditExceptionsBuildArtifacts';

const runTrigger = async () => {
  try {
    console.log('--- INICIANDO AUDITORÍA FORENSE DE BUILD (EXCEPTIONS) ---');
    await AuditExceptionsBuildArtifacts();
    console.log('--- REPORTE GENERADO EN /reports/exceptions-build-audit.json ---');
    process.exit(0);
  } catch (caughtError) {
    console.error('[CRITICAL_INFRASTRUCTURE_FAILURE]', caughtError);
    process.exit(1);
  }
};

void runTrigger();
