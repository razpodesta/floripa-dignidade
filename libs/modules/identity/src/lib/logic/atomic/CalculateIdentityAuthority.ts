/**
 * @section Identity Logic - Identity Authority Calculator
 * @description Átomo encargado de computar el coeficiente de credibilidad
 * bayesiana del ciudadano. Evalúa la antigüedad, el nivel de verificación
 * y la vinculación social para determinar el peso de su voz en la red.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & High Performance SRE.
 * Vision: Anti-Spam & Verified Social Impact.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import type { IUserIdentity } from '../../schemas/UserIdentity.schema';

/**
 * @section Pesos Algorítmicos (Constants)
 * Define la influencia de cada factor en la autoridad final del ciudadano.
 */
const BASE_TRUST_WEIGHT_NUMERIC = 0.1;           // Peso inicial para anónimos.
const SOCIAL_LINK_BONUS_NUMERIC = 0.2;           // Bonus por vincular Google/Apple/X.
const LEGAL_VERIFICATION_BONUS_NUMERIC = 0.5;    // Bonus por validación documental.
const SENIORITY_MAXIMUM_BONUS_NUMERIC = 0.2;     // Bonus máximo por antigüedad (1 año).

/**
 * Calcula el coeficiente de autoridad institucional de una identidad.
 *
 * @param citizenIdentitySnapshot - ADN de la identidad capturada en la sesión.
 * @returns {Promise<number>} Coeficiente de confianza normalizado entre 0.0 y 1.0.
 */
export const CalculateIdentityAuthority = async (
  citizenIdentitySnapshot: IUserIdentity
): Promise<number> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    'IDENTITY_AUTHORITY_CALCULATOR',
    'EXECUTE_BAYESIAN_WEIGHT_COMPUTATION',
    correlationIdentifier,
    async () => {

      // 1. CÁLCULO DE BASE SOCIAL
      // El respaldo de un tercero (OAuth2) eleva la confianza inicial.
      const hasSocialLinkBoolean = citizenIdentitySnapshot.socialProviderIdentifier !== 'INTERNAL_INFRASTRUCTURE';
      let currentAuthorityScoreNumeric = BASE_TRUST_WEIGHT_NUMERIC;

      if (hasSocialLinkBoolean) {
        currentAuthorityScoreNumeric += SOCIAL_LINK_BONUS_NUMERIC;
      }

      // 2. CÁLCULO DE VERIFICACIÓN SRE
      // La validación humana de documentos es el factor de mayor peso.
      if (citizenIdentitySnapshot.isIdentityLegallyVerifiedBoolean) {
        currentAuthorityScoreNumeric += LEGAL_VERIFICATION_BONUS_NUMERIC;
      }

      // 3. CÁLCULO DE ANTIGÜEDAD (Loyalty Factor)
      const accountCreationDate = new Date(citizenIdentitySnapshot.occurrenceTimestampISO);
      const currentDate = new Date();
      const accountAgeInDaysQuantity = Math.floor(
        (currentDate.getTime() - accountCreationDate.getTime()) / (1000 * 3600 * 24)
      );

      /**
       * Escalado de antigüedad: 365 días para alcanzar el bonus máximo.
       */
      const seniorityMultiplierNumeric = Math.min(accountAgeInDaysQuantity / 365, 1);
      currentAuthorityScoreNumeric += (seniorityMultiplierNumeric * SENIORITY_MAXIMUM_BONUS_NUMERIC);

      // 4. NORMALIZACIÓN DE SALIDA
      // Garantizamos que el score nunca exceda el rango 0.0 - 1.0.
      const finalAuthorityCoefficientNumeric = Math.min(currentAuthorityScoreNumeric, 1.0);

      // 5. REPORTE DE AUDITORÍA COGNITIVA
      void EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: 'IDENTITY_AUTHORITY_CALCULATOR',
        operationCode: 'AUTHORITY_COEFFICIENT_GENERATED',
        correlationIdentifier,
        message: 'IDENTITY.LOGS.AUTHORITY_CALCULATED',
        contextMetadata: {
          citizenIdentifier: citizenIdentitySnapshot.identityIdentifier,
          authorityScore: finalAuthorityCoefficientNumeric,
          accountAgeInDays: accountAgeInDaysQuantity,
          isVerified: citizenIdentitySnapshot.isIdentityLegallyVerifiedBoolean
        }
      });

      return finalAuthorityCoefficientNumeric;
    }
  );
};
