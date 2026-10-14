import type { GameEvent, GameState, Archetype, Financing, PendingEvent, Metrics, GameStatus, GameOption } from '../types/game';
import { GAME_EVENTS } from '../data/events';
import { MAX_TURNS, phaseForTurn, PHASES, type PhaseId } from './phases';
import type { RNG } from './rng';

export const clamp = (val: number, min = 0, max = 100): number => Math.max(min, Math.min(max, val));

const INITIAL_STATE: GameState = {
  currentTurn: 1,
  maxTurns: MAX_TURNS,
  phaseId: PHASES[0].id,
  metrics: { capital: 50, reputacion: 50, bienestar: 50 },
  activeTags: [],
  history: [],
  status: 'playing',
  lastPill: null,
  pendingEvents: [],
};

export const getRandomWeightedEvent = (events: readonly GameEvent[], rng: RNG): GameEvent => {
  return rng.pickWeighted(events, (ev) => ev.weight ?? 10)
};

export const getInitialEvent = (rng: RNG): GameEvent => {
  const phaseOneEvents = GAME_EVENTS.filter(
    (ev) => ev.phaseId === 1 && (!ev.requiredTags || ev.requiredTags.length === 0));
  return getRandomWeightedEvent(phaseOneEvents, rng);
}

export const validateInitialMetrics = (initialMetric: number, archetypeEffect = 0, financingEffect = 0): number => {
  const total = initialMetric + archetypeEffect + financingEffect;
  return clamp(total);
};

export const startGame = (archetype: Archetype, financing: Financing): GameState => {
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

export const passesTagsCondition = (event: GameEvent, activeTags: string[]): boolean => {
  const hasRequired = event.requiredTags
    ? event.requiredTags.every((tag) => activeTags.includes(tag))
    : true;

  const hasForbidden = event.forbiddenTags
    ? event.forbiddenTags.some((tag) => activeTags.includes(tag))
    : false;

  return hasRequired && !hasForbidden;
};

export interface SelectionResult {
  event: GameEvent | null;
  remainingPending: PendingEvent[];
  endedEarly: boolean;
}

export const selectNextEvent = (state: GameState, rng: RNG): SelectionResult => {
  const eventsMap = new Map<string, GameEvent>(GAME_EVENTS.map(
    (ev) => [ev.id, ev]));

  const pendingIndex = state.pendingEvents.findIndex((pending) => {
    if (state.currentTurn < pending.triggerTurn) return false;
    const targetEvent = eventsMap.get(pending.eventId);
    return targetEvent ? passesTagsCondition(targetEvent, state.activeTags) : false;
  })

  if (pendingIndex !== -1) {
    const chosenPending = state.pendingEvents[pendingIndex];
    const event = eventsMap.get(chosenPending.eventId)!;
    const remainingPending = state.pendingEvents.filter((_, idx) => idx !== pendingIndex);

    return {
      event,
      remainingPending,
      endedEarly: false,
    }
  }

  const phasePool = GAME_EVENTS.filter((ev) => {
    if (state.history.includes(ev.id)) return false;
    if (ev.phaseId !== state.phaseId) return false;
    return passesTagsCondition(ev, state.activeTags)
  })

  if (phasePool.length > 0) {
    return {
      event: getRandomWeightedEvent(phasePool, rng),
      remainingPending: state.pendingEvents,
      endedEarly: false
    }
  }

  const globalFallback = GAME_EVENTS.filter((ev) => {
    if (state.history.includes(ev.id)) return false;
    const isUn_gated = !ev.requiredTags || ev.requiredTags.length === 0;
    return isUn_gated;
  })

  if (globalFallback.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(
        `[GameEngine] Fase ${state.phaseId} sin eventos disponibles en turno ${state.currentTurn}. Usando fallback global.`
      );
    }

    return {
      event: getRandomWeightedEvent(globalFallback, rng),
      remainingPending: state.pendingEvents,
      endedEarly: false,
    };
  }

  return {
    event: null,
    remainingPending: state.pendingEvents,
    endedEarly: true
  };
};


export function applyMetricsEffects(currents: Metrics,
  effects?: Partial<Metrics>): Metrics {
  if (!effects) return { ...currents };
  return {
    capital: clamp(currents.capital + (effects.capital ?? 0), 0, 100),
    reputacion: clamp(currents.reputacion + (effects.reputacion ?? 0), 0, 100),
    bienestar: clamp(currents.bienestar + (effects.bienestar ?? 0), 0, 100),
  };
}

export function applyTags(currentTags: string[],
  addTags: string[] = [],
  removeTags: string[] = [],
): string[] {
  const toRemove = new Set(removeTags);
  const remaining = currentTags.filter((t) => !toRemove.has(t));
  return Array.from(new Set([...remaining, ...addTags]));
}

export function evaluateGameStatus(
  metrics: Metrics,
  turnJustResolved: number,
  maxTurns: number
): GameStatus {
  if (metrics.capital <= 0) return 'game_over_capital';
  if (metrics.bienestar <= 0) return 'game_over_bienestar';
  if (metrics.reputacion <= 0) return 'game_over_reputacion';
  if (turnJustResolved >= maxTurns) return 'victory';
  return 'playing';
}

export function advanceTurn(
  currentTurn: number,
  maxTurns: number,
): { nextTurn: number, nextPhaseId: PhaseId } {
  const nextTurn = currentTurn + 1;
  const boundedTurn = Math.min(nextTurn, maxTurns);
  const phase = phaseForTurn(boundedTurn);
  if (!phase) {
    throw new RangeError(`No hay una fase definida para el turno ${boundedTurn}`);
  }
  return { nextTurn: boundedTurn, nextPhaseId: phase.id };
}

export function applyDecision(
  state: GameState,
  option: GameOption,
  eventId: string
): GameState {
  const nextMetrics = applyMetricsEffects(state.metrics, option.effects);
  const nextTags = applyTags(state.activeTags, option.addTags, option.removeTags);

  const nextPendingEvents = [...(state.pendingEvents ?? [])];
  if (option.scheduledEvent) {
    nextPendingEvents.push({
      eventId: option.scheduledEvent.eventId,
      triggerTurn: state.currentTurn + option.scheduledEvent.delayTurns,
    });
  }

  const status = evaluateGameStatus(nextMetrics, state.currentTurn, state.maxTurns);

  return {
    ...state,
    metrics: nextMetrics,
    activeTags: nextTags,
    history: [...state.history, eventId],
    lastPill: option.learningPill ?? null,
    pendingEvents: nextPendingEvents,
    status,
  };
}
