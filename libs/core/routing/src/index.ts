/**
 * 🚦 Routing & Interception Bunker - Sovereign Entry Point
 * Protocolo OEDP-V13.0 - Atomic Request Pipeline
 *
 * Este búnker centraliza la exportación de capacidades para la interceptación
 * de solicitudes, gestión de localización, guardianes de autoridad (RBAC)
 * y auditoría de integridad lingüística.
 *
 * @author Staff Software Engineer - Floripa Dignidade
 */

/**
 * @section Trazabilidad Operativa
 * Versión inicial de la infraestructura de ruteo y guardianes.
 */
export const CORE_ROUTING_VERSION = '1.0.0';

/**
 * @section 1. ADN Estructural (Sovereign Schemas)
 * Exportación de contratos para la configuración de rutas y el
 * contexto de la solicitud (RoutingContext).
 */
export * from './lib/schemas/RoutingConfiguration.schema';
export * from './lib/schemas/RoutingContext.schema';

/**
 * @section 2. Lógica Atómica (Apparatus)
 * Exportación de manejadores funcionales para el procesamiento de cabeceras,
 * detección de idiomas y validaciones de seguridad.
 */
export { AnalyzeRequestMetadata } from './lib/logic/atomic/AnalyzeRequestMetadata';
export { DetermineDeviceLocale } from './lib/logic/atomic/DetermineDeviceLocale';
export { ValidateLinguisticContract } from './lib/logic/atomic/ValidateLinguisticContract';
export { ValidateRouteAuthority } from './lib/logic/atomic/ValidateRouteAuthority';

/**
 * @section 3. Orquestación Global (Higher Order Orchestrator)
 * Exportación del punto de entrada principal para el middleware de Next.js.
 */
export { GlobalRequestOrchestrator } from './lib/logic/GlobalRequestOrchestrator';
