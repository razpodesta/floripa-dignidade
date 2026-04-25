/**
 * @section Newsletter Logic - Linguistic Loader Atom
 * @description Encapsula la carga dinámica de diccionarios para el búnker de Newsletter.
 *
 * Protocolo OEDP-V15.0 - Silo Isolation & Functional Atomicity.
 */

import { NewsletterI18nSchema } from '../../i18n/NewsletterI18n.schema';
import type { INewsletterI18n } from '../../i18n/NewsletterI18n.schema';

/**
 * Carga y valida el ADN lingüístico según el locale solicitado.
 */
export const LoadNewsletterLinguisticDictionary = async (
  localeIdentifier: string
): Promise<INewsletterI18n> => {
  try {
    const rawPayload = await import(`../../i18n/${localeIdentifier}.json`);
    return NewsletterI18nSchema.parse(rawPayload.default);
  } catch (_caughtError) {
    // Fallback al idioma principal si el solicitado no existe físicament
    const fallbackPayload = await import(`../../i18n/pt-BR.json`);
    return NewsletterI18nSchema.parse(fallbackPayload.default);
  }
};
