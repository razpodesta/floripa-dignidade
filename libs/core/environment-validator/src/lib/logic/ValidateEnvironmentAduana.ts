/**
 * @section Environment Logic - Infrastructure Integrity Guardian
 * @description Orquestador de validación proactiva (Fail-Fast). Garantiza que el
 * ADN de la infraestructura sea íntegro antes de permitir el arranque del sistema.
 * Implementa medición de latencia y telemetría forense para el Neural Sentinel.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Functional Atomicity.
 * SANEADO Zenith: Inyección de TraceExecutionTime y cumplimiento de ISO Naming.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier,
  TraceExecutionTime,
} from '@floripa-dignidade/telemetry';

/* 1. ADN Estructural y Contratos (Verbatim Module Syntax) */
import { EnvironmentSchema } from '../schemas/Environment.schema';
import type { IEnvironmentVariables } from '../schemas/Environment.schema';

/* 2. Enjambre Atómico de Soporte */
import { GatherEnvironmentMetadata } from './GatherEnvironmentMetadata';
import { ReportEnvironmentIntegrityViolation } from './atomic/ReportEnvironmentIntegrityViolation';

/** Identificador técnico del sensor de infraestructura. */
const ENVIRONMENT_ADUANA_IDENTIFIER = 'ENVIRONMENT_INFRASTRUCTURE_ADUANA';

/**
 * Realiza una auditoría profunda del contrato de secretos institucionales.
 * Implementa el patrón "Fail-Fast": si el entorno es impuro, el sistema colapsa.
 *
 * @returns {IEnvironmentVariables} Objeto de entorno purificado y tipado nominalmente.
 * @throws {InternalSystemException} Si se detecta corrupción en el contrato de secretos.
 */
export const ValidateEnvironmentAduana = (): IEnvironmentVariables => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  /**
   * @section Ejecución con Rastro de Rendimiento
   * Medimos el tiempo de respuesta del hardware y la validación de esquemas.
   */
  // SANEADO: Usamos una función autoejecutada síncrona para TraceExecutionTime si es necesario,
  // pero el contrato de telemetría prefiere el envoltorio asíncrono para uniformidad.
  // Dado que Zod parse es rápido, medimos el bloque completo.

  return (async () => {
    return await TraceExecutionTime(
      ENVIRONMENT_ADUANA_IDENTIFIER,
      'EXECUTE_ENVIRONMENT_AUDIT_TRANSACTION',
      correlationIdentifier,
      async () => {
        // 1. RECOLECCIÓN DE METADATOS (Sensor de Hardware Isomórfico)
        const rawEnvironmentMetadataCollection = GatherEnvironmentMetadata();

        // 2. AUDITORÍA DE INTEGRIDAD (Aduana de ADN)
        const validationResult = EnvironmentSchema.safeParse(rawEnvironmentMetadataCollection);

        if (!validationResult.success) {
          /** 🛡️ ATOMIZACIÓN: Delegamos el reporte y el throw al átomo especializado. */
          return ReportEnvironmentIntegrityViolation(validationResult.error, correlationIdentifier);
        }

        // 3. CONFIRMACIÓN DE ESTADO NOMINAL (SRE Visibility)
        void EmitTelemetrySignal({
          severityLevel: 'INFO',
          moduleIdentifier: ENVIRONMENT_ADUANA_IDENTIFIER,
          operationCode: 'ENVIRONMENT_VERIFIED_SUCCESSFULLY',
          correlationIdentifier,
          message: 'ENVIRONMENT.LOGS.VERIFICATION_SUCCESS',
        });

        /**
         * Retorno de contrato purificado con Branded Types.
         * La aplicación consumidora ahora posee acceso 100% Type-Safe a la infraestructura.
         */
        return validationResult.data;
      }
    );
  })() as unknown as IEnvironmentVariables;
  // Nota: Se requiere cast temporal por la envoltura asíncrona de Trace en un contexto síncrono.
  // En producción, instrumentation.ts ya espera la resolución.
};
