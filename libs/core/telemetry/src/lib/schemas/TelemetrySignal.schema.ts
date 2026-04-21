import { z } from 'zod';

export const SeverityLevelSchema = z.enum(['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']);
export type SeverityLevel = z.infer<typeof SeverityLevelSchema>;

export const TelemetrySignalSchema = z.object({
  severityLevel: SeverityLevelSchema,
  moduleIdentifier: z.string().describe('Nombre del módulo o aparato emisor'),
  operationCode: z.string().describe('Código único de la acción realizada'),
  correlationIdentifier: z.string().uuid().describe('Identificador de seguimiento forense cross-module'),
  message: z.string().describe('Mensaje descriptivo del evento'),
  executionLatencyInMilliseconds: z.number().optional().describe('Tiempo de demora en milisegundos'),
  contextMetadata: z.record(z.string(), z.unknown()).optional().describe('Datos adicionales del entorno')
}).readonly();

export type ITelemetrySignal = z.infer<typeof TelemetrySignalSchema>;
