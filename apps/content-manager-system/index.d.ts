/**
 * @section CMS DNA - Global Asset Declarations
 * @description Define el mapa de tipos para activos estáticos dentro del Content Manager System.
 * Garantiza que el compilador resuelva correctamente estilos e imágenes en el panel administrativo.
 *
 * Protocolo OEDP-V15.0 - Verbatim Module Syntax & Type Isolation.
 * Saneamiento: Soporte para importaciones CSS y purificación de tipos React.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type React from 'react';

/**
 * @section Soporte de Estilos
 * Permite la importación de hojas de estilo globales y módulos CSS.
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
 * @section Soporte Multimedia (Imágenes)
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
