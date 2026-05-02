/**
 * @section Adversarial Orchestrators - Security Audit Pipeline (Master)
 * @description Orquestador soberano que une las Armas, el Simulador y los Adaptadores.
 * Coordina el ciclo de vida completo de un ataque (Red Team) y genera el dictamen final.
 *
 * Protocolo OEDP-V17.0 - Swarm Intelligence & High Performance SRE.
 * SANEADO Zenith: Pulverización de lógica hacia átomos de Carga, Consolidación y Veredicto.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { GenerateCorrelationIdentifier, TraceExecutionTime } from '@floripa-dignidade/telemetry';
import { InternalSystemException } from '@floripa-dignidade/exceptions';

/* 🛡️ SANEADO Zenith: Inyección Agnóstica */
import type { ZodTypeAny } from 'zod';

/* 1. ADN de Dominio y Salida */
import type { IForensicAuditReport } from '../schemas/ForensicAuditReport.schema';
import type { IAdversarialVulnerability } from '../schemas/AdversarialVulnerability.schema';

/* 2. Enjambre Atómico Local (Swiss-Watch Pattern) */
import { ExportShannonForensicReport } from '../adapters/ExportShannonForensicReport';
import { LoadAdversarialArsenal } from '../generators/atomic/LoadAdversarialArsenal';
import { ExecuteAdversarialFuzzing } from '../simulators/ExecuteAdversarialFuzzing';
import { ConsolidateForensicReport } from './atomic/ConsolidateForensicReport';
import { EvaluateAuditIntegrityVerdict } from './atomic/EvaluateAuditIntegrityVerdict';

/** Identificador técnico del orquestador. */
const PIPELINE_ORCHESTRATOR_IDENTIFIER = 'ADVERSARIAL_PIPELINE_ORCHESTRATOR';

/**
 * @interface ITargetAduanaDefinition
 * @description Contrato de inyección de dependencia para esquemas a atacar.
 */
export interface ITargetAduanaDefinition {
  readonly apparatusNameLiteral: string;
  readonly schemaInstance: ZodTypeAny;
}

/**
 * Ejecuta la matriz de ataque completa contra las aduanas suministradas.
 *
 * @param targetAduanasCollection - Colección de esquemas Zod a vulnerar.
 * @param outputDirectoryLiteral - Ruta física para exportar el reporte de Shannon AI.
 */
export const ExecuteSecurityAuditPipeline = async (
  targetAduanasCollection: readonly ITargetAduanaDefinition[],
  outputDirectoryLiteral: string
): Promise<IForensicAuditReport> => {
  const correlationIdentifier = GenerateCorrelationIdentifier();

  return await TraceExecutionTime(
    PIPELINE_ORCHESTRATOR_IDENTIFIER,
    'EXECUTE_FULL_ADVERSARIAL_AUDIT',
    correlationIdentifier,
    async () => {
      const executionStartTimestampNumeric = performance.now();

      try {
        // 1. CARGA DE ARSENAL (Delegación Atómica)
        const combinedAdversarialWeaponsCollection = LoadAdversarialArsenal();
        let globalVulnerabilitiesCollection: IAdversarialVulnerability[] = [];

        // 2. CICLO DE ATAQUE (Simulación sobre cada objetivo)
        for (const targetAduana of targetAduanasCollection) {
          const simulationBreachesCollection = await ExecuteAdversarialFuzzing({
            targetApparatusIdentifierLiteral: targetAduana.apparatusNameLiteral,
            targetAduanaSchema: targetAduana.schemaInstance,
            adversarialWeaponsCollection: combinedAdversarialWeaponsCollection,
            correlationIdentifier
          });

          globalVulnerabilitiesCollection = [...globalVulnerabilitiesCollection, ...simulationBreachesCollection];
        }

        // 3. CONSOLIDACIÓN DE ADN (Delegación Atómica)
        const finalForensicReportSnapshot = ConsolidateForensicReport({
          vulnerabilitiesCollection: globalVulnerabilitiesCollection,
          totalSimulationsExecutedQuantity: targetAduanasCollection.length * combinedAdversarialWeaponsCollection.length,
          startTimestampNumeric: executionStartTimestampNumeric,
          endTimestampNumeric: performance.now()
        });

        // 4. TRADUCCIÓN Y EXPORTACIÓN (Adapter Orchestration)
        await ExportShannonForensicReport(finalForensicReportSnapshot, outputDirectoryLiteral, correlationIdentifier);

        // 5. VEREDICTO FINAL (SRE Quality Gate)
        EvaluateAuditIntegrityVerdict(finalForensicReportSnapshot, correlationIdentifier);

        return finalForensicReportSnapshot;

      } catch (caughtError: unknown) {
        throw new InternalSystemException('FALLO_EN_PIPELINE_DE_SIMULACION_ADVERSARIA', {
          originalErrorLiteral: caughtError instanceof Error ? caughtError.message : String(caughtError),
          correlationIdentifier
        });
      }
    }
  );
};