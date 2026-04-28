/**
 * @section Messaging Logic - Infrastructure Security Atom
 * @description Átomo encargado exclusivamente de la construcción de cabeceras 
 * de red para la comunicación con el Tier de Datos (Supabase). Centraliza la
 * inyección de secretos y políticas de retorno de datos.
 *
 * Protocolo OEDP-V16.0 - High Performance & DRY (Don't Repeat Yourself).
 * Vision: Unified Security Protocol for Messaging Dispatchers.
 *
 * @author Raz Podestá - MetaShark Tech
 */

/**
 * @name TReturnPreference
 * @description Modos de respuesta admitidos por el protocolo PostgREST.
 */
export type TReturnPreference = 'representation' | 'minimal';

/**
 * @interface ISovereignHeadersResult
 * @description Contrato de salida para el consumo en peticiones 'fetch' nativas.
 */
export interface ISovereignHeadersResult {
  readonly 'Content-Type': string;
  readonly apikey: string;
  readonly Authorization: string;
  readonly Prefer: string;
}

/**
 * Genera el objeto de cabeceras inmutable para transacciones cloud.
 *
 * @param cloudSecurityKeySecret - Llave maestra validada por la aduana de entorno.
 * @param responsePreferenceLiteral - Determina si la nube debe devolver el registro creado.
 * @returns {ISovereignHeadersResult} Diccionario de cabeceras listo para el despacho.
 */
export const CreateSovereignDatabaseHeaders = (
  cloudSecurityKeySecret: string,
  responsePreferenceLiteral: TReturnPreference = 'minimal'
): ISovereignHeadersResult => {
  /**
   * @section Construcción de Identidad de Red
   * Implementamos el estándar Bearer Token exigido por la infraestructura soberana.
   */
  return {
    'Content-Type': 'application/json',
    'apikey': cloudSecurityKeySecret,
    'Authorization': `Bearer ${cloudSecurityKeySecret}`,
    'Prefer': `return=${responsePreferenceLiteral}`,
  };
};