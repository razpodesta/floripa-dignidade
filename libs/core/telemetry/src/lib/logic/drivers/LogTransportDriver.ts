/**
 * @section Telemetry Drivers - Sovereign Transport Orchestrator
 * @description Orquestador superior encargado de coordinar el flujo sanguíneo digital.
 * Implementa una arquitectura de enjambre delegando responsabilidades a átomos
 * de criptografía y sensores de hardware.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Atomic Swarm.
 * SANEADO Zenith: Erradicación de errores de tipos globales y atomización SRP.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import type { ContentFingerprint, ITelemetrySignal } from '../../schemas/TelemetrySignal.schema';
import { DetermineServerRuntime } from '../atomic/DetermineServerRuntime';

/* 1. Enjambre Atómico de Gestión de Datos */
import { AddTelemetrySignalToBuffer } from './AddTelemetrySignalToBuffer';
import { GetTelemetryBufferSizeQuantity } from './GetTelemetryBufferSizeQuantity';
import { PersistTelemetrySignalsToLocalStorage } from './PersistTelemetrySignalsToLocalStorage';
import { SynchronizeTelemetryBufferAction } from './internal/SynchronizeTelemetryBufferAction';

/* 2. Nuevos Átomos de Especialidad (Zenith Level) */
import { ExecuteMerkleChainCalculation } from './internal/ExecuteMerkleChainCalculation';
import { RegisterSovereignLastBreathSensor } from './internal/RegisterSovereignLastBreathSensor';

/** @section Configuración Técnica de SRE */
const MAXIMUM_BUFFER_CAPACITY_QUANTITY = 20;
const FLUSH_DELAY_MILLISECONDS_QUANTITY = 5000;

/** Rastro inalterable del último eslabón de la cadena Merkle. */
let lastEventHashFingerprintLiteral: ContentFingerprint | undefined = undefined;

/** Referencia de temporizador para el vaciado diferido. */
let flushTimeoutReference: ReturnType<typeof setTimeout> | null = null;

/**
 * Punto de entrada universal para el transporte de telemetría.
 * Orquesta la transición entre hilos y la persistencia de resiliencia.
 */
export const QueueTelemetrySignalForTransportAction = async (
  validatedTelemetrySignalSnapshot: ITelemetrySignal,
): Promise<void> => {
  const isServerRuntimeBoolean = DetermineServerRuntime();
  let forensicTelemetrySignalSnapshot = { ...validatedTelemetrySignalSnapshot };

  // FASE 1: INTEGRIDAD CRIPTOGRÁFICA (Solo Cliente)
  if (!isServerRuntimeBoolean) {
    try {
      const { currentHash } = await ExecuteMerkleChainCalculation(
        validatedTelemetrySignalSnapshot,
        lastEventHashFingerprintLiteral
      );

      forensicTelemetrySignalSnapshot = {
        ...forensicTelemetrySignalSnapshot,
        contentHashFingerprint: currentHash,
        previousEventHashFingerprint: lastEventHashFingerprintLiteral
      };

      lastEventHashFingerprintLiteral = currentHash;
    } catch (_ignoredError) {
      // Fallback: Prioridad a la observabilidad básica
    }
  }

  // FASE 2: SALVAGUARDA FÍSICA
  AddTelemetrySignalToBuffer(forensicTelemetrySignalSnapshot);

  if (!isServerRuntimeBoolean) {
    PersistTelemetrySignalsToLocalStorage([forensicTelemetrySignalSnapshot]);
  }

  // FASE 3: ESTRATEGIA DE DESPACHO ASIMÉTRICO
  if (isServerRuntimeBoolean) {
    void SynchronizeTelemetryBufferAction();
    return;
  }

  const currentBufferSizeQuantity = GetTelemetryBufferSizeQuantity();

  if (currentBufferSizeQuantity >= MAXIMUM_BUFFER_CAPACITY_QUANTITY) {
    if (flushTimeoutReference) clearTimeout(flushTimeoutReference);
    void SynchronizeTelemetryBufferAction();
  } else if (!flushTimeoutReference) {
    flushTimeoutReference = setTimeout(() => {
      flushTimeoutReference = null;
      void SynchronizeTelemetryBufferAction();
    }, FLUSH_DELAY_MILLISECONDS_QUANTITY);
  }
};

/**
 * 🛡️ FASE 4: ACTIVACIÓN DE SENSORES DE HARDWARE
 * SANEADO Zenith: Uso del átomo isomórfico para evitar errores TS2304 en el servidor.
 */
RegisterSovereignLastBreathSensor(() => {
  void SynchronizeTelemetryBufferAction();
});
