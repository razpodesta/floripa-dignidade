/**
 * @section Tools - Internationalization Dictionary Builder
 * @description Orquestador de compilación para la unificación de silos lingüísticos.
 * Automatiza la recolección, validación y ensamblaje de traducciones granulares.
 *
 * Protocolo OEDP-V13.0 - Linguistic Sovereignty & Forensic Reporting.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * CONFIGURACIÓN DE RUTAS ISO
 * Definimos los puntos de origen y destino con rutas absolutas basadas en el root.
 */
const WORKSPACE_ROOT_DIRECTORY = path.join(__dirname, '../../');
const LIBRARIES_SOURCE_DIRECTORY = path.join(WORKSPACE_ROOT_DIRECTORY, 'libs');
const CACHE_OUTPUT_DIRECTORY = path.join(WORKSPACE_ROOT_DIRECTORY, '.cache/internationalization/dictionaries');
const REPORT_OUTPUT_DIRECTORY = path.join(WORKSPACE_ROOT_DIRECTORY, 'reports');

/** IDENTIFICADORES DE IDIOMAS SOPORTADOS (ADN del Sistema) */
const SUPPORTED_LOCALES_COLLECTION = ['pt-BR', 'es-ES', 'en-US'];

/** INTERFAZ DEL INFORME DE AUDITORÍA PARA IA */
interface IInternationalizationAuditReport {
  readonly buildTimestampIdentifier: string;
  readonly totalApparatusProcessedQuantity: number;
  readonly apparatusMap: Record<string, {
    readonly pt_BR: boolean;
    readonly es_ES: boolean;
    readonly en_US: boolean;
  }>;
  readonly globalStatusLiteral: 'NOMINAL' | 'INCOMPLETE';
}

/**
 * FUNCIÓN MAESTRA: InternationalizationDictionaryBuilder
 * Ejecuta el ciclo de vida de compilación verbosa.
 */
const InternationalizationDictionaryBuilder = async () => {
  console.log('\n🚀 [INICIANDO] Motor de Compilación Lingüística - Floripa Dignidade');
  console.log('------------------------------------------------------------------');

  // PASO 1: Preparación del Entorno
  console.log('STEP 1: Inicializando directorios de caché y reportes...');
  [CACHE_OUTPUT_DIRECTORY, REPORT_OUTPUT_DIRECTORY].forEach(directory => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      console.log(`   ✅ Creado: ${path.relative(WORKSPACE_ROOT_DIRECTORY, directory)}`);
    }
  });

  // Estructura temporal para el ensamblaje: { 'es-ES': { 'shared-ui': { ... } } }
  const globalAggregatedDictionary: Record<string, any> = {};
  SUPPORTED_LOCALES_COLLECTION.forEach(locale => { globalAggregatedDictionary[locale] = {}; });

  // Registro para el informe final
  const apparatusAuditLog: Record<string, any> = {};

  // PASO 2: Rastreo de Búnkeres (Deep Crawling)
  console.log('\nSTEP 2: Explorando búnkeres en búsqueda de silos lingüísticos...');

  const findI18nDirectories = (basePath: string) => {
    const entries = fs.readdirSync(basePath, { withFileTypes: true });

    for (const entry of entries) {
      const currentEntryPath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        // Si encontramos una carpeta 'i18n', procesamos sus JSONs
        if (entry.name === 'i18n') {
          processI18nSilo(currentEntryPath);
        } else if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
          findI18nDirectories(currentEntryPath);
        }
      }
    }
  };

  // PASO 3: Procesamiento y Unificación
  const processI18nSilo = (siloPath: string) => {
    /**
     * Identificamos el nombre del aparato (ej: 'composite-ui' o 'telemetry')
     * Basado en la carpeta padre de 'i18n'
     */
    const pathSegments = siloPath.split(path.sep);
    const apparatusNameIdentifier = pathSegments[pathSegments.length - 2];

    console.log(`   📦 Procesando aparato: [${apparatusNameIdentifier}]`);

    apparatusAuditLog[apparatusNameIdentifier] = {
      'pt-BR': false, 'es-ES': false, 'en-US': false
    };

    SUPPORTED_LOCALES_COLLECTION.forEach(locale => {
      const jsonFilePath = path.join(siloPath, `${locale}.json`);

      if (fs.existsSync(jsonFilePath)) {
        try {
          const rawContent = fs.readFileSync(jsonFilePath, 'utf-8');
          const parsedJson = JSON.parse(rawContent);

          // Inyectamos el contenido en el diccionario global bajo el namespace del búnker
          globalAggregatedDictionary[locale][apparatusNameIdentifier] = parsedJson;

          // Marcamos como exitoso en el informe
          apparatusAuditLog[apparatusNameIdentifier][locale] = true;
        } catch (error) {
          console.error(`   ❌ Error crítico de parsing en: ${jsonFilePath}`);
        }
      } else {
        console.warn(`   ⚠️ Advertencia: Falta traducción [${locale}] en aparato [${apparatusNameIdentifier}]`);
      }
    });
  };

  findI18nDirectories(LIBRARIES_SOURCE_DIRECTORY);

  // PASO 4: Persistencia de Diccionarios Unificados
  console.log('\nSTEP 4: Escribiendo diccionarios unificados en caché...');
  SUPPORTED_LOCALES_COLLECTION.forEach(locale => {
    const outputFilePath = path.join(CACHE_OUTPUT_DIRECTORY, `${locale}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(globalAggregatedDictionary[locale], null, 2));
    console.log(`   💾 Sincronizado: ${locale}.json (${Object.keys(globalAggregatedDictionary[locale]).length} búnkeres)`);
  });

  // PASO 5: Generación de Informe Forense para IA
  console.log('\nSTEP 5: Generando informe de auditoría para IA...');
  const auditReport: IInternationalizationAuditReport = {
    buildTimestampIdentifier: new Date().toISOString(),
    totalApparatusProcessedQuantity: Object.keys(apparatusAuditLog).length,
    apparatusMap: apparatusAuditLog,
    globalStatusLiteral: Object.values(apparatusAuditLog).every((silo: any) =>
      silo['pt-BR'] && silo['es-ES'] && silo['en-US']
    ) ? 'NOMINAL' : 'INCOMPLETE'
  };

  const reportFilePath = path.join(REPORT_OUTPUT_DIRECTORY, 'internationalization-audit-report.json');
  fs.writeFileSync(reportFilePath, JSON.stringify(auditReport, null, 2));
  console.log(`   📝 Informe reescrito en: ${path.relative(WORKSPACE_ROOT_DIRECTORY, reportFilePath)}`);

  console.log('\n------------------------------------------------------------------');
  console.log('🏁 [FINALIZADO] Motor de i18n nivelado al 100%.');
};

// Ejecución del script
InternationalizationDictionaryBuilder().catch(caughtError => {
  console.error('\n💥 FALLO CRÍTICO EN EL BUILDER:', caughtError);
  process.exit(1);
});
