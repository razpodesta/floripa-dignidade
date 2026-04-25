/**
 * @section Infrastructure DNA - Global Security Headers Wrapper
 * @description Envoltorio de tipos para la colección institucional de cabeceras.
 * Proporciona compatibilidad entre el silo JSON y el sistema de tipos del monorepo.
 *
 * Protocolo OEDP-V15.0 - Universal Artifact Pattern.
 * @author Raz Podestá - MetaShark Tech
 */

import SecurityHeadersSilo from './GlobalSecurityHeaders.json';

export interface ISecurityHeader {
  readonly key: string;
  readonly value: string;
}

/**
 * Exportación tipada de la colección de cabeceras para uso en el código de la aplicación.
 * El ADN real reside en el archivo JSON adyacente para interoperabilidad con Node.js.
 */
export const GLOBAL_SECURITY_HEADERS_COLLECTION: readonly ISecurityHeader[] = SecurityHeadersSilo;
