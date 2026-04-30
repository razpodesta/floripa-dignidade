'use client';

/**
 * @section Interaction Logic - Public Reaction Connector (Hook)
 * @description Puente isomórfico entre la interfaz de usuario y el motor de
 * sentimientos. Implementa 'Optimistic UI' para latencia cero percibida y
 * 'Sync Sentry' para el encolamiento de acciones en entornos sin red.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Swarm Intelligence.
 * SANEADO Zenith: Inyección de Zustand (Shared) y Validación Isomórfica.
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { useCallback, useState } from 'react';

/* 1. Infraestructura Core & Shared (Sovereign Swarm) */
import { useGlobalStateStore } from '@floripa-dignidade/shared';
import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 2. ADN Estructural y Orquestador de Dominio */
import type { IUserIdentity } from '@floripa-dignidade/identity';
import { ProcessPublicReactionTransaction } from '../ProcessPublicReactionTransaction';

/**
 * @interface IUsePublicReactionParameters
 * @description Contrato inmutable de parametrización para el orquestador visual.
 */
export interface IUsePublicReactionParameters {
  /** UUID de la entidad que recibe la interacción (Noticia, Denuncia, etc). */
  readonly targetEntityIdentifier: string;
  /** Endpoint físico para la transacción Cloud-Native. */
  readonly targetApiEndpointLiteral: string;
  /** Snapshot de identidad. Si es undefined, el sistema asume interacción anónima. */
  readonly activeCitizenIdentitySnapshot?: IUserIdentity;
}

/**
 * @interface IUsePublicReactionResult
 * @description Capacidades expuestas para la interfaz ciudadana.
 */
export interface IUsePublicReactionResult {
  readonly isExecutingBoolean: boolean;
  readonly optimisticPolarityNumeric: number;
  readonly submitReactionAction: (polarityNumeric: number, emoticonIntentionLiteral?: string) => Promise<void>;
}

/** Identificador técnico del sensor para el Neural Sentinel. */
const REACTION_HOOK_IDENTIFIER = 'PUBLIC_REACTION_CONNECTOR_HOOK';

/**
 * Hook de élite para la gestión de reacciones ciudadanas.
 *
 * @param parameters - Configuración de la entidad destino y contexto de identidad.
 * @returns {IUsePublicReactionResult} Operaciones atómicas para la UI.
 */
export const usePublicReaction = (
  parameters: IUsePublicReactionParameters
): IUsePublicReactionResult => {

  /**
   * @section Integración SRE (Sync Sentry)
   * Extraemos el estado de la red y la capacidad de encolamiento de la memoria volátil.
   */
  const { isNetworkOnlineBoolean, IncrementPendingQueueAction } = useGlobalStateStore((state) => ({
    isNetworkOnlineBoolean: state.isNetworkOnlineBoolean,
    IncrementPendingQueueAction: state.IncrementPendingQueueAction
  }));

  const [isExecutingBoolean, setIsExecutingBoolean] = useState(false);
  const[optimisticPolarityNumeric, setOptimisticPolarityNumeric] = useState(0);

  /**
   * Ejecuta la transacción de interacción.
   *
   * @param polarityNumeric - 1 (Like), -1 (Unlike), 0 (Neutral).
   * @param emoticonIntentionLiteral - Etiqueta semántica ISO (Opcional).
   */
  const submitReactionAction = useCallback(async (
    polarityNumeric: number,
    emoticonIntentionLiteral?: string
  ): Promise<void> => {
    const correlationIdentifier = GenerateCorrelationIdentifier();
    const previousPolarityNumeric = optimisticPolarityNumeric;

    // 1. ACTUALIZACIÓN VISUAL INMEDIATA (Optimistic UI)
    setOptimisticPolarityNumeric(polarityNumeric);
    setIsExecutingBoolean(true);

    try {
      /**
       * 2. ADUANA ISOMÓRFICA Y PONDERACIÓN
       * Reutilizamos la lógica de servidor en el cliente para generar
       * un payload purificado con peso preliminar.
       */
      const rawInteractionPayload = {
        interactionIdentifier: crypto.randomUUID(),
        targetEntityIdentifier: parameters.targetEntityIdentifier,
        evaluatorIdentityIdentifier: parameters.activeCitizenIdentitySnapshot?.identityIdentifier ?? null,
        interactionPolarityNumeric: polarityNumeric,
        semanticEmoticonIntention: emoticonIntentionLiteral,
        evaluatorPublicAliasLiteral: parameters.activeCitizenIdentitySnapshot?.anonymizedPublicNameLiteral ?? 'Cidadão Anônimo',
        evaluatorAvatarSourceUrl: parameters.activeCitizenIdentitySnapshot?.avatarImageUniformResourceLocator ?? null,
        territorialContextLiteral: 'FLORIANÓPOLIS_GLOBAL',
        occurrenceTimestampISO: new Date().toISOString()
      };

      const validatedReactionSnapshot = await ProcessPublicReactionTransaction(
        rawInteractionPayload,
        parameters.activeCitizenIdentitySnapshot
      );

      /**
       * 3. VIGILANCIA DE RED (Offline Mode Support)
       */
      if (!isNetworkOnlineBoolean) {
        IncrementPendingQueueAction();

        void EmitTelemetrySignal({
          severityLevel: 'WARNING',
          moduleIdentifier: REACTION_HOOK_IDENTIFIER,
          operationCode: 'REACTION_QUEUED_OFFLINE',
          correlationIdentifier,
          message: 'Sin conexión de red. Reacción encolada para sincronización diferida.'
        });

        setIsExecutingBoolean(false);
        return;
      }

      /**
       * 4. TRANSMISIÓN FÍSICA (Cloud Sovereign Fetch)
       */
      const outgoingResponse = await fetch(parameters.targetApiEndpointLiteral, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedReactionSnapshot)
      });

      if (!outgoingResponse.ok) {
        throw new Error(`NETWORK_FAULT_STATUS_${outgoingResponse.status}`);
      }

      // 5. REPORTE SRE (Success)
      void EmitTelemetrySignal({
        severityLevel: 'INFO',
        moduleIdentifier: REACTION_HOOK_IDENTIFIER,
        operationCode: 'REACTION_SYNC_SUCCESSFUL',
        correlationIdentifier,
        message: 'Reacción pública sincronizada exitosamente con la nube.',
        contextMetadata: {
          impactWeight: validatedReactionSnapshot.calculatedImpactWeightNumeric,
          entityId: parameters.targetEntityIdentifier
        }
      });

    } catch (caughtError: unknown) {
      /**
       * 6. RECUPERACIÓN FORENSE (Rollback)
       * Si falla la transacción, deshacemos la interfaz visual.
       */
      setOptimisticPolarityNumeric(previousPolarityNumeric);

      const errorDescriptionLiteral = caughtError instanceof Error
        ? caughtError.message
        : String(caughtError);

      void EmitTelemetrySignal({
        severityLevel: 'ERROR',
        moduleIdentifier: REACTION_HOOK_IDENTIFIER,
        operationCode: 'REACTION_SYNC_FAULT',
        correlationIdentifier,
        message: 'Fallo al procesar la reacción. Estado visual revertido.',
        contextMetadata: { errorTrace: errorDescriptionLiteral }
      });
    } finally {
      setIsExecutingBoolean(false);
    }
  },[
    optimisticPolarityNumeric,
    parameters,
    isNetworkOnlineBoolean,
    IncrementPendingQueueAction
  ]);

  return {
    isExecutingBoolean,
    optimisticPolarityNumeric,
    submitReactionAction
  };
};
