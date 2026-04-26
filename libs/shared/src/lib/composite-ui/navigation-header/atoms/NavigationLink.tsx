/**
 * @section UI Atom - Navigation Link
 * @description Componente de enlace especializado para la navegación superior.
 * Implementa animaciones de estado activo y transiciones de color ISO.
 *
 * Protocolo OEDP-V16.0 - High Performance & Atomic Visual DNA.
 */

import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
//import { GlobalStyleClassMerger } from '../../../utility/GlobalStyleMerger';

interface INavigationLinkProperties {
  readonly hrefLiteral: string;
  readonly labelLiteral: string;
  readonly isExternalBoolean?: boolean;
}

export const NavigationLink: React.FC<INavigationLinkProperties> = ({
  hrefLiteral,
  labelLiteral,
  isExternalBoolean = false,
}) => {
  const commonStylesLiteral = "text-slate-700 hover:text-amber-600 font-bold transition-all duration-300 relative group text-sm uppercase tracking-widest outline-none focus-visible:text-amber-600";

  return (
    <NavigationMenu.Item>
      <NavigationMenu.Link
        href={hrefLiteral}
        target={isExternalBoolean ? '_blank' : undefined}
        rel={isExternalBoolean ? 'noopener noreferrer' : undefined}
        className={commonStylesLiteral}
      >
        {labelLiteral}
        {/* Underline animado (Visual Signature) */}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  );
};
