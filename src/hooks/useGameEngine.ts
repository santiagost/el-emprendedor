import { useState, useCallback } from 'react';
import type { GameState, GameEvent, GameOption, Metrics } from '../types/game';
import { GAME_EVENTS } from '../data/events';
import type { Archetype, Financing } from '../types/game';

const INITIAL_STATE: GameState = {
  currentTurn: 1,
  maxTurns: 15,
  phaseId: 1,
  metrics: { capital: 50, reputacion: 50, bienestar: 50 },
  activeTags: [],
  history: [],
  status: 'playing',
  lastPill: null,
};


const getRandomWeightedEvent = (events: GameEvent[]): GameEvent => {
  const totalWeight = events.reduce((sum, ev) => sum + (ev.weight || 10), 0);
  let random = Math.random() * totalWeight;

  for (const ev of events) {
    const weight = ev.weight ?? 10;
    if (random < weight) {
      return ev;
    }
    random -= weight;
  }
  return events[0]; // fallback
};

const getInitialEvent = (): GameEvent => {
  const phaseOneEvents = GAME_EVENTS.filter((ev) => ev.phaseId === 1 && (!ev.requiredTags || ev.requiredTags.length === 0));
  return getRandomWeightedEvent(phaseOneEvents);
}

const validateInitialMetrics = (initialMetric: number, archetypeEffect: number | undefined, financingEffect: number | undefined): number => {
  const total = initialMetric + (archetypeEffect || 0) + (financingEffect || 0);
  if (total < 0 || total > 100) {
    console.warn(`Initial metric value out of bounds: ${total}. Clamping to [0, 100].`);
    return Math.max(0, Math.min(100, total));
  }
  return Math.max(0, Math.min(100, total));
}

const startGame = (archetype: Archetype, financing: Financing): GameState => {
  return {
    ...INITIAL_STATE,
    metrics: {
      capital: validateInitialMetrics(INITIAL_STATE.metrics.capital, archetype.effects.capital, financing.effects.capital),
      bienestar: validateInitialMetrics(INITIAL_STATE.metrics.bienestar, archetype.effects.bienestar, financing.effects.bienestar),
      reputacion: validateInitialMetrics(INITIAL_STATE.metrics.reputacion, archetype.effects.reputacion, financing.effects.reputacion),
    },
    activeTags: [...(archetype.tags || []), ...(financing.tags || [])],
  };
};

export const useGameEngine = (arquetipo: Archetype, financiamiento: Financing) => {
  const [gameState, setGameState] = useState<GameState>(() => startGame(arquetipo, financiamiento));
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(getInitialEvent());

  const clamp = (val: number) => Math.max(0, Math.min(100, val));

  const selectNextEvent = useCallback((state: GameState): GameEvent | null => {
    // Filtrar eventos por etapa, que no se hayan jugado y que cumplan condiciones de tags
    const available = GAME_EVENTS.filter((ev) => {
      if (state.history.includes(ev.id)) return false;
      if (ev.phaseId !== state.phaseId) return false;

      const hasRequiredTags = ev.requiredTags
        ? ev.requiredTags.every((t) => state.activeTags.includes(t))
        : true;

      const hasForbiddenTags = ev.forbiddenTags
        ? ev.forbiddenTags.some((t) => state.activeTags.includes(t))
        : false;

      return hasRequiredTags && !hasForbiddenTags;
    });

    if (available.length === 0) {
      const neutralFallback = GAME_EVENTS.filter((ev) => {
        if (state.history.includes(ev.id)) return false;
        const hasRequired = ev.requiredTags && ev.requiredTags.length > 0;
        return !hasRequired;
      });

      if (neutralFallback.length > 0) {
        return getRandomWeightedEvent(neutralFallback);
      }

      return null;
    }
    return getRandomWeightedEvent(available);
  }, []);

  const makeDecision = (option: GameOption) => {
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
    const nextStage = nextTurn > 10 ? 4 : nextTurn > 6 ? 3 : nextTurn > 3 ? 2 : 1;

    const nextState: GameState = {
      ...gameState,
      currentTurn: nextTurn,
      phaseId: nextStage,
      metrics: newMetrics,
      activeTags: updatedTags,
      history: [...gameState.history, currentEvent.id],
      status: newStatus,
      lastPill: option.learningPill!,
    };

    setGameState(nextState);

    if (newStatus === 'playing') {
      setCurrentEvent(selectNextEvent(nextState));
    }
  };

  const restartGame = () => {
    const initialState = startGame(arquetipo, financiamiento);
    setGameState(initialState);
    setCurrentEvent(getInitialEvent());
  };

  return {
    gameState,
    currentEvent,
    makeDecision,
    restartGame,
  };
};