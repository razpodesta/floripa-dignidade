/**
 * @section Environment DNA - Linguistic Integrity Schema
 * @description Define el contrato soberano para los mensajes de auditoría
 * de infraestructura. Garantiza que los fallos de secretos posean
 * representaciones textuales claras para el equipo de SRE.
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & ReadOnly Integrity.
 */

import { z } from 'zod';

export const EnvironmentValidatorI18nSchema = z.object({
  logs: z.object({
    INTEGRITY_VIOLATION: z.string()
      .describe('Alerta crítica cuando las variables de entorno están corruptas.'),
    VERIFICATION_SUCCESS: z.string()
      .describe('Confirmación de que la infraestructura es nominal.'),
  }),
  errors: z.object({
    ENVIRONMENT_ADN_CORRUPT: z.string()
      .describe('Mensaje de excepción para el bloqueo de arranque.'),
  })
}).readonly();

export type IEnvironmentValidatorI18n = z.infer<typeof EnvironmentValidatorI18nSchema>;
