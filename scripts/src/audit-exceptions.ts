/**
 * @section Scripts - Exceptions Build Audit Trigger
 * @description Disparador CLI encargado de la verificacion fisica de los artefactos
 * de compilacion del bunker 'exceptions'. Garantiza que tanto la logica SWC
 * como el ADN de TSC existan en el disco antes del empaquetado final.
 *
 * Protocolo OEDP-V17.0 - Forensic Traceability & ISO Technical Naming.
 * SANEADO Zenith: Sustitucion de rutas relativas por Alias Soberano (Fix Module Boundaries).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { AuditExceptionsBuildArtifacts } from '@floripa-dignidade/tools';

/**
 * Ejecuta la secuencia de auditoria fisica.
 * Implementa un patron de captura global para asegurar la integridad del rastro.
 *
 * @returns {Promise<void>}
 */
const ExecuteExceptionsBuildAuditAction = async (): Promise<void> => {
  try {
    console.log('\n--- [ZENITH SENTRY]: INICIANDO AUDITORIA DE ARTEFACTOS (EXCEPTIONS) ---');

    /**
     * Invocacion del aparato de auditoria residente en la libreria de herramientas.
     * Valida la existencia de .js, .d.ts y .tsbuildinfo en la carpeta 'dist/'.
     */
    await AuditExceptionsBuildArtifacts();

    console.log('--- [ZENITH SENTRY]: AUDITORIA FINALIZADA CON EXITO ---\n');
    process.exit(0);

  } catch (caughtError: unknown) {
    /**
     * @section Gestion de Colapso de Infraestructura
     * Si la auditoria falla, debemos detener el proceso de CI/CD inmediatamente.
     */
    const errorDescriptionLiteral = caughtError instanceof Error
      ? caughtError.message
      : String(caughtError);

    console.error('\n[CRITICAL_INFRASTRUCTURE_FAILURE]: La auditoria forense ha colapsado.');
    console.error(`Rastro del fallo: ${errorDescriptionLiteral}`);

    process.exit(1);
  }
};

/**
 * @section Disparo Fisico (Trigger)
 * SANEADO: Marcado con 'void' para cumplir con la regla 'no-floating-promises'.
 */
void ExecuteExceptionsBuildAuditAction();
