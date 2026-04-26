/**
 * @section CMS DNA - Global Asset Declarations
 * @description Define el mapa de tipos para activos no-TypeScript (CSS, Imágenes, SVG).
 * Permite la resolución de módulos estáticos y garantiza la integridad del
 * compilador ante importaciones de efectos secundarios.
 *
 * Protocolo OEDP-V16.0 - Verbatim Module Syntax & High Performance Typings.
 * Saneamiento Zenith: Resolución de error de linter 'no-unused-vars' en SVG.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type React from 'react';

/**
 * @section Soporte de Estilos Globales (CSS Modules)
 * @description Autoriza la importación de archivos CSS. Erradica el error TS2882.
 */
declare module '*.css' {
  /** Colección inmutable de selectores de clase mapeados. */
  const styleSelectorsMapping: Record<string, string>;
  export default styleSelectorsMapping;
}

/**
 * @section Soporte Vectorial (SVG)
 * @description Permite tratar los SVGs como rutas de recursos o componentes React.
 * SANEADO: Se utiliza exportación directa para evitar variables locales no utilizadas.
 */
declare module '*.svg' {
  /** Representación del SVG como componente funcional de React. */
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { readonly title?: string }
  >;

  /** Ruta física del recurso estático (Path Literal). */
  const assetSourcePathLiteral: string;
  export default assetSourcePathLiteral;
}

/**
 * @section Soporte Multimedia (Activos Binarios)
 * ISO Standard Naming: 'assetSourcePathLiteral' en lugar de 'content'.
 */
declare module '*.png' { const assetSourcePathLiteral: string; export default assetSourcePathLiteral; }
declare module '*.jpg' { const assetSourcePathLiteral: string; export default assetSourcePathLiteral; }
declare module '*.jpeg' { const assetSourcePathLiteral: string; export default assetSourcePathLiteral; }
declare module '*.webp' { const assetSourcePathLiteral: string; export default assetSourcePathLiteral; }
declare module '*.avif' { const assetSourcePathLiteral: string; export default assetSourcePathLiteral; }

/**
 * @section Declaraciones de Entorno (NodeJS)
 * Sincroniza el objeto 'process' para que TypeScript reconozca los
 * parámetros de construcción de Next.js y Payload CMS.
 */
declare namespace NodeJS {
  /* eslint-disable @typescript-eslint/naming-convention */
  /**
   * Contrato de integridad para las variables de entorno inyectadas.
   * Saneamiento: Alineación con los secretos validados por el búnker core.
   */
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PAYLOAD_CONFIG_PATH: string;
    readonly NEXT_PUBLIC_SITE_URL: string;
    readonly DATABASE_URL: string;
    readonly PAYLOAD_SECRET: string;
  }
  /* eslint-enable @typescript-eslint/naming-convention */
}
