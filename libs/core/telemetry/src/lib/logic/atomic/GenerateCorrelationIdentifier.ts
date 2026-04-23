/**
 * @section Logic: GenerateCorrelationIdentifier
 * @description Generador de identificadores únicos para trazabilidad forense.
 * Protocolo OEDP-V13.0 - Distributed Traceability.
 */

/**
 * Crea un identificador UUID v4 para correlacionar eventos a través de múltiples módulos.
 * Es la base de la "Traza de Sangre Digital" del monorepo.
 *
 * @returns Un string con formato UUID v4.
 */
export const GenerateCorrelationIdentifier = (): string => {
  return crypto.randomUUID();
};
