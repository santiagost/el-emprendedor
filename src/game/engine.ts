import type { GameEvent, GameState, GameStep, Archetype, Financing, PendingEvent, Metrics, GameStatus, GameOption } from '../types/game';
import { GAME_EVENTS } from '../data/events/index';
import { MAX_TURNS, phaseForTurn, PHASES, type PhaseId } from './phases';
import type { RNG } from './rng';
import { TAGS, type Tag } from '../data/tags';

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
  decisionLog: [],
  lastDecision: null,
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
    archetypeId: archetype.id,
    financingId: financing.id
  };
};

export const passesWhenCondition = (event: GameEvent, state: GameState): boolean => {
  const when = event.when;

  if (!when && !event.requiredTags && !event.forbiddenTags) {
    return true;
  }

  const required = when?.tags ?? event.requiredTags;
  if (required && required.length > 0) {
    const hasAll = required.every((t) => state.activeTags.includes(t));
    if (!hasAll) return false;
  }

  const forbidden = when?.forbiddenTags ?? event.forbiddenTags;
  if (forbidden && forbidden.length > 0) {
    const hasAnyForbidden = forbidden.some((t) => state.activeTags.includes(t));
    if (hasAnyForbidden) return false;
  }

  if (when?.archetype && when.archetype.length > 0) {
    if (!state.archetypeId || !when.archetype.includes(state.archetypeId)) {
      return false;
    }
  }

  if (when?.financing && when.financing.length > 0) {
    if (!state.financingId || !when.financing.includes(state.financingId)) {
      return false;
    }
  }

  if (when?.playedBefore && when.playedBefore.length > 0) {
    const hasPlayedAll = when.playedBefore.every((id) => state.history.includes(id));
    if (!hasPlayedAll) return false;
  }

  if (when?.metrics) {
    for (const [key, rule] of Object.entries(when.metrics)) {
      const metricVal = state.metrics[key as keyof Metrics];
      if (rule.lt !== undefined && metricVal >= rule.lt) return false;
      if (rule.gt !== undefined && metricVal <= rule.gt) return false;
    }
  }

  return true;
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
    return targetEvent ? passesWhenCondition(targetEvent, state) : false;
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
    return passesWhenCondition(ev, state)
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
    const isUngated = !ev.when && (!ev.requiredTags || ev.requiredTags.length === 0) && (!ev.forbiddenTags || ev.forbiddenTags.length === 0);
    return isUngated;
  })

  if (globalFallback.length > 0) {
    if (import.meta.env?.DEV) {
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

export function applyTags(currentTags: Tag[],
  addTags: Tag[] = [],
  removeTags: Tag[] = [],
): Tag[] {
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

export function canDecide(
  status: GameStatus,
  currentEvent: GameEvent | null,
  step: GameStep,
  turn: number,
  currentTurn: number,
): currentEvent is GameEvent {
  return status === 'playing' && currentEvent !== null && step === 'decision' && turn === currentTurn;
}

export function calculateModifiersDelta(activeTags: Tag[]): Partial<Metrics> {
  let capital = 0;
  let bienestar = 0;
  let reputacion = 0;
  for (const tag of activeTags) {
    const mods: Partial<Metrics> = TAGS[tag]?.modifiers ?? {};
    capital += mods.capital ?? 0;
    bienestar += mods.bienestar ?? 0;
    reputacion += mods.reputacion ?? 0;
  }
  return {
    ...(capital !== 0 ? { capital } : {}),
    ...(bienestar !== 0 ? { bienestar } : {}),
    ...(reputacion !== 0 ? { reputacion } : {}),
  };
}

export function applyDecision(
  state: GameState,
  option: GameOption,
  eventId: string,
  eventTitle?: string,
  optionIndex?: number
): GameState {
  const immediateMetrics = applyMetricsEffects(state.metrics, option.effects);
  const nextTags = applyTags(state.activeTags, option.addTags, option.removeTags);
  const nextMetrics = applyModifiers(immediateMetrics, nextTags);
  const appliedModifiers = calculateModifiersDelta(nextTags);

  const nextPendingEvents = [...(state.pendingEvents ?? [])];
  if (option.scheduledEvent) {
    nextPendingEvents.push({
      eventId: option.scheduledEvent.eventId,
      triggerTurn: state.currentTurn + option.scheduledEvent.delayTurns,
    });
  }

  const status = evaluateGameStatus(nextMetrics, state.currentTurn, state.maxTurns);

  const logEntry = {
    turn: state.currentTurn,
    eventId,
    eventTitle: eventTitle ?? eventId,
    optionIndex: optionIndex ?? 0,
    optionText: option.text,
    effects: option.effects,
    appliedModifiers,
    learningPill: option.learningPill,
  };

  return {
    ...state,
    metrics: nextMetrics,
    activeTags: nextTags,
    history: [...state.history, eventId],
    lastPill: option.learningPill ?? null,
    pendingEvents: nextPendingEvents,
    decisionLog: [...(state.decisionLog ?? []), logEntry],
    lastDecision: logEntry,
    status,
  };
}

export function applyModifiers(metrics: Metrics, activeTags: Tag[]): Metrics {
  let { capital, bienestar, reputacion } = metrics;
  for (const tag of activeTags) {
    const modifiers: Partial<Metrics> = TAGS[tag]?.modifiers ?? {};
    capital += modifiers.capital ?? 0;
    bienestar += modifiers.bienestar ?? 0;
    reputacion += modifiers.reputacion ?? 0;
  }
  
  return {
    capital: clamp(capital),
    bienestar: clamp(bienestar),
    reputacion: clamp(reputacion),
  };
}