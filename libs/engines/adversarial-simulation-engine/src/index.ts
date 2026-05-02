/**
 * @section Adversarial Simulation Engine - Package Entry Point (Barrel)
 * @description Orquestador soberano del motor de seguridad proactiva (Red Team).
 * Centraliza las armas, simuladores y traductores forenses para la detección
 * temprana de vulnerabilidades en el ecosistema.
 *
 * Protocolo OEDP-V17.0 - Single Source Resolution & ISO Technical Naming.
 * SANEADO Zenith: Integración de Adaptadores Forenses y Orquestación de CI/CD.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

/**
 * @version 1.3.0
 * Estatus: Nivelación Zenith completa. Soporte para Auditoría Adversaria,
 * Reportes SARIF/Shannon y Fuzzing In-Memory para Vercel.
 */
export const ADVERSARIAL_SIMULATION_ENGINE_VERSION = '1.3.0';

/**
 * @section Capa 1: ADN Estructural (Sovereign Schemas)
 * Contratos inmutables que definen brechas, reportes y vectores de ataque.
 */
export * from './lib/schemas/AdversarialVulnerability.schema';
export * from './lib/schemas/ForensicAuditReport.schema';
export * from './lib/generators/schemas/AdversarialPayload.schema';

/**
 * @section Capa 2: Armería (Attack Generators)
 * Átomos que ensamblan ADN corrupto para pruebas de penetración lógica.
 */
export { GenerateSqlInjectionPayload } from './lib/generators/GenerateSqlInjectionPayload';
export { GenerateCrossSiteScriptingPayload } from './lib/generators/GenerateCrossSiteScriptingPayload';

/**
 * @section Capa 3: Ejecutores (Simulators)
 * Motores de ejecución Stateless para simulación de inyección en memoria.
 */
export { ExecuteAdversarialFuzzing } from './lib/simulators/ExecuteAdversarialFuzzing';

/**
 * @section Capa 4: Traductores y Orquestadores (Adapters & Orchestrators)
 * Puentes de integración para IAs externas y gatillos de auditoría global.
 */
export { ExportShannonForensicReport } from './lib/adapters/ExportShannonForensicReport';
export { ExecuteSecurityAuditPipeline } from './lib/orchestrators/ExecuteSecurityAuditPipeline';

/**
 * @section Interfaces de Integración (Types)
 */
export type { ITargetAduanaDefinition } from './lib/orchestrators/ExecuteSecurityAuditPipeline';
