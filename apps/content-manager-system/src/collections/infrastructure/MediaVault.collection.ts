/**
 * @section CMS Architecture - Infrastructure & Forensic Evidence Axis
 * @description Define la bóveda multimedia del ecosistema. Orquesta la persistencia
 * de activos visuales en infraestructura Cloud (S3/Supabase), garantizando la
 * integridad de la evidencia, optimización de entrega (AVIF/WebP) y accesibilidad ISO.
 *
 * Protocolo OEDP-V16.0 - ISO Standard Naming & Cloud Sovereign (ADR 0015).
 * Vision: Immutable Evidence Preservation for Human Rights.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type { CollectionConfig } from 'payload';

/* 1. Infraestructura Core & Identity (Atmos PascalCase) */
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/**
 * @name MediaVaultCollection
 * @description Bóveda de activos digitales optimizada para el impacto social.
 * SANEADO Zenith: Preparado para deshabilitar persistencia local en favor de Cloud Storage.
 */
export const MediaVaultCollection: CollectionConfig = {
  slug: 'media-vault',

  labels: {
    singular: 'Mídia/Evidência',
    plural: 'Bóveda Multimedia',
  },

  admin: {
    group: 'Infraestrutura',
    description: 'Gerenciamento de evidências visuais e ativos de marca institucional.',
    useAsTitle: 'alternativeTextLiteral',
    defaultColumns: [
      'filename',
      'alternativeTextLiteral',
      'mimeType',
      'filesize'
    ],
  },

  /**
   * @section Gobernanza de Acceso (Sovereign RBAC)
   * SANEADO Zenith: Acceso mediante signatura de índice para cumplimiento de TS4111.
   * La lectura es pública para transparencia, la escritura requiere autoridad.
   */
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      const userAuthorityRole = user?.['assignedAuthorityRoleLiteral'];
      return !!userAuthorityRole;
    },
    update: ({ req: { user } }) => {
      const userAuthorityRole = user?.['assignedAuthorityRoleLiteral'];
      return ['INFRASTRUCTURE_SOVEREIGN_AUDITOR', 'PLATFORM_GLOBAL_MANAGER', 'ORGANIZATION_ADMINISTRATOR'].includes(
        userAuthorityRole || ''
      );
    },
    delete: ({ req: { user } }) => {
      const userAuthorityRole = user?.['assignedAuthorityRoleLiteral'];
      return ['INFRASTRUCTURE_SOVEREIGN_AUDITOR', 'PLATFORM_GLOBAL_MANAGER'].includes(
        userAuthorityRole || ''
      );
    },
  },

  /**
   * @section Configuración de Carga (Cloud Optimized)
   * Implementa la generación de variantes para optimización de Core Web Vitals.
   * SANEADO: Se elimina 'staticDir' para delegar la ruta física al Plugin de S3 en payload.config.
   */
  upload: {
    // staticDir: 'media', // DESHABILITADO: El adaptador Cloud gestionará el destino.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'standard_card',
        width: 800,
        // Proporción áurea aplicada para visualización de noticias.
        height: 500,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'forensic_high_definition',
        width: 1920,
        position: 'centre',
        // AVIF proporciona máxima fidelidad con mínimo peso para evidencias.
        formatOptions: { format: 'avif', options: { quality: 90 } },
      },
    ],
    adminThumbnail: 'thumbnail',
  },

  fields: [
    {
      name: 'alternativeTextLiteral',
      type: 'text',
      required: true,
      label: 'Texto Alternativo (Acessibilidade ISO)',
      admin: {
        description: 'Descrição textual para tecnologias assistivas (SEO/WCAG).',
        placeholder: 'Ex: Evidência de violação de direitos humanos no bairro Tapera',
      },
    },
    {
      name: 'captionLiteral',
      type: 'textarea',
      label: 'Legenda Técnica / Contextual',
      admin: {
        description: 'Informação adicional sobre a origem ou contexto da mídia.',
      },
    },
    {
      name: 'organizationOwnerIdentifier',
      type: 'relationship',
      relationTo: 'organizations',
      label: 'Organização Proprietária',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Vínculo institucional para governança multi-tenancy.',
      },
    },
  ],

  /**
   * @section Trazabilidad Forense (Integrity Hooks)
   */
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        if (operation === 'create') {
          EmitTelemetrySignal({
            severityLevel: 'INFO',
            moduleIdentifier: 'MEDIA_VAULT_INFRASTRUCTURE',
            operationCode: 'CLOUD_ASSET_INDEXED',
            correlationIdentifier: GenerateCorrelationIdentifier(),
            message: `Ativo multimedia indexado com sucesso: ${doc['filename']}`,
            contextMetadata: {
              mimeType: doc['mimeType'],
              fileSizeInBytes: doc['filesize'],
              hasOrganizationVincule: !!doc['organizationOwnerIdentifier'],
            }
          });
        }
      },
    ],
  },
};
