/**
 * @section Territorial Logic - IBGE Data Mapper
 * @description Átomo encargado de transformar el esquema crudo de la API del IBGE
 * en el ADN soberano de TerritorialEntity. Delega la limpieza de nombres al
 * atomo de saneamiento toponímico.
 *
 * Protocolo OEDP-V16.0 - High Performance & Separation of Concerns (SRP).
 * SANEADO Zenith: Inyección de SanitizeTerritoryName y rigor de tipos.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import { SanitizeTerritoryName } from './SanitizeTerritoryName';

/* 1. ADN Estructural (Verbatim Module Syntax) */
import type { ITerritorialEntity } from '../../schemas/TerritorialEntity.schema';
import type { IIbgeDistrictRawResponse } from '../../schemas/IbgeTerritorialProtocols.schema';

/**
 * Transforma una respuesta de distrito del IBGE en una entidad soberana.
 *
 * @param incomingIbgeDistrictSnapshot - Objeto crudo del proveedor gubernamental.
 * @returns {ITerritorialEntity} Entidad purificada e integrada.
 */
export const MapIbgeToTerritorialEntity = (
  incomingIbgeDistrictSnapshot: IIbgeDistrictRawResponse
): ITerritorialEntity => {
  /**
   * @section Saneamiento de Identidad Geográfica
   * Delegamos la responsabilidad de normalización para asegurar que
   * "Florianópolis" siempre se mapee como "FLORIANOPOLIS".
   */
  const officialTerritoryNameLiteral = SanitizeTerritoryName(
    incomingIbgeDistrictSnapshot.nome
  );

  return {
    /**
     * Mantenemos el ID del IBGE como llave técnica de interoperabilidad.
     */
    territorialTechnicalIdentifier: incomingIbgeDistrictSnapshot.id.toString(),

    officialTerritoryNameLiteral,

    /** Por defecto, los registros de este endpoint se clasifican como distritos. */
    administrativeHierarchyLevel: 'DISTRICT',

    /**
     * Registro de integridad temporal para el motor de sincronización.
     */
    lastSovereignSyncTimestampISO: new Date().toISOString(),
  };
};
