/**
 * @section Scripts - Internationalization Weaver Execution Trigger
 * @description Gatillo CLI para la orquestación y compilación de diccionarios multilingües.
 * Garantiza que la infraestructura lingüística esté validada antes del despliegue.
 *
 * Protocolo OEDP-V14.0 - Functional Atomicity.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

import { BuildInternationalizationDictionaries } from '@floripa-dignidade/tools';

/**
 * Coordina el ciclo de vida del proceso de tejido lingüístico.
 * Gestiona las señales de salida para el orquestador de CI/CD.
 */
const executeInternationalizationWeaverPipeline = async (): Promise<void> => {
  try {
    /** Invocación del motor lógico de herramientas */
    await BuildInternationalizationDictionaries();

    process.exit(0);

  } catch (caughtError: unknown) {
    const errorMessageLiteral = caughtError instanceof Error
      ? caughtError.message
      : String(caughtError);

    console.error('\n❌ [CRITICAL_INFRASTRUCTURE_FAILURE]: Fallo en la fase de Pre-compilación Lingüística.');
    console.error(`DETALLE_TECNICO: ${errorMessageLiteral}\n`);

    /** Aborto de seguridad mandatorio para prevenir despliegues corruptos */
    process.exit(1);
  }
};

/** Activación inmediata del pipeline */
executeInternationalizationWeaverPipeline();