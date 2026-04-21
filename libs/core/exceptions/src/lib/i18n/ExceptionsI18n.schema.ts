import { z } from 'zod';

export const ExceptionsI18nSchema = z.object({
  codes: z.object({
    VALIDATION_FAILED: z.string(),
    UNAUTHORIZED_ACCESS: z.string(),
    INTERNAL_SYSTEM_FAILURE: z.string(),
    RESOURCE_NOT_FOUND: z.string(),
    EXTERNAL_SERVICE_TIMEOUT: z.string()
  })
}).readonly();

export type IExceptionsI18n = z.infer<typeof ExceptionsI18nSchema>;
