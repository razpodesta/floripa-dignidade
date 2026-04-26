/**
 * @section CMS Infrastructure - Import Map Generator
 * @description Centraliza el mapa de importaciones para componentes de cliente.
 * Protocolo OEDP-V16.0 - High Performance & Asset Management.
 */

import type { ImportMap } from 'payload';

/**
 * Mapa de dependencias para el empaquetador (Bundler).
 * El motor de Payload poblará este objeto durante la fase de generación.
 */
export const importMap: ImportMap = {};
