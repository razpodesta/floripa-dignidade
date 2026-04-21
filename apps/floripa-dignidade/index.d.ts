import React from 'react';

/**
 * @section Declaraciones de Tipos Globales
 * Protocolo OEDP-V13.0 - Typings de Alto Rendimiento
 */

/**
 * Extensión de módulos para archivos de gráficos vectoriales (SVG).
 * Define el comportamiento dual de los SVGs en el ecosistema Next.js:
 * 1. Como una URL de recurso estático (String).
 * 2. Como un componente funcional de React (ReactComponent).
 */
declare module '*.svg' {
  /**
   * Representación del SVG como un componente funcional de React.
   * Permite la inyección dinámica de propiedades (props) como 'className' o 'fill'.
   */
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  /**
   * Representación por defecto del recurso estático (URL del archivo).
   */
  const content: string;
  export default content;
}

/**
 * Extensión para archivos de imagen estáticos (PNG, JPG, WEBP).
 */
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}
