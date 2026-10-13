import { useState } from 'react';
import type { GameState, GameEvent, GameOption, Archetype, Financing } from '../types/game';
import { startGame, getInitialEvent, selectNextEvent, applyDecision } from '../game/engine'
import type { RNG } from '../game/rng';

export const useGameEngine = (arquetipo: Archetype, financiamiento: Financing, rng: RNG) => {
  const [gameState, setGameState] = useState<GameState>(() => startGame(arquetipo, financiamiento));
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(getInitialEvent(rng));

  const makeDecision = (option: GameOption) => {
    if (gameState.status !== 'playing' || !currentEvent) return;

    const stateForSelection: GameState = applyDecision(gameState, option, currentEvent.id)

    if (stateForSelection.status !== 'playing') {
      setGameState(stateForSelection);
      setCurrentEvent(null);
      return;
    }

    const { event: nextEvent, remainingPending, endedEarly } = selectNextEvent(stateForSelection, rng);

    if (endedEarly) {
      setGameState({
        ...stateForSelection,
        status: 'ended_early',
        pendingEvents: remainingPending
      })
      setCurrentEvent(null);
    } else {
      setGameState({
        ...stateForSelection,
        pendingEvents: remainingPending,
      })
      setCurrentEvent(nextEvent);
    }

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
  }
  
}