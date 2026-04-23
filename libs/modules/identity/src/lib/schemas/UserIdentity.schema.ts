import { z } from 'zod';
import { UserAccessRoleSchema } from './UserAccessRole.schema';

/** Identificador de usuario con tipado nominal para evitar colisión de ADN. */
export const UserIdentifierSchema = z.string().uuid().brand<'UserIdentifier'>();
export type UserIdentifier = z.infer<typeof UserIdentifierSchema>;

/**
 * @name UserIdentitySchema
 * @description Contrato maestro de identidad ciudadana.
 */
export const UserIdentitySchema = z.object({
  identifier: UserIdentifierSchema.describe('Identificador inmutable del ciudadano'),

  fullLegalName: z.string()
    .min(3)
    .describe('Nombre completo según registro civil'),

  emailAddress: z.string().email()
    .describe('Correo electrónico oficial de contacto'),

  assignedAccessRole: UserAccessRoleSchema
    .default('ANONYMOUS_USER'),

  isIdentityVerified: z.boolean()
    .default(false)
    .describe('Estado de verificación documental'),
}).readonly();

export type IUserIdentity = z.infer<typeof UserIdentitySchema>;
