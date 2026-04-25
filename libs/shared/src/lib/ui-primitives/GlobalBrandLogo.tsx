'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GlobalStyleClassMerger } from '../utility/GlobalStyleMerger';

/**
 * @section Component: GlobalBrandLogo
 * @description Representación técnica de la identidad visual institucional de la ONG.
 * Implementa carga prioritaria para optimización de Core Web Vitals (LCP),
 * internacionalización total y accesibilidad de grado ISO.
 *
 * Protocolo OEDP-V13.0 - Branding Authority & Zero Abbreviations.
 * @author Raz  Podestá - MetaShark Tech
 */

interface IGlobalBrandLogoProperties {
  /** Cantidad de píxeles para el ancho del contenedor de la imagen. */
  readonly imageWidthPixelQuantity?: number;
  /** Cantidad de píxeles para el alto del contenedor de la imagen. */
  readonly imageHeightPixelQuantity?: number;
  /** Determina si el logotipo actúa como un disparador de navegación a la raíz. */
  readonly isNavigationLinkEnabled?: boolean;
  /**
   * Diccionario de textos para cumplimiento de accesibilidad y SEO.
   * Obligatorio para evitar strings hardcoded.
   */
  readonly labels: {
    readonly logoAlternativeTextLiteral: string;
    readonly navigationAriaLabelLiteral: string;
  };
  /** Variante visual para adaptarse a fondos claros o oscuros. */
  readonly visualVariant?: 'STANDARD' | 'MONOCHROME_WHITE';
  /** Clase externa para ajustes de margen o posicionamiento. */
  readonly externalClassName?: string;
}

export const GlobalBrandLogo: React.FC<IGlobalBrandLogoProperties> = ({
  imageWidthPixelQuantity = 180,
  imageHeightPixelQuantity = 60,
  isNavigationLinkEnabled = true,
  labels,
  visualVariant = 'STANDARD',
  externalClassName,
}) => {

  // 1. SELECCIÓN DE ACTIVO (Branding Asset Management)
  // Nota: En una fase futura, estas rutas vendrán del 'SharedAssetRegistry'.
  const logoImageSourcePathLiteral = visualVariant === 'STANDARD'
    ? '/brand/floripa-dignidade-logo-color.png'
    : '/brand/floripa-dignidade-logo-white.png';

  // 2. CONSTRUCCIÓN DEL ELEMENTO VISUAL (Atomic Composition)
  const brandLogoVisualElement = (
    <div className={GlobalStyleClassMerger(
      "flex items-center justify-center transition-all duration-300",
      "hover:opacity-90 active:scale-[0.98]",
      externalClassName
    )}>
      <div
        className="relative"
        style={{
          width: imageWidthPixelQuantity,
          height: imageHeightPixelQuantity,
        }}
      >
        {/*
          Next.js Image: Optimización de rastro y rendimiento de red.
          Se utiliza 'priority' porque el logo suele ser el elemento 'Above-the-fold' principal.
        */}
        <Image
          src={logoImageSourcePathLiteral}
          alt={labels.logoAlternativeTextLiteral}
          fill
          priority
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
    </div>
  );

  // 3. ORQUESTACIÓN DE NAVEGACIÓN (Accessiblity Layer)
  if (!isNavigationLinkEnabled) {
    return brandLogoVisualElement;
  }

  return (
    <Link
      href="/"
      aria-label={labels.navigationAriaLabelLiteral}
      className={GlobalStyleClassMerger(
        "outline-none rounded-xl transition-all duration-300",
        "focus-visible:ring-4 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2"
      )}
    >
      {brandLogoVisualElement}
    </Link>
  );
};
