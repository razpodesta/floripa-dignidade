/**
 * @section Messaging DNA - Communication Group Schema
 * @description Contrato soberano para la gestión de Grupos de Comunicación e Impacto.
 * Define la estructura de "Action Hubs" territoriales e institucionales, con
 * soporte para gobernanza multinivel y auditoría social.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Data Sovereignty.
 * Vision: Context-Aware Communication Hubs (Superior to WhatsApp/Twitter).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section ADN Criptográfico - Tipado Nominal
 */
export const GroupIdentifierSchema = z.string().uuid().brand<'CommunicationGroupIdentifier'>();
export type GroupIdentifier = z.infer<typeof GroupIdentifierSchema>;

/**
 * Modelos de Gobernanza de Grupo.
 * BROADCAST_ONLY: Solo autoridades emiten (Ej: Alertas oficiales).
 * MODERATED_DIALOGUE: Participación ciudadana con filtro previo.
 * OPEN_COLLABORATION: Interacción fluida entre ciudadanos verificados.
 */
export const GroupGovernanceModelSchema = z.enum([
  'BROADCAST_ONLY',
  'MODERATED_DIALOGUE',
  'OPEN_COLLABORATION'
]).describe('Modelo de interacción y permisos de despacho del grupo.');

/**
 * Niveles de Visibilidad Soberana.
 * PUBLIC_TRANSPARENCY: Indexable y visible para cualquier ciudadano.
 * VERIFIED_ONLY: Solo accesible para identidades validadas por la ONG.
 * INSTITUTIONAL_PRIVATE: Grupos técnicos de operación interna.
 */
export const GroupVisibilityModeSchema = z.enum([
  'PUBLIC_TRANSPARENCY',
  'VERIFIED_ONLY',
  'INSTITUTIONAL_PRIVATE'
]).describe('Nivel de exposición del grupo en el buscador universal.');

/**
 * @name CommunicationGroupSchema
 * @description Aduana de ADN para la creación y gestión de círculos de comunicación.
 */
export const CommunicationGroupSchema = z.object({
  
  /** Identificador único inalterable del Hub. */
  groupIdentifier: GroupIdentifierSchema,

  /** Nombre oficial del grupo (Ej: "Comité de Ética - Bairro Tapera"). */
  officialDisplayNameLiteral: z.string()
    .min(3)
    .max(120)
    .describe('Nombre público del círculo de comunicación.'),

  /** 
   * Identificador de Red (Slug).
   * ISO Standard Path: Ej. "alerta-tapera-norte".
   */
  technicalSlugLiteral: z.string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Identificador único para URLs y menciones técnicas.'),

  groupDescriptionLiteral: z.string()
    .max(500)
    .describe('Propósito y reglas de convivencia del grupo.'),

  /** 
   * Vínculo Institucional.
   * Referencia al UUID de la Organización propietaria en el CMS.
   */
  organizationalOwnerIdentifier: z.string().uuid()
    .describe('Entidad responsable de la moderación y veracidad del grupo.'),

  /** 
   * Enfoque Territorial (IBGE Integration).
   * ID técnico del distrito o barrio capturado del territorial-engine.
   */
  territorialFocusIdentifier: z.string().optional()
    .describe('ID de localidad oficial que ancla el grupo a un territorio físico.'),

  governanceModelLiteral: GroupGovernanceModelSchema
    .default('MODERATED_DIALOGUE'),

  visibilityModeLiteral: GroupVisibilityModeSchema
    .default('VERIFIED_ONLY'),

  /** 
   * Metadatos de Participación.
   * Permite al Neural Sentinel realizar triaje estadístico de impacto.
   */
  participationMetadata: z.object({
    totalMemberQuantity: z.number().int().nonnegative().default(0),
    isOfficialVerifiedBoolean: z.boolean().default(false),
    lastActivityTimestampISO: z.string().datetime().optional()
  }),

  /** Estado Operativo (Soft Delete Protocol). */
  operationalStatusLiteral: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED'])
    .default('ACTIVE'),

  occurrenceTimestampISO: z.string().datetime()
    .describe('Fecha de creación del Hub en la infraestructura soberana.'),

}).readonly();

/**
 * @section ADN Tipado (Verbatim Module Syntax)
 */
export type ICommunicationGroup = z.infer<typeof CommunicationGroupSchema>;
export type TGroupGovernanceModel = z.infer<typeof GroupGovernanceModelSchema>;