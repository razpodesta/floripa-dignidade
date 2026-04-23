/**
 * 🎨 Shared Design System - Global System Entry Point
 * Protocolo OEDP-V13.0 - Visual Consistency & ISO Technical Naming.
 *
 * Este aparato centraliza la configuración visual basada en la colorimetría
 * del logotipo institucional:
 * - Azul Hercules: Autoridad Técnica y Conexión Territorial.
 * - Ámbar Acción: Solidaridad y Conversión Social.
 */

import {
  DesignSystemSchema,
  IColorHex,
  IDesignSystem
} from './schemas/DesignSystem.schema';

/**
 * @section Trazabilidad Operativa
 */
export const GLOBAL_DESIGN_SYSTEM_VERSION = '1.3.0';

/**
 * @section Definición Global de Colores
 * Valores técnicos extraídos del análisis de colorimetría del logotipo.
 */
const GlobalColorDefinition = {
  navyDeepBlue: '#003366' as IColorHex,
  bridgeLightBlue: '#4A90E2' as IColorHex,
  actionAmberOrange: '#F5A623' as IColorHex,
  pureWhite: '#FFFFFF' as IColorHex,
  slateDarkGray: '#1E293B' as IColorHex,
  slateMutedGray: '#64748B' as IColorHex
} as const;

/**
 * @section Objeto de Configuración de Tema Global
 * Estructura de datos inmutable que rige la estética del portal.
 */
const GlobalThemeConfigurationObject: IDesignSystem = {
  schemaVersion: GLOBAL_DESIGN_SYSTEM_VERSION,
  themeMode: 'SYSTEM',
  tokens: {
    colorPalette: {
      // Identidad Institucional (ISO: Confianza y Legitimidad)
      brandPrimary: GlobalColorDefinition.navyDeepBlue,
      brandSecondary: GlobalColorDefinition.bridgeLightBlue,

      // Embudo de Conversión (ISO: Llamada a la Acción Social)
      actionCall: GlobalColorDefinition.actionAmberOrange,
      actionHover: '#D48806' as IColorHex,

      // Arquitectura de Superficies (Layout de Portal)
      backgroundPage: '#F1F5F9' as IColorHex,
      surfaceCard: GlobalColorDefinition.pureWhite,
      surfaceOverlay: GlobalColorDefinition.pureWhite,

      // Semántica de Estado de Derechos Humanos (ISO 25010 Feedback)
      statusError: '#E11D48' as IColorHex,   // Alertas y Denuncias
      statusSuccess: '#10B981' as IColorHex, // Conversiones Exitosas
      statusWarning: '#FBBF24' as IColorHex,
      statusInfo: GlobalColorDefinition.bridgeLightBlue,

      // Tipografía y Neutros (ISO: Legibilidad y Accesibilidad)
      neutralText: GlobalColorDefinition.slateDarkGray,
      neutralMuted: GlobalColorDefinition.slateMutedGray,
    },

    spacingSystem: {
      baseUnit: 4,
      containerMaxWidth: 1280,
    },

    typographyHierarchy: {
      fontFamilyPrimary: "'Inter', system-ui, sans-serif",
      fontFamilySecondary: "'Lexend', system-ui, sans-serif",
      baseLineHeight: 1.6,
    }
  },

  accessibilityStandard: {
    isReducedMotionEnabled: false,
    isHighContrastEnabled: false,
    minimumTouchAreaSize: 44, // ISO/WCAG Standard
  }
};

/**
 * @section Exportación de Configuración Validada
 * Se aplica la Aduana Zod para garantizar que ninguna propiedad sea nula o inválida
 * antes de que el sistema de renderizado la consuma.
 */
export const GlobalThemeConfiguration = DesignSystemSchema.parse(GlobalThemeConfigurationObject);

/**
 * @section Re-exportación de Contratos Estructurales
 */
export * from './schemas/DesignSystem.schema';
