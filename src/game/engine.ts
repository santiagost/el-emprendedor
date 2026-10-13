import type { GameEvent, GameState, Archetype, Financing, PendingEvent } from '../types/game';
import { GAME_EVENTS } from '../data/events';
import { MAX_TURNS, PHASES } from './phases';
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
  const eventsMap = new Map<String, GameEvent>(GAME_EVENTS.map(
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
    console.warn(
      `[GameEngine] Fase ${state.phaseId} sin eventos disponibles en turno ${state.currentTurn}. Usando fallback global.`
    );

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


//   // Filtrar eventos por etapa, que no se hayan jugado y que cumplan condiciones de tags
//   const available = GAME_EVENTS.filter((ev) => {
//     if (state.history.includes(ev.id)) return false;
//     if (ev.phaseId !== state.phaseId) return false;

//     const hasRequiredTags = ev.requiredTags
//       ? ev.requiredTags.every((t) => state.activeTags.includes(t))
//       : true;

//     const hasForbiddenTags = ev.forbiddenTags
//       ? ev.forbiddenTags.some((t) => state.activeTags.includes(t))
//       : false;

//     return hasRequiredTags && !hasForbiddenTags;
//   });
//   // Si hay eventos disponibles para la etapa y tags actuales
// if (available.length > 0) {
//   return getRandomWeightedEvent(available);
// }

// // 2. Fallback neutral si no hay candidatos (no jugados y sin tags requeridos)
// const phaseNeutralFallback = GAME_EVENTS.filter((ev) => {
//   if (state.history.includes(ev.id)) return false;
//   if (ev.phaseId !== state.phaseId) return false;
//   const hasRequired = ev.requiredTags && ev.requiredTags.length > 0;
//   return !hasRequired;
// });

// if (phaseNeutralFallback.length > 0) {
//   return getRandomWeightedEvent(phaseNeutralFallback);
// }

// const emergencyFallback = GAME_EVENTS.filter((ev) => {
//   if (state.history.includes(ev.id)) return false;
//   const hasRequired = ev.requiredTags && ev.requiredTags.length > 0;
//   return !hasRequired;
// });

// return emergencyFallback.length > 0 ? getRandomWeightedEvent(emergencyFallback) : null;
