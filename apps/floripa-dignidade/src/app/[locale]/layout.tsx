/**
 * @section Localized Application Layout
 * @description Carcasa estructural para rutas con prefijo de idioma. 
 * Ensambla el encabezado de navegación global y gestiona el ADN visual local.
 * 
 * Protocolo OEDP-V16.0 - High Performance Architecture.
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { GlobalMainNavigationHeader } from '@floripa-dignidade/shared';
import { 
  SupportedLocaleSchema, 
  ValidateLinguisticContract 
} from '@floripa-dignidade/routing';
import { MainNavigationHeaderI18nSchema } from '@floripa-dignidade/shared';

interface ILocalizedLayoutProperties {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocalizedLayout({ 
  children, 
  params 
}: ILocalizedLayoutProperties) {
  const { locale: rawLocaleIdentifier } = await params;

  // 1. ADUANA DE ADN LINGÜÍSTICO
  const localeValidation = SupportedLocaleSchema.safeParse(rawLocaleIdentifier);
  if (!localeValidation.success) {
    notFound();
  }

  const validatedLocale = localeValidation.data;

  // 2. CARGA DE DICCIONARIO PARA NAVEGACIÓN
  let headerDictionary;
  try {
    const rawData = await import(
      `../../../../../libs/shared/src/lib/composite-ui/i18n/${validatedLocale}.json`
    );
    
    ValidateLinguisticContract(
      'GLOBAL_HEADER', 
      MainNavigationHeaderI18nSchema, 
      rawData.default, 
      validatedLocale
    );
    
    headerDictionary = rawData.default;
  } catch (_error) {
    notFound();
  }

  return (
    <>
      <GlobalMainNavigationHeader translationDictionary={headerDictionary} />
      <main className="flex-grow pt-20">
        {children}
      </main>
      {/* TODO: Inyectar GlobalImpactFooter aquí (Fase 6) */}
    </>
  );
}