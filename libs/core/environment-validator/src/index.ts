/**
 * @section Core Environment Validator - Package Entry Point
 * @description Centraliza las capacidades de auditoría de infraestructura y
 * validación de ADN de entorno para el ecosistema.
 *
 * Protocolo OEDP-V15.0 - Single Source Resolution.
 * @author Raz Podestá - MetaShark Tech
 */

export * from './lib/schemas/Environment.schema';
export { ValidateEnvironmentAduana } from './lib/logic/ValidateEnvironmentAduana';
