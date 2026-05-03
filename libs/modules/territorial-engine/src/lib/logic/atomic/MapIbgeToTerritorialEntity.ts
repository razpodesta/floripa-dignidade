/**
 * @section Territorial Logic - IBGE Data Mapper
 * @description Átomo encargado de transformar el ADN crudo gubernamental (IBGE)
 * en entidades territoriales soberanas con identidad brindada.
 *
 * Protocolo OEDP-V17.0 - Functional Atomicity & Branded Type Integrity.
 */

/** 
 * 🛡️ RIGOR ESM: Extensiones .js requeridas para el motor de resolución Node16.
 */
import { SanitizeTerritoryName } from './SanitizeTerritoryName.js';

/* 1. ADN Estructural y Tipos Nominales */
import type { 
  ITerritorialEntity, 
  TTerritorialTechnicalIdentifier 
} from '../../schemas/TerritorialEntity.schema.js';
import type { IIbgeDistrictRawResponse } from '../../schemas/IbgeTerritorialProtocols.schema.js';

/**
 * Transforma un registro de distrito del IBGE en una entidad purificada.
 * ⚡ PERFORMANCE: Operación sincrónica pura para procesamiento masivo de arrays.
 * 
 * @param rawDistrict - Snapshot crudo del proveedor externo.
 * @returns {ITerritorialEntity} Entidad con identidad brindada y nombre saneado.
 */
export const MapIbgeToTerritorialEntity = (
  rawDistrict: IIbgeDistrictRawResponse
): ITerritorialEntity => {
  /**
   * @section SANEAMIENTO TOPONÍMICO
   * Delegación atómica para asegurar la pureza lingüística (Uppercase/ASCII).
   */
  const officialName = SanitizeTerritoryName(rawDistrict.nome);

  /**
   * @section IDENTIDAD SOBERANA
   * Transformamos el ID numérico del IBGE en una firma técnica.
   */
  const technicalIdLiteral = rawDistrict.id.toString();

  return {
    /**
     * 🛡️ SOVEREIGN CASTING: 
     * Resolvemos el error TS2322 inyectando la marca de tipo nominal. 
     * Validamos que este rastro de texto es ahora una identidad territorial legítima.
     */
    territorialTechnicalIdentifier: technicalIdLiteral as TTerritorialTechnicalIdentifier,

    officialTerritoryNameLiteral: officialName,

    /** Clasificación jerárquica por defecto según el endpoint de origen. */
    administrativeHierarchyLevel: 'DISTRICT',

    /** Sincronización de rastro temporal ISO 8601 */
    lastSovereignSyncTimestampISO: new Date().toISOString(),
  };
};