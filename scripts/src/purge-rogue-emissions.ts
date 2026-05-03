import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

const TARGET_EXTENSIONS = ['.js', '.d.ts', '.map', '.tsbuildinfo'];
const IGNORED_FOLDERS = ['node_modules', '.git', '.nx', '.next'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function simplePurge(targetPath: string) {
  const files = fs.readdirSync(targetPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(targetPath, file.name);

    if (file.isDirectory()) {
      if (!IGNORED_FOLDERS.includes(file.name)) {
        simplePurge(fullPath);
      }
    } else {
      const isRogue = TARGET_EXTENSIONS.some(ext => file.name.endsWith(ext));
      const isConfig = file.name.includes('.config.'); // Protege next.config.js, etc.

      if (isRogue && !isConfig) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`[BORRADO]: ${file.name}`);
        } catch (err) {
          console.error(`[ERROR]: No se pudo borrar ${file.name}`);
        }
      }
    }
  }
}

console.log(`\n--- 🛡️ LIMPIADOR DE EMISIONES SIMPLE ---`);

rl.question('Introduzca la ruta completa de la carpeta a limpiar: ', (targetDir) => {
  const normalizedPath = path.resolve(targetDir.trim());

  if (!fs.existsSync(normalizedPath)) {
    console.error('La ruta no existe.');
    process.exit(1);
  }

  console.log(`\n⚠️ Limpiando archivos *.js, *.d.ts, *.map en: ${normalizedPath}`);

  rl.question('¿Confirmar? (s/n): ', (answer) => {
    if (answer.toLowerCase() === 's') {
      simplePurge(normalizedPath);
      console.log('\n✅ Limpieza completada.\n');
    } else {
      console.log('\nCancelado.\n');
    }
    rl.close();
  });
});
