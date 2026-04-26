/**
 * @section CMS Infrastructure - Lexical Editor Configuration
 * @description Centraliza la configuración del motor de edición de texto.
 * Permite la expansión futura de bloques personalizados sin contaminar el núcleo.
 *
 * Protocolo OEDP-V16.0 - Functional Atomicity.
 */

import { lexicalEditor } from '@payloadcms/richtext-lexical';

/**
 * Define las capacidades soberanas del editor de contenido.
 */
export const LexicalEditorSovereign = lexicalEditor({
  /**
   * @future_expansion
   * Aquí se inyectarán los 'features' de Lexical (Upload, Tables, Custom Blocks)
   * siguiendo la doctrina Lego.
   */
});
