import { useState } from 'react';
import { phaseForTurn} from '../game/phases';
import type { GameState, GameEvent, GameOption, Metrics, Archetype, Financing, PendingEvent } from '../types/game';
import { startGame, getInitialEvent, selectNextEvent, clamp} from '../game/engine'
import type { RNG } from '../game/rng';

export const useGameEngine = (arquetipo: Archetype, financiamiento: Financing, rng: RNG) => {
  const [gameState, setGameState] = useState<GameState>(() => startGame(arquetipo, financiamiento));
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(getInitialEvent(rng));

  const makeDecision = (option: GameOption, rng: RNG) => {
    if (gameState.status !== 'playing' || !currentEvent) return;

    // 1. Calcular nuevas métricas
    const newMetrics: Metrics = {
      capital: clamp(gameState.metrics.capital + (option.effects.capital || 0)),
      reputacion: clamp(gameState.metrics.reputacion + (option.effects.reputacion || 0)),
      bienestar: clamp(gameState.metrics.bienestar + (option.effects.bienestar || 0)),
    };

    // 2. Gestionar Tags
    let updatedTags = [...gameState.activeTags];
    if (option.addTags) {
      updatedTags = Array.from(new Set([...updatedTags, ...option.addTags]));
    }
    if (option.removeTags) {
      updatedTags = updatedTags.filter((t) => !option.removeTags?.includes(t));
    }

    // 3. Chequear condiciones de derrota
    let newStatus: GameState['status'] = gameState.status;
    if (newMetrics.capital <= 0) newStatus = 'game_over_capital';
    else if (newMetrics.reputacion <= 0) newStatus = 'game_over_reputacion';
    else if (newMetrics.bienestar <= 0) newStatus = 'game_over_bienestar';
    else if (gameState.currentTurn >= gameState.maxTurns) newStatus = 'victory';

    // 4. Calcular etapa según el turno
    const nextTurn = gameState.currentTurn + 1;
    const currentPhase = phaseForTurn(nextTurn);
    const nextPhaseId = currentPhase ? currentPhase.id : gameState.phaseId;

    const updatedPending: PendingEvent[] = [...gameState.pendingEvents];
    if (option.scheduledEvent){
      updatedPending.push({
        eventId: option.scheduledEvent.eventId,
        triggerTurn: nextTurn + option.scheduledEvent.delayTurns,
      });
    }

    const stateForSelection: GameState = {
      ...gameState,
      currentTurn: nextTurn,
      phaseId: nextPhaseId,
      metrics: newMetrics,
      activeTags: updatedTags,
      history: [...gameState.history, currentEvent.id],
      pendingEvents: updatedPending,
      status: newStatus,
      lastPill: option.learningPill ?? null,
    };

    
    if (newStatus === 'playing'){
      const {event: nextEvent, remainingPending, endedEarly } = selectNextEvent(stateForSelection, rng);

      if (endedEarly){
        setGameState({...stateForSelection,
          status: 'ended_early',
          pendingEvents: remainingPending,
        });
        setCurrentEvent(null);
      }
      else{
        setGameState({
          ...stateForSelection,
          pendingEvents: remainingPending,
        });
        setCurrentEvent(nextEvent)
      }
    } 
  };

  const restartGame = () => {
    const initialState = startGame(arquetipo, financiamiento);
    setGameState(initialState);
    setCurrentEvent(getInitialEvent(rng));
  };

  return {
    gameState,
    currentEvent,
    makeDecision,
    restartGame,
  };
};