/**
 * @section Tools - Weaver Configuration & DNA
 * @description Centraliza las constantes, rutas físicas y contratos de tipos
 * para el enjambre de compilación lingüística.
 *
 * Protocolo OEDP-V16.0 - Sovereign Data & Single Source of Truth.
 */

import * as path from 'node:path';

const WORKSPACE_ROOT_DIRECTORY_LITERAL = path.resolve(process.cwd());

export const WEAVER_CONFIGURATION = {
  LIBRARIES_SOURCE_DIRECTORY_LITERAL: path.join(WORKSPACE_ROOT_DIRECTORY_LITERAL, 'libs'),
  TARGET_OUTPUT_DIRECTORY_LITERAL: path.join(
    WORKSPACE_ROOT_DIRECTORY_LITERAL,
    'apps/floripa-dignidade/src/app/i18n/dictionaries'
  ),
  FORENSIC_REPORTS_DIRECTORY_LITERAL: path.join(WORKSPACE_ROOT_DIRECTORY_LITERAL, 'reports'),
  SUPPORTED_LOCALES_COLLECTION:['pt-BR', 'es-ES', 'en-US'] as const,
  WEAVER_ENGINE_IDENTIFIER_LITERAL: 'INTERNATIONALIZATION_WEAVER_ENGINE',
} as const;

export interface IForensicAuditEntry {
  readonly moduleIdentifierLiteral: string;
  readonly filesystemPathLiteral: string;
  readonly processedLocalesCollection: string[];
}

export type ILinguisticModulePayload = Record<string, Record<string, unknown>>;
