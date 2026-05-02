/**
 * @section Tools Logic - Exceptions Build Auditor (Standalone)
 * @description Escanea físicamente los directorios de salida.
 */

import { promises as filesystemPromises } from 'node:fs';
import * as path from 'node:path';

export const AuditExceptionsBuildArtifacts = async (): Promise<void> => {
  const workspaceRootDirectoryLiteral = process.cwd();

  const pathsToAuditCollection = [
    {
      // 🛡️ SANEADO: Eliminado el sufijo '/src' ya que TSC aplana la salida
      path: path.join(workspaceRootDirectoryLiteral, 'dist/out-tsc/libs/core/exceptions'),
      label: 'ADN_DECLARATION (TSC)'
    },
    {
      path: path.join(workspaceRootDirectoryLiteral, 'dist/libs/core/exceptions'),
      label: 'LOGIC_EXECUTABLE (SWC)'
    }
  ];

  console.log(`\n=== AUDITORÍA FÍSICA: @floripa-dignidade/exceptions ===`);

  for (const auditTarget of pathsToAuditCollection) {
    console.log(`\nVerificando: ${auditTarget.label}`);
    console.log(`Ruta: ${auditTarget.path}`);

    try {
      const directoryEntriesCollection = await filesystemPromises.readdir(auditTarget.path);
      if (directoryEntriesCollection.length === 0) {
        console.log('  ⚠️ Carpeta VACÍA.');
      } else {
        directoryEntriesCollection.forEach(file => console.log(`  [+] ${file}`));
      }
    } catch (caughtError) {
      console.log(`  ❌ ERROR: No se pudo acceder a la ruta.`);
    }
  }

  const reportPathLiteral = path.join(workspaceRootDirectoryLiteral, 'reports/exceptions-build-audit.json');
  await filesystemPromises.mkdir(path.dirname(reportPathLiteral), { recursive: true });
  await filesystemPromises.writeFile(reportPathLiteral, JSON.stringify({ timestampISO: new Date().toISOString() }, null, 2));
  console.log(`\n>>> REPORTE GENERADO EN: ${reportPathLiteral}\n`);
};
