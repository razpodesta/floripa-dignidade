/**
 * @section PMF Engine DNA - E-Pública Error Protocol Schema
 * @description Define el contrato de error devuelto por la API de E-Pública.
 * Permite al sistema identificar fallos lógicos del gobierno (ej: periodos sin datos,
 * parámetros inválidos) diferenciándolos de caídas físicas de red.
 *
 * Protocolo OEDP-V17.0 - ISO Standard Naming & SRE Resilience.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

/**
 * @name EPublicaErrorSchema
 * @description Mapea el objeto de error oficial del portal de transparencia.
 */
export const EPublicaErrorSchema = z.object({
  erro: z.object({
    codigo: z.number().describe('Código técnico del error gubernamental.'),
    mensagem: z.string().describe('Descripción legible del fallo emitida por el portal.')
  })
}).readonly();

/** 🛡️ ADN Tipado: Interfaz de error de protocolo para triaje SRE. */
export type IEPublicaError = z.infer<typeof EPublicaErrorSchema>;
