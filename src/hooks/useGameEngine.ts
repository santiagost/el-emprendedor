import { useState } from 'react';
import type { Performance, GameState, GameEvent, Archetype, Financing, GameStep } from '../types/game';
import { startGame, getInitialEvent, selectNextEvent, applyDecision, advanceTurn, canDecide, checkTurnInterruption, rollSurprise } from '../game/engine'
import { type RNG, createRng } from '../game/rng';
import { SAVED_GAME_STORAGE_KEY } from '../game/savedSession';

const STORAGE_KEY = SAVED_GAME_STORAGE_KEY;

const getInitialSeed = (): number => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get('seed');
    if (seedParam) {
      const parsed = parseInt(seedParam, 10);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return Date.now();
};

interface SavedSession {
  gameState: GameState;
  currentEvent: GameEvent | null;
  step: GameStep;
  seed: number;
}

const loadSavedSession = (archetypeId: string, financingId: string): SavedSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: SavedSession = JSON.parse(raw);
    if (
      data.gameState?.archetypeId === archetypeId &&
      data.gameState?.financingId === financingId &&
      data.gameState?.status === 'playing'
    ) {
      return data;
    }
  } catch (err) {
    console.warn('[useGameEngine] Error al leer guardado:', err);
  }
  return null;
};

const saveSession = (data: SavedSession | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (!data) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (err) {
    console.warn('[useGameEngine] Error al guardar partida:', err);
  }
};

export const useGameEngine = (arquetipo: Archetype, financiamiento: Financing, playerName?: string, rng?: RNG, maxTurns?: number, rubroId?: string) => {
  // Todo lo que consume el RNG inicial se arma en un único inicializador: en StrictMode React lo ejecuta dos veces,
  // y así cada ejecución tiene su propio RNG (si no, el primer evento se sortea dos veces y la semilla cambia en dev).
  const [initial] = useState(() => {
    const seed = getInitialSeed();
    const seededRng = rng ?? createRng(seed);
    const savedSession = loadSavedSession(arquetipo.id, financiamiento.id);
    const state: GameState = savedSession?.gameState ?? { ...startGame(arquetipo, financiamiento, maxTurns, rubroId), playerName };
    return {
      seed,
      rng: seededRng,
      saved: savedSession,
      state,
      event: savedSession?.currentEvent ?? getInitialEvent(seededRng, state),
    };
  });
  const { seed: initialSeed, rng: activeRng, saved } = initial;


  const [gameState, setGameState] = useState<GameState>(() => initial.state);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(() => initial.event);
  const [step, setStep] = useState<GameStep>(() => saved?.step ?? 'decision');

  const updateStateAndPersist = (
    nextGameState: GameState,
    nextCurrentEvent: GameEvent | null,
    nextStep: GameStep
  ) => {
    setGameState(nextGameState);
    setCurrentEvent(nextCurrentEvent);
    setStep(nextStep);

    if (nextGameState.status === 'playing') {
      saveSession({
        gameState: nextGameState,
        currentEvent: nextCurrentEvent,
        step: nextStep,
        seed: initialSeed,
      });
    } else {
      saveSession(null);
    }
  };

  const decide = (optionIndex: number, turn: number, performance?: Performance) => {
    if (!canDecide(gameState.status, currentEvent, step, turn, gameState.currentTurn)) return;

    const option = currentEvent.options[optionIndex];
    const surprised = rollSurprise(gameState, option, activeRng);
    const nextState: GameState = applyDecision(
      gameState,
      option,
      currentEvent.id,
      currentEvent.title,
      optionIndex,
      currentEvent.kind,
      performance,
      surprised
    );

    updateStateAndPersist(nextState, currentEvent, 'outcome');
  };

  const advance = () => {
    if (step !== 'outcome') return;
    if (gameState.status !== 'playing') {
      updateStateAndPersist(gameState, null, 'ended');
      return;
    }

    // Si el evento actual fue un evento principal, chequeamos si hay interrupción en este turno
    const isInterruption = currentEvent?.kind === 'crisis' || currentEvent?.kind === 'unforeseen';

    if (!isInterruption) {
      const interruption = checkTurnInterruption(gameState, activeRng);
      if (interruption) {
        updateStateAndPersist(gameState, interruption.event, 'decision');
        return;
      }
    }

    const { nextTurn, nextPhaseId } = advanceTurn(gameState.currentTurn, gameState.maxTurns);
    const advanced: GameState = { ...gameState, currentTurn: nextTurn, phaseId: nextPhaseId };

    const { event: nextEvent, remainingPending, endedEarly } = selectNextEvent(advanced, activeRng);

    if (endedEarly) {
      const endedState: GameState = { ...advanced, status: 'ended_early', pendingEvents: remainingPending };
      updateStateAndPersist(endedState, null, 'ended');
    } else {
      const runningState: GameState = { ...advanced, pendingEvents: remainingPending };
      // Al cerrar una fase (que no es la última) se muestra su resumen antes del primer dilema de la siguiente
      const phaseChanged = nextPhaseId !== gameState.phaseId;
      updateStateAndPersist(runningState, nextEvent, phaseChanged ? 'phase_recap' : 'decision');
    }
  };

  const continueFromRecap = () => {
    if (step !== 'phase_recap') return;
    updateStateAndPersist(gameState, currentEvent, 'decision');
  };

  const restartGame = () => {
    saveSession(null);
    const freshRng = rng ?? createRng(getInitialSeed());
    // Volver a jugar conserva el nombre, la duración y el rubro de la partida anterior
    const initialState: GameState = { ...startGame(arquetipo, financiamiento, gameState.maxTurns, gameState.rubroId), playerName: gameState.playerName };
    setGameState(initialState);
    setCurrentEvent(getInitialEvent(freshRng, initialState));
    setStep('decision');
  };

  return {
    gameState,
    currentEvent,
    step,
    decide,
    advance,
    continueFromRecap,
    restartGame,
  };
};