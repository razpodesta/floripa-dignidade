/**
 * @section Application DNA - Global Asset Declarations
 * @description Define el mapa de tipos para activos no-TypeScript (CSS, Imágenes, SVG).
 * Permite la resolución de módulos estáticos y garantiza la integridad del compilador.
 *
 * Protocolo OEDP-V15.0 - Verbatim Module Syntax & High Performance Typings.
 * Saneamiento: Soporte para importaciones de efectos secundarios CSS y corrección de tipos React.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type React from 'react';

/**
 * @section Estilos Globales
 * Resuelve el error TS2882 permitiendo importaciones de efectos secundarios.
 */
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

/**
 * @section Activos Vectoriales (SVG)
 * Soporta tanto el uso de la ruta como del componente React directo.
 */
declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const content: string;
  export default content;
}

/**
 * @section Activos Binarios (Imágenes)
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
