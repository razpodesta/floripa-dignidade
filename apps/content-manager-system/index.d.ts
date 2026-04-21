import React from 'react';

/**
 * @section Declaraciones de Tipos Globales - CMS Context
 * Protocolo OEDP-V13.0 - Tipado Estricto de Activos
 */

/**
 * Definición de módulo para archivos SVG.
 * Permite que el CMS trate a los vectores como componentes funcionales de React
 * con soporte total para propiedades nativas del DOM y accesibilidad.
 */
declare module '*.svg' {
  /**
   * Componente funcional React para inyectar SVGs directamente en el árbol de renderizado.
   * Soporta props estándar de SVG y títulos opcionales para SEO/Accesibilidad.
   */
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  /**
   * Ruta de recurso estático para el uso del SVG como fuente de imagen (src).
   */
  const content: string;
  export default content;
}

/**
 * Declaraciones para activos binarios de imagen.
 * Garantiza que las importaciones de imágenes retornen una cadena de texto (URL/Base64).
 */
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}
