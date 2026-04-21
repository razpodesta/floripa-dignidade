import { z } from 'zod';

export const AnalyticsI18nSchema = z.object({
  errors: z.object({
    ADN_CORRUPTO: z.string().describe('Mensaje cuando un evento analítico no cumple el esquema'),
    PERDIDA_CONEXION: z.string().describe('Mensaje cuando falla el envío de telemetría')
  }),
  logs: z.object({
    EVENTO_CAPTURADO: z.string()
  })
}).readonly();

export type IAnalyticsI18n = z.infer<typeof AnalyticsI18nSchema>;
