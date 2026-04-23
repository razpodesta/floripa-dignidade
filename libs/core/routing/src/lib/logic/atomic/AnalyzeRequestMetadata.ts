/**
 * @section Routing Logic - Request Metadata Analyzer Apparatus
 * @description Extrae e inyecta metadatos técnicos de las cabeceras HTTP en el contexto
 * soberano de ruteo. Implementa detección de IP multi-capa y normalización de User Agent.
 *
 * Protocolo OEDP-V13.0 - Forensic Capture & Zero Unused Vars.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { IRoutingContext } from '../../schemas/RoutingContext.schema';

/**
 * Analiza las cabeceras de la solicitud entrante y enriquece el contexto de ruteo.
 *
 * @param incomingRequestHeaders - Cabeceras nativas de la petición HTTP.
 * @param existingRoutingContext - Contexto previo que será evolucionado.
 * @returns Un nuevo IRoutingContext inmutable con metadatos técnicos inyectados.
 */
export const AnalyzeRequestMetadata = (
  incomingRequestHeaders: Headers,
  existingRoutingContext: IRoutingContext
): IRoutingContext => {
  /**
   * 1. EXTRACCIÓN DE IDENTIDAD TÉCNICA
   * Capturamos la IP considerando la cadena de confianza de proxies (x-forwarded-for).
   * Se toma el primer segmento de la cadena si existe.
   */
  const rawForwardedForHeaderLiteral = incomingRequestHeaders.get('x-forwarded-for');
  const clientIpAddressLiteral = rawForwardedForHeaderLiteral
    ? rawForwardedForHeaderLiteral.split(',')[0].trim()
    : '127.0.0.1';

  const userAgentLiteral = incomingRequestHeaders.get('user-agent') || 'unknown-agent';

  /**
   * 2. EVOLUCIÓN DE CONTEXTO (Sovereign Inmutability)
   * Retornamos una nueva instancia del contexto cumpliendo con el ADN
   * de 'RoutingContextSchema'.
   */
  return {
    ...existingRoutingContext,
    clientMetadata: {
      ...existingRoutingContext.clientMetadata,
      ipAddressLiteral: clientIpAddressLiteral, // SANEADO: Uso explícito de la variable.
      userAgentLiteral: userAgentLiteral,
    }
  };
};
