/**
 * @section Identity Logic - Name Anonymization Atom
 * @description Implementa el estándar de privacidad institucional: NOMBRE + INICIAL.
 * Transforma identidades civiles en tokens públicos seguros para evitar el doxing
 * mientras se mantiene la transparencia de la auditoría social.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Privacy ISO Standard.
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * Procesa un nombre legal completo y lo transforma en una firma pública anonimizada.
 *
 * @param fullLegalNameLiteral - Ejemplo: "Ana Luiza Silveira" o "Carlos Eduardo"
 * @returns {string} - Ejemplo: "ANALUIZA S." o "CARLOS E."
 */
export const AnonymizeCitizenName = (
  fullLegalNameLiteral: string
): string => {
  /**
   * 1. SANEAMIENTO DE ENTRADA
   * Eliminamos espacios redundantes y normalizamos a mayúsculas técnicas.
   */
  const sanitizedNameLiteral = fullLegalNameLiteral.trim().toUpperCase();
  const nameSegmentsCollection = sanitizedNameLiteral.split(/\s+/);

  if (nameSegmentsCollection.length === 0 || sanitizedNameLiteral === '') {
    return 'CIDADÃO ANÔNIMO';
  }

  // 2. EXTRACCIÓN DEL NOMBRE PRIMARIO
  const firstNameLiteral = nameSegmentsCollection[0] ?? '';

  /**
   * 3. EXTRACCIÓN DE LA INICIAL DEL APELLIDO
   * Buscamos el último segmento disponible para representar el linaje de forma opaca.
   */
  if (nameSegmentsCollection.length > 1) {
    const lastSegmentIndexNumeric = nameSegmentsCollection.length - 1;
    const lastNamePartLiteral = nameSegmentsCollection[lastSegmentIndexNumeric] ?? '';
    const lastNameInitialLiteral = lastNamePartLiteral.charAt(0);

    return `${firstNameLiteral} ${lastNameInitialLiteral}.`;
  }

  // Fallback si el usuario solo tiene un nombre registrado.
  return firstNameLiteral;
};
