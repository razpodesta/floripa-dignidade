/**
 * @section CMS Architecture - Identity Sovereignty Axis
 * @description Define la colección de Ciudadanos e Interventores. Implementa
 * el control de acceso basado en roles (RBAC) consumiendo el contrato global
 * de la librería de Identidad.
 *
 * Protocolo OEDP-V16.0 - ISO Standard Naming & SSOT Governance.
 * SANEADO Zenith: Erradicación de 'Magic Strings' y acoplamiento estricto de roles.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type { CollectionConfig } from 'payload';

/* 1. Infraestructura Core & Identity (Atmos PascalCase) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

import type { UserAccessRole } from '@floripa-dignidade/identity';

/**
 * @section Diccionario Soberano de Roles
 * @description Mapeo estricto. TypeScript lanzará un error de compilación
 * si el búnker de 'identity' modifica, añade o elimina un rol.
 */
const INSTITUTIONAL_ROLE_LABELS_MAPPING: Record<UserAccessRole, string> = {
  INFRASTRUCTURE_SOVEREIGN_AUDITOR: 'Auditor de Infraestrutura (SRE)',
  PLATFORM_GLOBAL_MANAGER: 'Gestor Global da Plataforma',
  ORGANIZATION_ADMINISTRATOR: 'Administrador de Organização',
  ORGANIZATION_OPERATOR: 'Operador de Impacto',
  CITIZEN_REGISTERED: 'Cidadão Verificado',
  CITIZEN_ANONYMOUS: 'Cidadão Anônimo (Sistema/Temporário)',
};

/**
 * @section Reglas Atómicas de Acceso
 * Encapsulan la lógica de seguridad para mantener la pureza del objeto de configuración.
 */
const hasSovereignOrManagerAuthorityBoolean = (userRole?: string): boolean => {
  return (
    userRole === 'INFRASTRUCTURE_SOVEREIGN_AUDITOR' ||
    userRole === 'PLATFORM_GLOBAL_MANAGER'
  );
};

/**
 * @name CitizenUsersCollection
 * @description Bóveda de identidades soberanas con autoridad sobre el ecosistema.
 */
export const CitizenUsersCollection: CollectionConfig = {
  slug: 'citizen-users',

  labels: {
    singular: 'Cidadão',
    plural: 'Rede de Cidadania',
  },

  admin: {
    useAsTitle: 'fullLegalNameLiteral',
    group: 'Identidade & Acesso',
    defaultColumns:['fullLegalNameLiteral', 'email', 'assignedAuthorityRoleLiteral'],
    listSearchableFields:['fullLegalNameLiteral', 'email'],
  },

  /**
   * @section Gobernanza de Acceso (Sovereign RBAC)
   * 🛡️ SANEADO: Las políticas de acceso ahora consumen las reglas atómicas.
   */
  access: {
    read: ({ req: { user } }) => {
      const activeUserRoleLiteral = user?.['assignedAuthorityRoleLiteral'] as string | undefined;

      if (activeUserRoleLiteral === 'INFRASTRUCTURE_SOVEREIGN_AUDITOR') return true;

      // Un usuario solo puede leer su propio perfil si no es auditor
      return { id: { equals: user?.id } };
    },

    delete: ({ req: { user } }) => {
      const activeUserRoleLiteral = user?.['assignedAuthorityRoleLiteral'] as string | undefined;
      return activeUserRoleLiteral === 'INFRASTRUCTURE_SOVEREIGN_AUDITOR';
    },

    create: () => true, // El registro inicial ciudadano es público
  },

  auth: {
    tokenExpiration: 7200,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000,
  },

  fields:[
    {
      name: 'fullLegalNameLiteral',
      type: 'text',
      required: true,
      label: 'Nome Completo (Registro Civil)',
      admin: { placeholder: 'Ex: João da Silva Sauro' },
    },
    {
      name: 'assignedAuthorityRoleLiteral',
      type: 'select',
      required: true,
      defaultValue: 'CITIZEN_REGISTERED',
      label: 'Nível de Autoridade Institucional',
      /**
       * 🛡️ SANEADO Zenith: Generación dinámica y tipada de las opciones
       * directamente desde el diccionario soberano.
       */
      options: Object.entries(INSTITUTIONAL_ROLE_LABELS_MAPPING).map(
        ([roleValueLiteral, roleLabelLiteral]) => ({
          label: roleLabelLiteral,
          value: roleValueLiteral,
        })
      ),
      access: {
        // Bloqueo de escalada de privilegios: Solo roles supremos pueden cambiar roles
        update: ({ req: { user } }) => {
          const activeUserRoleLiteral = user?.['assignedAuthorityRoleLiteral'] as string | undefined;
          return hasSovereignOrManagerAuthorityBoolean(activeUserRoleLiteral);
        },
      },
    },
    {
      name: 'tenantOrganizationIdentifier',
      type: 'relationship',
      relationTo: 'organizations',
      label: 'Organização de Vínculo',
      hasMany: false,
      admin: {
        description: 'Vínculo institucional para governança multi-tenancy.',
        condition: (data) => data['assignedAuthorityRoleLiteral'] !== 'CITIZEN_REGISTERED',
      },
    },
    {
      type: 'group',
      name: 'forensicIdentificationGroup',
      label: 'Identificação e Privacidade',
      fields:[
        {
          type: 'row',
          fields:[
            {
              name: 'isIdentityLegallyVerifiedBoolean',
              type: 'checkbox',
              defaultValue: false,
              label: 'Identidade Validada',
              admin: { width: '50%' },
            },
            {
              name: 'hasAcceptedPrivacyPolicyBoolean',
              type: 'checkbox',
              required: true,
              defaultValue: false,
              label: 'Consentimento LGPD Ativo',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],

  /**
   * @section Trazabilidad Forense (Hooks)
   */
  hooks: {
    afterChange:[
      ({ doc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          EmitTelemetrySignal({
            severityLevel: 'INFO',
            moduleIdentifier: 'CITIZEN_USERS_COLLECTION',
            operationCode: `IDENTITY_${operation.toUpperCase()}`,
            correlationIdentifier: GenerateCorrelationIdentifier(),
            message: `Evento de identidade processado: ${doc['email']}`,
            contextMetadata: {
              assignedRoleLiteral: doc['assignedAuthorityRoleLiteral'],
              perpetratorIdentityLiteral: req.user?.email ?? 'SYSTEM_BOOTSTRAP'
            }
          });
        }
      },
    ],
  },
};
