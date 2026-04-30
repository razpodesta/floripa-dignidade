/**
 * @section Infrastructure DNA - Global State Schema (Zenith Evolution)
 * @description Única Fuente de Verdad (SSOT) para el contrato de estado del ecosistema.
 * Define la estructura inmutable de los dominios de UI, Identidad, Presencia,
 * Gobernanza Democrática y Resiliencia SRE.
 *
 * Protocolo OEDP-V17.0 - High Performance, Sovereign Data & ReadOnly Integrity.
 * SANEADO Zenith: Consolidación de TAvailabilityStatus para evitar violaciones de frontera.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @section ADN de Presencia Experta (Sovereign Enums)
 * SANEADO Zenith: Definición centralizada para consumo del 'territorial-engine'
 * y 'messaging-engine' sin romper la jerarquía de Nx.
 */
export const AvailabilityStatusEnum = z.enum(['ONLINE', 'AWAY', 'DND', 'OFFLINE'])
  .describe('Estados ontológicos de presencia del ciudadano en la red.');

/** Representación en tiempo de compilación del estado de vida. */
export type TAvailabilityStatus = z.infer<typeof AvailabilityStatusEnum>;

/**
 * @domain 1: UI & NAVEGACIÓN VOLÁTIL
 * Gestiona estados transitorios de la interfaz que no requieren persistencia.
 */
export const UiNavigationStateSchema = z.object({
  isSearchPanelOpenBoolean: z.boolean().default(false),
  isMobileMenuOpenBoolean: z.boolean().default(false),
  activeModalIdentifierLiteral: z.string().nullable().default(null),
}).readonly();

/**
 * @domain 2: PREFERENCIAS SOBERANAS
 * Persiste las decisiones fundamentales del ciudadano sobre su entorno.
 */
export const UserPreferenceStateSchema = z.object({
  preferredLinguisticLocaleLiteral: z.enum(['pt-BR', 'es-ES', 'en-US']).default('pt-BR'),
  visualThemeModeLiteral: z.enum(['LIGHT', 'DARK', 'SYSTEM']).default('SYSTEM'),
  hasAcceptedPrivacyPolicyBoolean: z.boolean().default(false),
}).readonly();

/**
 * @domain 3: IDENTIDAD & REPUTACIÓN (Core Identity)
 * ADN del ciudadano basado en el peso de su autoridad y veracidad histórica.
 */
export const CredibilityIdentityStateSchema = z.object({
  /** Coeficiente bayesiano de autoridad (0.1 a 1.0) */
  actorAuthorityWeightNumeric: z.number().min(0).max(1).default(0.1),
  isVerifiedHumanBoolean: z.boolean().default(false),
  socialProviderLiteral: z.string().optional(),
}).readonly();

/**
 * @domain 4: PRESENCIA COGNITIVA (Expert Presence)
 * Gestiona el rastro de disponibilidad y dispositivos para el ruteo push.
 */
export const UserPresenceStateSchema = z.object({
  /** 🛡️ SANEADO: Uso del Enum centralizado para integridad de tipos */
  availabilityStatus: AvailabilityStatusEnum.default('OFFLINE'),

  customStatusMessageLiteral: z.string().max(60).default(''),

  /** Token para despacho de notificaciones PWA en escritorio/móvil. */
  activePushTokenSecret: z.string().optional(),

  lastHeartbeatTimestampISO: z.string().datetime(),
}).readonly();

/**
 * @domain 5: GOBERNANZA & DEMOCRACIA LÍQUIDA
 */
export const DemocraticGovernanceStateSchema = z.object({
  activeMandataryIdentifier: z.string().uuid().nullable().default(null),
  isIdentityBiometricallyVerifiedBoolean: z.boolean().default(false),
  communitySeniorityLevelQuantity: z.number().int().nonnegative().default(0),
  favoriteGroupsCollection: z.array(z.string().uuid()).default([]),
}).readonly();

/**
 * @domain 6: CACHÉ DE IMPACTO (Hydration Guard)
 */
export const ImpactCacheStateSchema = z.object({
  lastViewedIndicatorsMapping: z.record(z.string(), z.object({
    trustScore: z.number(),
    consensusIndex: z.number()
  })).default({}),
}).readonly();

/**
 * @domain 7: SRE SYNC SENTRY (Resilience)
 */
export const SyncSentryStateSchema = z.object({
  isNetworkOnlineBoolean: z.boolean().default(true),
  pendingActionsQueueQuantity: z.number().default(0),
  lastSuccessfulSyncTimestampISO: z.string().datetime().optional(),
}).readonly();

/**
 * @domain 8: SESIÓN & RECUPERACIÓN (Forensic Persistence)
 */
export const SessionRecoveryStateSchema = z.object({
  humanRightsReportDraftLiteral: z.string().optional(),
  lastInteractionTimestampISO: z.string().datetime().optional(),
}).readonly();

/**
 * @name IGlobalStateADN
 * @description Contrato maestro que ensambla todos los dominios de estado.
 */
export type IGlobalStateADN = {
  ui: z.infer<typeof UiNavigationStateSchema>;
  preferences: z.infer<typeof UserPreferenceStateSchema>;
  identity: z.infer<typeof CredibilityIdentityStateSchema>;
  presence: z.infer<typeof UserPresenceStateSchema>;
  governance: z.infer<typeof DemocraticGovernanceStateSchema>;
  impactCache: z.infer<typeof ImpactCacheStateSchema>;
  sync: z.infer<typeof SyncSentryStateSchema>;
  session: z.infer<typeof SessionRecoveryStateSchema>;
};
