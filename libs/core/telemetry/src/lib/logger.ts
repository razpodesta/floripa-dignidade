import { z } from 'zod';

export const SeverityLevelSchema = z.enum(['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']);
export type SeverityLevel = z.infer<typeof SeverityLevelSchema>;

export const TelemetrySignalSchema = z.object({
  severityLevel: SeverityLevelSchema,
  moduleIdentifier: z.string().describe('Nombre del módulo emisor'),
  operationCode: z.string().describe('Código único de la acción realizada'),
  correlationIdentifier: z.string().uuid().describe('UUID de rastreo de la transacción'),
  message: z.string().describe('Mensaje descriptivo'),
  executionLatencyInMilliseconds: z.number().optional(),
  contextMetadata: z.record(z.string(), z.unknown()).optional()
}).readonly();

export type ITelemetrySignal = z.infer<typeof TelemetrySignalSchema>;
