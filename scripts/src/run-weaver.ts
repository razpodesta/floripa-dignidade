/**
 * @section Scripts - Internationalization Weaver Trigger
 * @description Gatillo de ejecucion para el compilador de diccionarios.
 * Orquesta la unificacion de silos linguisticos antes del build de produccion.
 *
 * Protocolo OEDP-V17.0 - Trigger Pattern & High Performance SRE.
 * @author Raz Podestá - MetaShark Tech
 */

import { BuildInternationalizationDictionaries } from '@floripa-dignidade/tools';

/**
 * Ejecuta la secuencia de tejido de diccionarios.
 * Implementa un patron de salida determinista para integracion con CI/CD.
 */
const executeTriggerAction = async (): Promise<void> => {
  try {
    console.log('\n--- [ZENITH WEAVER]: INICIANDO TEJIDO DE SOBERANÍA LINGÜÍSTICA ---');

    await BuildInternationalizationDictionaries();

    console.log('--- [ZENITH WEAVER]: DICCIONARIOS CONSOLIDADOS EXITOSAMENTE ---\n');
    process.exit(0);

  } catch (caughtError: unknown) {
    /**
     * @section Gestion de Colapso de Infraestructura
     * Reportamos el rastro forense y forzamos la salida con error para
     * detener el pipeline de despliegue si el Weaver falla.
     */
    console.error('\n[CRITICAL_INFRASTRUCTURE_FAILURE]: El tejido lingüístico ha colapsado.');
    console.error(caughtError);
    process.exit(1);
  }
};

// Disparo fisico de la operacion
void executeTriggerAction();
