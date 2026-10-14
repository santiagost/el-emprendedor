import { useState, useRef } from 'react';
import type { GameState, GameEvent, GameOption, Archetype, Financing, GameStep } from '../types/game';
import { startGame, getInitialEvent, selectNextEvent, applyDecision } from '../game/engine'
import { type RNG, createRng } from '../game/rng';

export const useGameEngine = (arquetipo: Archetype, financiamiento: Financing, rng?: RNG) => {
  const random = createRng(Date.now())
  const rngRef = useRef(rng ?? random)
  const [gameState, setGameState] = useState<GameState>(() => startGame(arquetipo, financiamiento));
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(getInitialEvent(rngRef.current));
  const [step, setStep] = useState<GameStep>('decision')

  const makeDecision = (option: GameOption, turn?: number) => {
    if (gameState.status !== 'playing' || !currentEvent || step !== 'decision') return;
    if (turn !== undefined && turn !== gameState.currentTurn) return;

    const nextState: GameState = applyDecision(gameState, option, currentEvent.id)

    setGameState(nextState);
    setStep('outcome');
  }

  const advance = () => {
    if (step !== 'outcome') return;
    if (gameState.status !== 'playing') {
      setStep('ended');
      setCurrentEvent(null);
      return;
    }

    const { event: nextEvent, remainingPending, endedEarly } = selectNextEvent(gameState, rngRef.current);

    if (endedEarly) {
      setGameState((prev) => ({
        ...prev,
        status: 'ended_early',
        pendingEvents: remainingPending
      }));
      setCurrentEvent(null);
      setStep('ended')
    } else {
      setGameState((prev) => ({
        ...prev,
        pendingEvents: remainingPending,
      }));
      setCurrentEvent(nextEvent);
      setStep('decision');
    }
  };

  const restartGame = () => {
    const initialState = startGame(arquetipo, financiamiento);
    setGameState(initialState);
    setCurrentEvent(getInitialEvent(rngRef.current));
    setStep('decision');
  };

  return {
    gameState,
    currentEvent,
    step,
    makeDecision,
    advance,
    restartGame,
  };
}