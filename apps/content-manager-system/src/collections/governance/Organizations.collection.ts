/**
 * @section CMS Architecture - Governance & Multi-Tenancy Axis
 * @description Define la colección de Organizaciones. Orquesta la jerarquía
 * institucional del ecosistema, gestionando la identidad legal, branding soberano
 * y cumplimiento de rigor técnico de acceso por índice.
 *
 * Protocolo OEDP-V16.0 - ISO Standard Naming & High Performance Architecture.
 * Vision: Dynamic Skinning & Multi-node Social Governance.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type { CollectionConfig } from 'payload';

/* 1. Infraestructura Core (Atmos PascalCase) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/**
 * @name OrganizationsCollection
 * @description Bóveda de entidades institucionales que conforman la red de impacto.
 */
export const OrganizationsCollection: CollectionConfig = {
  slug: 'organizations',

  labels: {
    singular: 'Organização',
    plural: 'Ecossistema Institucional',
  },

  admin: {
    useAsTitle: 'institutionalNameLiteral',
    group: 'Governança',
    defaultColumns: ['institutionalNameLiteral', 'legalIdentificationLiteral', 'operationalStatusLiteral'],
  },

  /**
   * @section Gobernanza de Acceso (Sovereign RBAC)
   * SANEADO Zenith: Acceso mediante signatura de índice para cumplir con
   * 'noPropertyAccessFromIndexSignature' (TS4111).
   */
  access: {
    read: () => true, // La red de transparencia y datos abiertos es pública por ley interna.
    create: ({ req: { user } }) => {
      // 🛡️ SANEADO: Acceso por corchetes obligatorio para propiedades de índice.
      const userRole = user?.['assignedAuthorityRoleLiteral'];
      return ['INFRASTRUCTURE_SOVEREIGN_AUDITOR', 'PLATFORM_GLOBAL_MANAGER'].includes(userRole || '');
    },
    update: ({ req: { user } }) => {
      const userRole = user?.['assignedAuthorityRoleLiteral'];
      return ['INFRASTRUCTURE_SOVEREIGN_AUDITOR', 'PLATFORM_GLOBAL_MANAGER'].includes(userRole || '');
    },
    delete: ({ req: { user } }) =>
      user?.['assignedAuthorityRoleLiteral'] === 'INFRASTRUCTURE_SOVEREIGN_AUDITOR',
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Dados Institucionais',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'institutionalNameLiteral',
                  type: 'text',
                  required: true,
                  label: 'Nome Institucional',
                  admin: { width: '50%' },
                },
                {
                  name: 'legalIdentificationLiteral',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'Identificação Legal (CNPJ/Tax ID)',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'institutionalSlugLiteral',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug de Rede (URL)',
              admin: {
                description: 'Identificador único para subdomínios ou rotas dinâmicas do portal.',
              },
            },
          ],
        },
        {
          label: 'Soberania Visual (Branding)',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryBrandColorHex',
                  type: 'text',
                  label: 'Cor Primária (Hex)',
                  defaultValue: '#003366',
                  admin: {
                    width: '50%',
                    description: 'Cor Hercules de Autoridade (CSS Variable Override).'
                  },
                },
                {
                  name: 'secondaryBrandColorHex',
                  type: 'text',
                  label: 'Cor Secundária (Hex)',
                  defaultValue: '#F5A623',
                  admin: {
                    width: '50%',
                    description: 'Cor de Conversão e Impacto Social.'
                  },
                },
              ],
            },
            {
              name: 'institutionalLogoIdentifier',
              type: 'upload',
              relationTo: 'media-vault',
              label: 'Logotipo Oficial',
              required: false,
            },
          ],
        },
        {
          label: 'Configuração de Rede',
          fields: [
            {
              name: 'isRootOrganizationBoolean',
              type: 'checkbox',
              defaultValue: false,
              label: 'Organização Master (Raiz)',
              admin: {
                description: 'Define se esta entidade possui autoridade sobre as demais na rede do enjambre.',
              },
            },
            {
              name: 'operationalStatusLiteral',
              type: 'select',
              required: true,
              defaultValue: 'ACTIVE',
              label: 'Status de Operação',
              options: [
                { label: 'Ativa e Verificada', value: 'ACTIVE' },
                { label: 'Suspensa por Auditoria', value: 'SUSPENDED' },
                { label: 'Arquivada/Inativa', value: 'ARCHIVED' },
              ],
            },
          ],
        },
      ],
    },
  ],

  /**
   * @section Trazabilidad de Gobernanza (Hooks)
   */
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: 'ORGANIZATIONS_COLLECTION',
          operationCode: `ORGANIZATION_${operation.toUpperCase()}`,
          correlationIdentifier: GenerateCorrelationIdentifier(),
          message: `Evento institucional procesado: ${doc['institutionalNameLiteral']} [${doc['operationalStatusLiteral']}]`,
          contextMetadata: { slug: doc['institutionalSlugLiteral'] }
        });
      },
    ],
  },
};
