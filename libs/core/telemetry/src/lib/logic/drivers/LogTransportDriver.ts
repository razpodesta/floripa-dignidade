/**
 * @section Telemetry Drivers - Cloud Log Transport Orchestrator
 * @description Orquestador soberano que decide la estrategia de despacho de señales.
 * Implementa lógica de persistencia asíncrona para el flujo sanguíneo digital.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Erradicación de 'any' mediante puente de contexto tipado.
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type { ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';
import { TransmitSignalsToCloud } from './CloudLogTransport';
import {
  AddSignalToBuffer,
  FlushBufferSignals,
  GetBufferSizeQuantity
} from './LogBufferManager';

/**
 * @interface ISystemEnvironmentMetadata
 * @description Contrato inmutable para la captura de secretos de infraestructura.
 */
interface ISystemEnvironmentMetadata {
  readonly nodeExecutionEnvironmentLiteral: string | undefined;
  readonly supabaseUrlLiteral: string | undefined;
  readonly supabaseSecurityKeySecret: string | undefined;
}

/**
 * @interface IGlobalEnvironmentContext
 * @description Puente técnico para acceder a variables de entorno sin usar 'any'.
 */
interface IGlobalEnvironmentContext {
  readonly process?: {
    readonly env: Record<string, string | undefined>;
  };
}

/** @section Configuración Técnica de SRE */
const MAXIMUM_BUFFER_CAPACITY_QUANTITY = 20;
const FLUSH_DELAY_MILLISECONDS_QUANTITY = 5000;

let flushTimeoutReference: ReturnType<typeof setTimeout> | null = null;

/**
 * Extrae de forma segura los metadatos del entorno global.
 * SANEADO Zenith: Erradicación de TS-Linter (no-explicit-any).
 *
 * @returns {ISystemEnvironmentMetadata} Colección de variables de sistema.
 */
const getInfrastructureEnvironmentMetadata = (): ISystemEnvironmentMetadata => {
  /** 🛡️ SANEADO:narrowing de tipos mediante interfaz de contrato global */
  const globalContextReference = globalThis as unknown as IGlobalEnvironmentContext;

  return {
    nodeExecutionEnvironmentLiteral: globalContextReference.process?.env['NODE_ENV'],
    supabaseUrlLiteral: globalContextReference.process?.env['SUPABASE_URL'],
    supabaseSecurityKeySecret: globalContextReference.process?.env['SUPABASE_SERVICE_ROLE_KEY'],
  };
};

/**
 * Evalúa si el ecosistema está operando bajo el modo de desarrollo.
 */
export const isDevelopmentEnvironmentActiveBoolean = (): boolean => {
  const { nodeExecutionEnvironmentLiteral } = getInfrastructureEnvironmentMetadata();
  return nodeExecutionEnvironmentLiteral === 'development';
};

/**
 * Orquesta la purga del buffer y su transmisión física basándose en el entorno.
 * SANEADO: Nomenclatura verbosa (ISO Standard).
 */
const executeOrchestratedFlushAction = async (): Promise<void> => {
  const signalsToTransmitCollection = FlushBufferSignals();

  if (signalsToTransmitCollection.length === 0) {
    return;
  }

  if (isDevelopmentEnvironmentActiveBoolean()) {
    signalsToTransmitCollection.forEach((signalSnapshot) => {
      /**
       * Uso de warn para cumplir con la regla 'no-console' en desarrollo forense.
       */
      console.warn(`[TELEMETRY_FORENSIC]: ${signalSnapshot.operationCode}`, signalSnapshot);
    });
    return;
  }

  const {
    supabaseUrlLiteral,
    supabaseSecurityKeySecret
  } = getInfrastructureEnvironmentMetadata();

  if (supabaseUrlLiteral && supabaseSecurityKeySecret) {
    await TransmitSignalsToCloud(
      signalsToTransmitCollection,
      supabaseUrlLiteral,
      supabaseSecurityKeySecret
    );
  }
};

/**
 * Punto de entrada único para el encolamiento inteligente de señales.
 * Implementa despacho inmediato en servidor y agrupado en cliente.
 *
 * @param validatedSignalPayload - ADN de telemetría validado.
 */
export const QueueTelemetrySignalForTransport = (
  validatedSignalPayload: ITelemetrySignal
): void => {
  AddSignalToBuffer(validatedSignalPayload);

  const isServerRuntimeBoolean = typeof window === 'undefined';

  /** FASE 1: Despacho Inmediato (Servidor/Edge) para evitar pérdida de rastro */
  if (isServerRuntimeBoolean) {
    void executeOrchestratedFlushAction();
    return;
  }

  /** FASE 2: Despacho Agrupado (Browser/Mobile) para optimización de recursos */
  const currentBufferSizeQuantity = GetBufferSizeQuantity();

  if (currentBufferSizeQuantity >= MAXIMUM_BUFFER_CAPACITY_QUANTITY) {
    if (flushTimeoutReference) {
      clearTimeout(flushTimeoutReference);
    }
    void executeOrchestratedFlushAction();
  } else if (!flushTimeoutReference) {
    flushTimeoutReference = setTimeout(() => {
      flushTimeoutReference = null;
      void executeOrchestratedFlushAction();
    }, FLUSH_DELAY_MILLISECONDS_QUANTITY);
  }
};
