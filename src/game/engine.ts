import type { Performance, GameEvent, GameState, GameStep, Archetype, Financing, PendingEvent, Metrics, GameStatus, GameOption, GameEventKind } from '../types/game';
import { GAME_EVENTS, MAIN_EVENTS, CRISIS_EVENTS, UNFORESEEN_EVENTS } from '../data/events/index';
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
  unforeseenEventsPlayed: 0,
};

export const getRandomWeightedEvent = (events: readonly GameEvent[], rng: RNG): GameEvent => {
  return rng.pickWeighted(events, (ev) => ev.weight ?? 10)
};

export const getInitialEvent = (rng: RNG): GameEvent => {
  const phaseOneEvents = MAIN_EVENTS.filter(
    (ev) => ev.phaseId === 1 && (!ev.requiredTags || ev.requiredTags.length === 0));
  return getRandomWeightedEvent(phaseOneEvents, rng);
}

export const validateInitialMetrics = (initialMetric: number, archetypeEffect = 0, financingEffect = 0): number => {
  const total = initialMetric + archetypeEffect + financingEffect;
  return clamp(total);
};

export const startGame = (archetype: Archetype, financing: Financing): GameState => {
  const metrics: Metrics = {
    capital: validateInitialMetrics(INITIAL_STATE.metrics.capital, archetype.effects.capital, financing.effects.capital),
    bienestar: validateInitialMetrics(INITIAL_STATE.metrics.bienestar, archetype.effects.bienestar, financing.effects.bienestar),
    reputacion: validateInitialMetrics(INITIAL_STATE.metrics.reputacion, archetype.effects.reputacion, financing.effects.reputacion),
  };
  return {
    ...INITIAL_STATE,
    metrics,
    initialMetrics: { ...metrics },
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

  const phasePool = MAIN_EVENTS.filter((ev) => {
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

  const globalFallback = MAIN_EVENTS.filter((ev) => {
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

export interface InterruptionResult {
  event: GameEvent;
  kind: 'crisis' | 'unforeseen';
}

export function checkTurnInterruption(
  state: GameState,
  rng: RNG
): InterruptionResult | null {
  if (state.status !== 'playing') {
    return null;
  }

  // 1. Chequeo de Crisis: si cualquier métrica está en zona crítica (<= 25%)
  const isCritical =
    state.metrics.capital <= 25 ||
    state.metrics.bienestar <= 25 ||
    state.metrics.reputacion <= 25;

  if (isCritical) {
    const eligibleCrisis = CRISIS_EVENTS.filter((ev) => {
      if (state.history.includes(ev.id)) return false;
      return passesWhenCondition(ev, state);
    });

    if (eligibleCrisis.length > 0) {
      return {
        event: getRandomWeightedEvent(eligibleCrisis, rng),
        kind: 'crisis',
      };
    }
  }

  // 2. Chequeo de Imprevistos (Cisnes negros / Macro):
  // Máximo 3 imprevistos por partida
  const playedCount = state.unforeseenEventsPlayed ?? 0;
  if (playedCount < 3) {
    // Probabilidad base 25%. Si estamos en turno 7+ y aún no ocurrió ninguno, sube a 45%
    const prob = (state.currentTurn >= 7 && playedCount === 0) ? 0.45 : 0.25;
    const roll = rng.next();

    if (roll < prob) {
      const eligibleUnforeseen = UNFORESEEN_EVENTS.filter((ev) => {
        if (state.history.includes(ev.id)) return false;
        return passesWhenCondition(ev, state);
      });

      if (eligibleUnforeseen.length > 0) {
        return {
          event: getRandomWeightedEvent(eligibleUnforeseen, rng),
          kind: 'unforeseen',
        };
      }
    }
  }

  return null;
}

/** Multiplicadores por rendimiento: los efectos positivos escalan hacia arriba y los negativos a la inversa. */
const PERFORMANCE_GAIN: Record<Performance, number> = { perfect: 1.25, good: 1, poor: 0.6 };
const PERFORMANCE_LOSS: Record<Performance, number> = { perfect: 0.6, good: 1, poor: 1.25 };

export function scaleEffects(effects: Partial<Metrics>, performance: Performance): Partial<Metrics> {
  if (performance === 'good') return effects;
  const scaled: Partial<Metrics> = {};
  (Object.keys(effects) as (keyof Metrics)[]).forEach((key) => {
    const value = effects[key];
    if (value == null) return;
    const factor = value >= 0 ? PERFORMANCE_GAIN[performance] : PERFORMANCE_LOSS[performance];
    scaled[key] = Math.sign(value) * Math.round(Math.abs(value) * factor);
  });
  return scaled;
}

const isGameOver = (status: GameStatus): boolean => status.startsWith('game_over');

/** Primera fase donde se muestra la tendencia y puede fallar; desde la última se corrige si salieron pocas. */
const SURPRISE_FIRST_PHASE: PhaseId = 3;
const SURPRISE_LAST_PHASE: PhaseId = 4;
export const SURPRISE_BASE_CHANCE = 0.25;
export const SURPRISE_MIN = 3;
export const SURPRISE_MAX = 6;

/**
 * Probabilidad de que la próxima opción con sorpresa falle: 25 % por defecto; en la última fase, si todavía no salieron
 * SURPRISE_MIN, sube a faltantes / turnos que quedan (contando el actual); con SURPRISE_MAX ya no hay más.
 */
export function surpriseChance(state: GameState): number {
  const played = state.surprisesPlayed ?? 0;
  if (state.phaseId < SURPRISE_FIRST_PHASE || played >= SURPRISE_MAX) return 0;
  if (state.phaseId < SURPRISE_LAST_PHASE || played >= SURPRISE_MIN) return SURPRISE_BASE_CHANCE;
  const turnsLeft = state.maxTurns - state.currentTurn + 1;
  return Math.min(1, Math.max(SURPRISE_BASE_CHANCE, (SURPRISE_MIN - played) / turnsLeft));
}

/** Sortea si el resultado de esta opción contradice la tendencia. Solo consume el RNG cuando la sorpresa es posible. */
export function rollSurprise(state: GameState, option: GameOption, rng: RNG): boolean {
  if (!option.surprise || option.minigame) return false;
  const chance = surpriseChance(state);
  return chance > 0 && rng.next() < chance;
}

/**
 * Efectos y etiquetas finales de una opción según el rendimiento en su minijuego.
 * Sin minijuego (o sin rendimiento) es la opción tal cual. Un 'poor' nunca causa un game over por sí solo:
 * si lo provocara y 'good' no, se aplica 'good'.
 */
export function resolveOption(
  state: GameState,
  option: GameOption,
  performance?: Performance,
  surprised?: boolean
): { effects: Partial<Metrics>; addTags?: Tag[]; removeTags?: Tag[]; performance?: Performance; outcomeText?: string; surprised?: true } {
  if (surprised && option.surprise && !option.minigame) {
    const surprise = { effects: option.surprise.effects, addTags: option.addTags, removeTags: option.removeTags, outcomeText: option.surprise.outcomeText, surprised: true as const };
    const statusOf = (effects: Partial<Metrics>) => {
      const tags = applyTags(state.activeTags, option.addTags, option.removeTags);
      return evaluateGameStatus(applyModifiers(applyMetricsEffects(state.metrics, effects), tags), state.currentTurn, state.maxTurns);
    };
    // Igual que un 'poor': la sorpresa nunca causa un game over por sí sola
    if (isGameOver(statusOf(surprise.effects)) && !isGameOver(statusOf(option.effects))) {
      return { effects: option.effects, addTags: option.addTags, removeTags: option.removeTags };
    }
    return surprise;
  }
  const spec = option.minigame;
  if (!spec || !performance) return { effects: option.effects, addTags: option.addTags, removeTags: option.removeTags };

  const build = (tier: Performance) => {
    const extra = spec.tagsByPerformance?.[tier];
    return {
      effects: spec.effectsByPerformance?.[tier] ?? scaleEffects(option.effects, tier),
      // Lo que el rendimiento quita gana sobre lo que la opción suma (ej. 'perfect' evita Equity Diluido)
      addTags: [...(option.addTags ?? []), ...(extra?.addTags ?? [])].filter((t) => !extra?.removeTags?.includes(t)),
      removeTags: [...(option.removeTags ?? []), ...(extra?.removeTags ?? [])],
      performance: tier,
      outcomeText: spec.outcomeTextByPerformance?.[tier],
    };
  };
  const statusOf = (r: ReturnType<typeof build>) => {
    const tags = applyTags(state.activeTags, r.addTags, r.removeTags);
    const metrics = applyModifiers(applyMetricsEffects(state.metrics, r.effects), tags);
    return evaluateGameStatus(metrics, state.currentTurn, state.maxTurns);
  };

  const result = build(performance);
  if (performance === 'poor' && isGameOver(statusOf(result)) && !isGameOver(statusOf(build('good')))) {
    return build('good');
  }
  return result;
}

export function applyDecision(
  state: GameState,
  option: GameOption,
  eventId: string,
  eventTitle?: string,
  optionIndex?: number,
  eventKind?: GameEventKind,
  performance?: Performance,
  surprised?: boolean
): GameState {
  const resolved = resolveOption(state, option, performance, surprised);
  const immediateMetrics = applyMetricsEffects(state.metrics, resolved.effects);
  const nextTags = applyTags(state.activeTags, resolved.addTags, resolved.removeTags);
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
  const resolvedKind = eventKind ?? (eventId.startsWith('crisis_') ? 'crisis' : eventId.startsWith('imp_') ? 'unforeseen' : 'main');

  const logEntry = {
    turn: state.currentTurn,
    eventId,
    eventTitle: eventTitle ?? eventId,
    kind: resolvedKind,
    optionIndex: optionIndex ?? 0,
    optionText: option.text,
    outcomeText: resolved.outcomeText ?? option.outcomeText,
    effects: resolved.effects,
    appliedModifiers,
    learningPill: option.learningPill,
    ...(resolved.performance ? { performance: resolved.performance } : {}),
    ...(resolved.surprised ? { surprised: true as const } : {}),
    metricsAfter: nextMetrics,
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
    unforeseenEventsPlayed: (state.unforeseenEventsPlayed ?? 0) + (resolvedKind === 'unforeseen' ? 1 : 0),
    surprisesPlayed: (state.surprisesPlayed ?? 0) + (resolved.surprised ? 1 : 0),
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