/**
 * @section Identity Logic - Name Anonymization Atom
 * @description Implementa o protocolo de privacidade institucional (Nome + Inicial).
 * Transforma identidades civis em tokens públicos seguros para evitar o doxing,
 * garantindo a conformidade com a LGPD e o padrão ISO de transparência.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Forensic Traceability.
 * SANEADO Zenith: Injeção de Telemetria, Validação Zod e Purga de Hardcoded Strings.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime
} from '@floripa-dignidade/telemetry';

import { ValidationException } from '@floripa-dignidade/exceptions';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import { AnonymizeCitizenNameSchema } from './schemas/AnonymizeCitizenName.schema';
import type { IAnonymizeCitizenNameParameters } from './schemas/AnonymizeCitizenName.schema';

/** Identificador técnico do aparato para o Neural Sentinel. */
const ANONYMIZER_ATOM_IDENTIFIER = 'IDENTITY_NAME_ANONYMIZER_ATOM';

/**
 * Processa um nome legal completo e o transforma em uma assinatura pública anonimizada.
 * Exemplo: "Ana Luiza Silveira" -> "ANA S."
 *
 * @param parameters - Objeto contendo o nome e o placeholder de fallback.
 * @returns {Promise<string>} Assinatura anonimizada purificada.
 */
export const AnonymizeCitizenName = async (
  parameters: IAnonymizeCitizenNameParameters
): Promise<string> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    ANONYMIZER_ATOM_IDENTIFIER,
    'EXECUTE_NAME_ANONYMIZATION_TRANSACTION',
    correlationIdentifier,
    async () => {

      // 1. ADUANA DE ADN (Safe Parsing)
      const validationResult = AnonymizeCitizenNameSchema.safeParse(parameters);

      if (!validationResult.success) {
        throw new ValidationException('CONTRATO_DE_ANONIMIZACAO_VIOLADO', {
          issues: validationResult.error.flatten()
        });
      }

      const { fullLegalNameLiteral, anonymousPlaceholderLiteral } = validationResult.data;

      /**
       * 2. ALGORITMO DE PRIVACIDADE (ISO Standard)
       * Normalizamos para UpperCase e removemos espaços redundantes.
       */
      const sanitizedNameLiteral = fullLegalNameLiteral.toUpperCase();
      const nameSegmentsCollection = sanitizedNameLiteral.split(/\s+/);

      // Verificação de segurança para entradas vazias após o split
      if (nameSegmentsCollection.length === 0 || sanitizedNameLiteral === '') {
        return anonymousPlaceholderLiteral;
      }

      const firstNameLiteral = nameSegmentsCollection[0] ?? '';
      let finalAnonymizedResultLiteral = firstNameLiteral;

      /**
       * 3. EXTRAÇÃO DE INICIAL DE LINHAGEM
       * Se houver sobrenome, extraímos apenas a primeira letra para opacidade.
       */
      if (nameSegmentsCollection.length > 1) {
        const lastSegmentIndexNumeric = nameSegmentsCollection.length - 1;
        const lastNamePartLiteral = nameSegmentsCollection[lastSegmentIndexNumeric] ?? '';
        const lastNameInitialLiteral = lastNamePartLiteral.charAt(0);

        finalAnonymizedResultLiteral = `${firstNameLiteral} ${lastNameInitialLiteral}.`;
      }

      // 4. REPORTE DE SUCESSO (SRE Visibility)
      void EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: ANONYMIZER_ATOM_IDENTIFIER,
        operationCode: 'NAME_SUCCESSFULLY_ANONYMIZED',
        correlationIdentifier,
        message: 'Anonimização de identidade realizada com sucesso.',
        contextMetadata: {
          resultSnapshot: finalAnonymizedResultLiteral
        }
      });

      return finalAnonymizedResultLiteral;
    }
  );
};
