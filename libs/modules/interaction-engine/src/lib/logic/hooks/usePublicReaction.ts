'use client';

/**
 * @section Interaction Logic - Public Reaction Connector (Hook)
 * @description Puente isomórfico entre la interfaz de usuario y el motor de
 * sentimientos. Implementa 'Optimistic UI' para latencia cero percibida y
 * 'Sync Sentry' para el encolamiento de acciones en entornos sin red.
 *
 * Protocolo OEDP-V17.0 - High Performance SRE & Functional Atomicity.
 * SANEADO Zenith: Atomización implacable y blindaje de tipado estricto (Fix TS7006).
 *
 * @author Raz Podestá - MetaShark Tech
 * @license UNLICENSED
 */

import { useCallback, useState } from 'react';

/* 1. Infraestructura Core & Shared (Sovereign Swarm) */
import { useGlobalStateStore } from '@floripa-dignidade/shared';
/** 🛡️ SANEADO Zenith: Importación explícita del tipo para prevenir colapso 'any' */
import type { IGlobalSovereignStore } from '@floripa-dignidade/shared';

import {
  EmitTelemetrySignal,
  GenerateCorrelationIdentifier
} from '@floripa-dignidade/telemetry';

/* 2. ADN Estructural y Enjambre de Dominio */
import type { IUserIdentity } from '@floripa-dignidade/identity';
import { ProcessPublicReactionTransaction } from '../ProcessPublicReactionTransaction';
import { BuildPublicReactionPayload } from '../atomic/BuildPublicReactionPayload';
import { TransmitPublicReactionToCloud } from '../atomic/TransmitPublicReactionToCloud';

/**
 * @interface IUsePublicReactionParameters
 * @description Contrato inmutable de parametrización para el orquestador visual.
 */
export interface IUsePublicReactionParameters {
  readonly targetEntityIdentifier: string;
  readonly targetApiEndpointLiteral: string;
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
   * 🛡️ SANEADO Zenith: Tipado explícito de '(state: IGlobalSovereignStore)'
   * Esto erradica el TS7006 incluso si el LSP del IDE sufre latencia.
   */
  const { isNetworkOnlineBoolean, IncrementPendingQueueAction } = useGlobalStateStore(
    (state: IGlobalSovereignStore) => ({
      isNetworkOnlineBoolean: state.isNetworkOnlineBoolean,
      IncrementPendingQueueAction: state.IncrementPendingQueueAction
    })
  );

  const [isExecutingBoolean, setIsExecutingBoolean] = useState(false);
  const [optimisticPolarityNumeric, setOptimisticPolarityNumeric] = useState(0);

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
      // 2. CONSTRUCCIÓN Y PONDERACIÓN (Delegación Atómica)
      const rawInteractionPayload = BuildPublicReactionPayload(
        parameters.targetEntityIdentifier,
        polarityNumeric,
        parameters.activeCitizenIdentitySnapshot,
        emoticonIntentionLiteral
      );

      const validatedReactionSnapshot = await ProcessPublicReactionTransaction(
        rawInteractionPayload,
        parameters.activeCitizenIdentitySnapshot
      );

      // 3. VIGILANCIA DE RED (Offline Mode Support)
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

      // 4. TRANSMISIÓN FÍSICA (Delegación Atómica)
      await TransmitPublicReactionToCloud(
        parameters.targetApiEndpointLiteral,
        validatedReactionSnapshot
      );

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
      // 6. RECUPERACIÓN FORENSE (Rollback)
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
