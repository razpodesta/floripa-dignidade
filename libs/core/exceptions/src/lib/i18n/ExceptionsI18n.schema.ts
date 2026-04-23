import { z } from 'zod';

/**
 * @section Aduana Lingüística - Global Exceptions
 * Protocolo OEDP-V11.0 (Granular i18n & Dictionary Compilation)
 */

/**
 * Esquema Soberano para el diccionario de traducciones de excepciones.
 * Garantiza que cada código de error emitido por el sistema tenga una
 * representación textual obligatoria en todos los idiomas soportados.
 */
export const ExceptionsI18nSchema = z.object({
  codes: z.object({
    VALIDATION_FAILED: z.string()
      .describe('Mensaje cuando los datos no cumplen los criterios de integridad'),

    UNAUTHORIZED_ACCESS: z.string()
      .describe('Mensaje cuando el usuario intenta acceder a un recurso sin permisos'),

    INTERNAL_SYSTEM_FAILURE: z.string()
      .describe('Mensaje genérico para errores críticos de servidor (500)'),

    RESOURCE_NOT_FOUND: z.string()
      .describe('Mensaje cuando un recurso solicitado no existe en la base de datos'),

    EXTERNAL_SERVICE_TIMEOUT: z.string()
      .describe('Mensaje cuando una API de terceros (ej: Resend) no responde a tiempo')
  })
}).readonly();

/**
 * Interfaz tipada del diccionario de excepciones para el compilador de i18n.
 */
export type IExceptionsI18n = z.infer<typeof ExceptionsI18nSchema>;
