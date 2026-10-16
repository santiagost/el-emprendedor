import { useState } from 'react';
import type { GameState, GameEvent, Archetype, Financing, GameStep } from '../types/game';
import { startGame, getInitialEvent, selectNextEvent, applyDecision, advanceTurn, canDecide } from '../game/engine'
import { type RNG, createRng } from '../game/rng';

const sessionRng = createRng(Date.now());

export const useGameEngine = (arquetipo: Archetype, financiamiento: Financing, rng?: RNG) => {
  const [activeRng] = useState<RNG>(() => rng ?? sessionRng);
  const [gameState, setGameState] = useState<GameState>(() => startGame(arquetipo, financiamiento));
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(() => getInitialEvent(activeRng));
  const [step, setStep] = useState<GameStep>('decision')

  const decide = (optionIndex: number, turn: number) => {
    if (!canDecide(gameState.status, currentEvent, step, turn, gameState.currentTurn)) return;

    const option = currentEvent.options[optionIndex];
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

    const { nextTurn, nextPhaseId } = advanceTurn(gameState.currentTurn, gameState.maxTurns);
    const advanced: GameState = { ...gameState, currentTurn: nextTurn, phaseId: nextPhaseId };

    const { event: nextEvent, remainingPending, endedEarly } = selectNextEvent(advanced, activeRng);

    if (endedEarly) {
      setGameState({ ...advanced, status: 'ended_early', pendingEvents: remainingPending });
      setCurrentEvent(null);
      setStep('ended')
    } else {
      setGameState({ ...advanced, pendingEvents: remainingPending });
      setCurrentEvent(nextEvent);
      setStep('decision');
    }
  };

  const restartGame = () => {
    const initialState = startGame(arquetipo, financiamiento);
    setGameState(initialState);
    setCurrentEvent(getInitialEvent(activeRng));
    setStep('decision');
  };

  return {
    gameState,
    currentEvent,
    step,
    decide,
    advance,
    restartGame,
  };
}