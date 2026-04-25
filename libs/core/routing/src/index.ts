/**
 * @section Core Routing - Package Entry Point
 * @description Centraliza las capacidades de interceptación de solicitudes,
 * gestión de localización y validación de autoridad de acceso.
 *
 * Protocolo OEDP-V14.0 - Single Source Resolution.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

export * from './lib/schemas/RoutingConfiguration.schema';
export * from './lib/schemas/RoutingContext.schema';
export * from './lib/constants/RouteAuthorityManifesto';
export * from './lib/constants/RoutingGlobalConfiguration';

export { AnalyzeRequestMetadata } from './lib/logic/atomic/AnalyzeRequestMetadata';
export { DetermineDeviceLocale } from './lib/logic/atomic/DetermineDeviceLocale';
export { ValidateLinguisticContract } from './lib/logic/atomic/ValidateLinguisticContract';
export { ValidateRouteAuthority } from './lib/logic/atomic/ValidateRouteAuthority';
export { GlobalRequestOrchestrator } from './lib/logic/GlobalRequestOrchestrator';
