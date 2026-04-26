/**
 * @section CMS DNA - Global Asset Declarations
 * @description Define el mapa de tipos para activos no-TypeScript (CSS, Imágenes, SVG).
 * Permite la resolución de módulos estáticos y garantiza la integridad del
 * compilador ante importaciones de efectos secundarios.
 *
 * Protocolo OEDP-V16.0 - Verbatim Module Syntax & High Performance Typings.
 * Saneamiento Zenith: Resolución de TS2882 e interoperabilidade con NodeJS.ProcessEnv.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type React from 'react';

/**
 * @section Soporte de Estilos Globales
 * @description Permite la importación de archivos CSS como efectos secundarios
 * sanando el error TS2882.
 */
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

/**
 * @section Soporte Vectorial (SVG)
 */
declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const content: string;
  export default content;
}

/**
 * @section Soporte Multimedia (Activos Binarios)
 */
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.avif' {
  const content: string;
  export default content;
}

/**
 * @section Declaraciones de Entorno (ProcessEnv)
 * @description Sincroniza el objeto 'process' para que TypeScript reconozca los
 * parámetros de construcción de Next.js y Payload CMS.
 */
declare namespace NodeJS {
  /* eslint-disable @typescript-eslint/naming-convention */
  /**
   * 🛡️ SANEADO Zenith: Se desactiva la norma de prefijo 'I' exclusivamente para
   * esta interfaz, ya que es una extensión de un tipo global de Node.js.
   */
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PAYLOAD_CONFIG_PATH: string;
    readonly NEXT_PUBLIC_SITE_URL: string;
  }
  /* eslint-enable @typescript-eslint/naming-convention */
}
