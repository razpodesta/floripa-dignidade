/**
 * @section PMF Engine DNA - Linguistic Integrity Schema
 * @description Define el contrato soberano para los mensajes de auditoría,
 * estados de red y errores semánticos del motor de datos abiertos.
 *
 * Protocolo OEDP-V17.0 - Sovereign Data & ReadOnly Integrity.
 * @author Raz Podestá - MetaShark Tech
 */

import { z } from 'zod';

export const PmfOpenDataI18nSchema = z.object({
  logs: z.object({
    SYNC_STARTED: z.string().describe('Inicio de sincronización con E-Pública.'),
    SYNC_SUCCESS: z.string().describe('Finalización nominal de la extracción.'),
    RECORD_MAPPED: z.string().describe('Confirmación de mapeo de un gasto individual.'),
    ANOMALY_DETECTED: z.string().describe('Alerta de discrepancia en valores presupuestarios.')
  }),
  errors: z.object({
    NETWORK_CONNECTION_FAULT: z.string().describe('Fallo físico de enlace con el portal.'),
    PROTOCOL_CONTRACT_VIOLATION: z.string().describe('La API cambió su formato (ADN Corrupto).'),
    UNAUTHORIZED_ACCESS_FAULT: z.string().describe('Error de permisos en la consulta gubernamental.'),
    MAPPING_TRANSFORMATION_FAULT: z.string().describe('Error al homogenizar los datos crudos.')
  })
}).readonly();

export type IPmfOpenDataI18n = z.infer<typeof PmfOpenDataI18nSchema>;
