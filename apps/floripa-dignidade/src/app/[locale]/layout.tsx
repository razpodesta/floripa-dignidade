/**
 * @section Localized Application Layout
 * @description Ensamblador de UI para rutas con prefijo de idioma.
 * Inyecta el contexto lingüístico, valida la integridad de los diccionarios
 * y orquesta la navegación global y el sistema visual.
 *
 * Protocolo OEDP-V13.0 - Linguistic Sovereignty & Atomic Assembly.
 * @author Staff Software Engineer - Floripa Dignidade
 */

import { notFound } from 'next/navigation';
import {
  GlobalMainNavigationHeader,
  MainNavigationHeaderI18nSchema
} from '@floripa-dignidade/shared';
import {
  SupportedLocaleSchema,
  ValidateLinguisticContract
} from '@floripa-dignidade/routing';

/**
 * Tipado de parámetros de ruta Next.js 15+
 */
interface ILocalizedLayoutProperties {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

/**
 * Cargador de Diccionarios de Élite.
 * En una fase futura, este aparato será sustituido por el 'DictionaryBuilder' unificado.
 * Actualmente extrae los silos directamente de las librerías compartidas.
 */
async function getNavigationDictionary(locale: string) {
  try {
    // Importación dinámica de los silos JSON del búnker shared
    const dictionary = await import(`../../../../../libs/shared/src/lib/composite-ui/i18n/${locale}.json`);

    // AUDITORÍA DE ADN: El Guardián de Contratos valida el JSON antes de entregarlo a la UI
    ValidateLinguisticContract(
      'MAIN_NAVIGATION_HEADER',
      MainNavigationHeaderI18nSchema,
      dictionary.default,
      locale
    );

    return dictionary.default;
  } catch (_caughtError) {
    return null;
  }
}

export default async function LocalizedLayout({ children, params }: ILocalizedLayoutProperties) {
  const { locale } = await params;

  // 1. Validación de Guardia: Si el locale no está en nuestro ADN, 404 instantáneo.
  const localeValidation = SupportedLocaleSchema.safeParse(locale);
  if (!localeValidation.success) {
    notFound();
  }

  // 2. Carga de "Almas Lingüísticas" para los orquestadores de UI
  const navigationDictionary = await getNavigationDictionary(locale);

  if (!navigationDictionary) {
    notFound();
  }

  return (
    <>
      {/*
        ORQUESTADOR DE NAVEGACIÓN:
        Se inyecta el diccionario validado y los componentes de acción.
      */}
      <GlobalMainNavigationHeader
        translationDictionary={navigationDictionary}
        currentActivePathLiteral={`/${locale}`}
      />

      <main className="relative pt-[80px] min-h-screen flex flex-col bg-slate-50">
        {children}
      </main>

      {/* @todo Implementar GlobalFooter aquí una vez nivelado el búnker */}
    </>
  );
}
