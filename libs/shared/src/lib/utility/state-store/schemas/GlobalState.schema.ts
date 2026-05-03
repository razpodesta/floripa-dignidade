/**
 * @section Infrastructure DNA - Global State Schema (Zenith Evolution)
 * @description Única Fuente de Verdad (SSOT) para el contrato de estado del ecosistema.
 * Define la estructura inmutable de los dominios de UI, Identidad, Presencia, 
 * Gobernanza Democrática y Resiliencia SRE.
 *
 * Protocolo OEDP-V17.0 - High Performance, Sovereign Data & ReadOnly Integrity.
 * SANEADO Zenith: Erradicación de abreviatura 'DND' por 'DO_NOT_DISTURB' (ISO Compliance).
 * 
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { z } from 'zod';

/**
 * @section ADN de Presencia Experta (Sovereign Enums)
 * @description Define los estados ontológicos de vida del ciudadano en la red.
 * SANEADO Zenith: Se aplica la regla de "Cero Abreviaturas" (ADR 0002).
 */
export const AvailabilityStatusEnum = z.enum([
  'ONLINE',         // Sesión activa e interactuando.
  'AWAY',           // Sesión abierta sin actividad física.
  'DO_NOT_DISTURB', // 🛡️ SANEADO: Sustituye al antiguo 'DND'.
  'OFFLINE'         // Desconectado del bus de datos.
]).describe('Estados soberanos de disponibilidad del ciudadano en tiempo real.');

/** Representación en tiempo de compilación del estado de vida. */
export type TAvailabilityStatus = z.infer<typeof AvailabilityStatusEnum>;

/**
 * @domain 1: UI & NAVEGACIÓN VOLÁTIL
 * @description Gestiona estados transitorios de la interfaz que no requieren persistencia.
 */
export const UiNavigationStateSchema = z.object({
  isSearchPanelOpenBoolean: z.boolean().default(false),
  isMobileMenuOpenBoolean: z.boolean().default(false),
  activeModalIdentifierLiteral: z.string().nullable().default(null),
}).readonly();

/**
 * @domain 2: PREFERENCIAS SOBERANAS
 * @description Persiste las decisiones fundamentales del ciudadano sobre su entorno.
 */
export const UserPreferenceStateSchema = z.object({
  preferredLinguisticLocaleLiteral: z.enum(['pt-BR', 'es-ES', 'en-US']).default('pt-BR'),
  visualThemeModeLiteral: z.enum(['LIGHT', 'DARK', 'SYSTEM']).default('SYSTEM'),
  hasAcceptedPrivacyPolicyBoolean: z.boolean().default(false),
}).readonly();

/**
 * @domain 3: IDENTIDAD & REPUTACIÓN (Core Identity)
 * @description ADN del ciudadano basado en el peso de su autoridad y veracidad histórica.
 */
export const CredibilityIdentityStateSchema = z.object({
  /** Coeficiente bayesiano de autoridad (0.1 a 1.0) */
  actorAuthorityWeightNumeric: z.number().min(0).max(1).default(0.1),
  isVerifiedHumanBoolean: z.boolean().default(false),
  socialProviderLiteral: z.string().optional(),
}).readonly();

/**
 * @domain 4: PRESENCIA COGNITIVA (Expert Presence)
 * @description Gestiona el rastro de disponibilidad y dispositivos para el ruteo push.
 */
export const UserPresenceStateSchema = z.object({
  /** 🛡️ SANEADO: Uso del Enum centralizado con literales ISO. */
  availabilityStatus: AvailabilityStatusEnum.default('OFFLINE'),

  customStatusMessageLiteral: z.string().max(60).default(''),

  /** Token para despacho de notificaciones PWA en hardware físico. */
  activePushTokenSecret: z.string().optional(),

  lastHeartbeatTimestampISO: z.string().datetime(),
}).readonly();

/**
 * @domain 5: GOBERNANZA & DEMOCRACIA LÍQUIDA
 * @description Gestiona la delegación de soberanía y antigüedad institucional.
 */
export const DemocraticGovernanceStateSchema = z.object({
  activeMandataryIdentifier: z.string().uuid().nullable().default(null),
  isIdentityBiometricallyVerifiedBoolean: z.boolean().default(false),
  communitySeniorityLevelQuantity: z.number().int().nonnegative().default(0),
  favoriteGroupsCollection: z.array(z.string().uuid()).default([]),
}).readonly();

/**
 * @domain 6: CACHÉ DE IMPACTO (Hydration Guard)
 * @description Almacena snapshots de indicadores para evitar estados de "Pantalla en Blanco".
 */
export const ImpactCacheStateSchema = z.object({
  lastViewedIndicatorsMapping: z.record(z.string(), z.object({
    trustScore: z.number(),
    consensusIndex: z.number()
  })).default({}),
}).readonly();

/**
 * @domain 7: SRE SYNC SENTRY (Resilience)
 * @description Sensor de resiliencia encargado del estado de red y colas de sincronización.
 */
export const SyncSentryStateSchema = z.object({
  isNetworkOnlineBoolean: z.boolean().default(true),
  pendingActionsQueueQuantity: z.number().default(0),
  lastSuccessfulSyncTimestampISO: z.string().datetime().optional(),
}).readonly();

/**
 * @domain 8: SESIÓN & RECUPERACIÓN (Forensic Persistence)
 * @description Salvaguarda de borradores y rastro de última interacción.
 */
export const SessionRecoveryStateSchema = z.object({
  humanRightsReportDraftLiteral: z.string().optional(),
  lastInteractionTimestampISO: z.string().datetime().optional(),
}).readonly();

/**
 * @name IGlobalStateADN
 * @description Contrato maestro que ensambla todos los dominios de estado institucional.
 */
export type IGlobalStateADN = {
  readonly ui: z.infer<typeof UiNavigationStateSchema>;
  readonly preferences: z.infer<typeof UserPreferenceStateSchema>;
  readonly identity: z.infer<typeof CredibilityIdentityStateSchema>;
  readonly presence: z.infer<typeof UserPresenceStateSchema>;
  readonly governance: z.infer<typeof DemocraticGovernanceStateSchema>;
  readonly impactCache: z.infer<typeof ImpactCacheStateSchema>;
  readonly sync: z.infer<typeof SyncSentryStateSchema>;
  readonly session: z.infer<typeof SessionRecoveryStateSchema>;
};