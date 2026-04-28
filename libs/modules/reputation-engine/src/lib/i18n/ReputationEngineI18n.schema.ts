import { z } from 'zod';

/**
 * @section i18n DNA - Reputation Engine Dictionary Schema
 * @description Define las claves obligatorias para la comunicación humana y técnica.
 */
export const ReputationEngineI18nSchema = z.object({
  logs: z.object({
    INVALID_PULSE_STRUCTURE: z.string().describe('Alerta de seguridad: datos malformados.'),
    SUBMISSION_NOMINAL: z.string().describe('Confirmación de recepción de evaluación.'),
    ANOMALY_DETECTED: z.string().describe('Aviso de posible ataque de bots.'),
  }),
  errors: z.object({
    REPUTATION_PULSE_ADN_CORRUPTO: z.string().describe('Error al validar el esquema del pulso.'),
    COMMENTARY_TOO_SHORT: z.string().describe('Validación cualitativa fallida.'),
  })
}).readonly();

export type IReputationEngineI18n = z.infer<typeof ReputationEngineI18nSchema>;
