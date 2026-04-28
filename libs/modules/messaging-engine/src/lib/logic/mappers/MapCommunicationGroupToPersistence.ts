/**
 * @section Messaging Logic - Group Data Mapper
 * @description Átomo puro encargado de transformar el ADN del grupo de comunicación
 * al esquema físico de columnas de la base de datos soberana.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity & Pure Logic.
 */

import type { ICommunicationGroup } from '../../schemas/CommunicationGroup.schema';

/**
 * Mapea una instancia de grupo validada al formato de persistencia PostgREST.
 * 
 * @param validatedGroupData - ADN purificado del grupo.
 * @param creatorIdentifier - UUID del ciudadano responsable.
 * @param correlationIdentifier - ID de trazabilidad forense.
 */
export const MapCommunicationGroupToPersistence = (
  validatedGroupData: ICommunicationGroup,
  creatorIdentifier: string,
  correlationIdentifier: string
): Record<string, unknown> => ({
  group_id: validatedGroupData.groupIdentifier,
  display_name: validatedGroupData.officialDisplayNameLiteral,
  slug_identifier: validatedGroupData.technicalSlugLiteral,
  description_text: validatedGroupData.groupDescriptionLiteral,
  owner_org_id: validatedGroupData.organizationalOwnerIdentifier,
  territory_id: validatedGroupData.territorialFocusIdentifier,
  governance_model: validatedGroupData.governanceModelLiteral,
  visibility_mode: validatedGroupData.visibilityModeLiteral,
  creator_id: creatorIdentifier,
  created_at: validatedGroupData.occurrenceTimestampISO,
  correlation_id: correlationIdentifier,
});