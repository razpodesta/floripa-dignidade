/**
 * @section Telemetry Drivers - Cloud Log Transport Orchestrator
 * @description Orquestador soberano encargado de decidir la estrategia de despacho
 * de señales forenses. Implementa lógica de persistencia asimétrica y gestión
 * de concurrencia para el flujo sanguíneo digital.
 *
 * Protocolo OEDP-V16.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Aislamiento de configuración y control de concurrencia (Locking).
 *
 * @author Raz Podestá - MetaShark Tech
 */

import type { ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';
import { TransmitSignalsToCloud } from './CloudLogTransport';
import { ExtractTelemetryInfrastructureConfiguration } from './ExtractTelemetryInfrastructureConfiguration';
import {
  AddSignalToBuffer,
  FlushBufferSignals,
  GetBufferSizeQuantity
} from './LogBufferManager';

/** @section Configuración Técnica de SRE (Frecuencia y Volumen) */
const MAXIMUM_BUFFER_CAPACITY_QUANTITY = 20;
const FLUSH_DELAY_MILLISECONDS_QUANTITY = 5000;

let flushTimeoutReference: ReturnType<typeof setTimeout> | null = null;

/**
 * Semáforo de Sincronización (Concurrency Safeguard).
 * Evita que múltiples hilos de ejecución intenten vaciar el buffer simultáneamente.
 */
let isSynchronizationActiveBoolean = false;

/**
 * Evalúa si el ecosistema está operando bajo el modo de desarrollo local.
 */
export const isDevelopmentEnvironmentActiveBoolean = (): boolean => {
  const configuration = ExtractTelemetryInfrastructureConfiguration();
  return configuration.nodeExecutionEnvironmentLiteral === 'development';
};

/**
 * Orquesta la sincronización del buffer hacia la persistencia física.
 * SANEADO Zenith: Implementación de patrón 'Lock & Release' para integridad.
 */
const synchronizeLogBufferToCloudAction = async (): Promise<void> => {
  if (isSynchronizationActiveBoolean) {
    return;
  }

  const signalsToTransmitCollection = FlushBufferSignals();

  if (signalsToTransmitCollection.length === 0) {
    return;
  }

  isSynchronizationActiveBoolean = true;

  try {
    // CASO A: Entorno de Desarrollo (Forensic console trace)
    if (isDevelopmentEnvironmentActiveBoolean()) {
      signalsToTransmitCollection.forEach((signalSnapshot) => {
        console.warn(`[TELEMETRY_FORENSIC]: ${signalSnapshot.operationCode}`, signalSnapshot);
      });
      return;
    }

    // CASO B: Entorno de Producción (Cloud Sovereign persistence)
    const {
      cloudStorageUrlLiteral,
      cloudStorageSecurityKeySecret
    } = ExtractTelemetryInfrastructureConfiguration();

    if (cloudStorageUrlLiteral && cloudStorageSecurityKeySecret) {
      await TransmitSignalsToCloud(
        signalsToTransmitCollection,
        cloudStorageUrlLiteral,
        cloudStorageSecurityKeySecret
      );
    }
  } finally {
    /** Garantizamos la liberación del semáforo incluso ante colapsos de red */
    isSynchronizationActiveBoolean = false;
  }
};

/**
 * Punto de entrada único para el transporte inteligente de telemetría.
 * Implementa despacho inmediato en servidores (Stateless) y agrupado en clientes.
 *
 * @param validatedSignalPayload - ADN de telemetría previamente validado.
 */
export const QueueTelemetrySignalForTransport = (
  validatedSignalPayload: ITelemetrySignal
): void => {
  AddSignalToBuffer(validatedSignalPayload);

  const isServerRuntimeBoolean = typeof window === 'undefined';

  /**
   * FASE 1: Despacho Inmediato (Servidor/Edge/Node)
   * Vercel congela los procesos al terminar el stream; no podemos esperar.
   */
  if (isServerRuntimeBoolean) {
    void synchronizeLogBufferToCloudAction();
    return;
  }

  /**
   * FASE 2: Despacho Agrupado (Navegador/Mobile)
   * Optimización de consumo de energía y peticiones HTTP.
   */
  const currentBufferSizeQuantity = GetBufferSizeQuantity();

  if (currentBufferSizeQuantity >= MAXIMUM_BUFFER_CAPACITY_QUANTITY) {
    if (flushTimeoutReference) {
      clearTimeout(flushTimeoutReference);
    }
    void synchronizeLogBufferToCloudAction();
  } else if (!flushTimeoutReference) {
    flushTimeoutReference = setTimeout(() => {
      flushTimeoutReference = null;
      void synchronizeLogBufferToCloudAction();
    }, FLUSH_DELAY_MILLISECONDS_QUANTITY);
  }
};
