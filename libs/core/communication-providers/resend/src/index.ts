/**
 * @section Resend Provider - Package Entry Point
 * @description Centraliza la infraestructura para la transmisión de correos
 * electrónicos transaccionales y la vigilancia de salud del servicio.
 *
 * Protocolo OEDP-V14.0 - Single Source Resolution.
 * @author Dirección de Ingeniería - Floripa Dignidade
 */

export * from './lib/schemas/ResendEmail.schema';
export { SendTransactionalEmail } from './lib/logic/atomic/SendTransactionalEmail';
export { AuditResendHealthProbe } from './lib/logic/atomic/AuditResendHealthProbe';
