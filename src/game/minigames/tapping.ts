import type { Performance } from '../../types/game';
import { createRng } from '../rng';

export interface TappingBug {
  id: number;
  spawnMs: number;
  /** Posición en la arena, de 0 a 1. */
  x: number;
  y: number;
}

export interface TappingState {
  elapsedMs: number;
  bugs: TappingBug[];
  /** Cuánto se queda cada bicho en pantalla antes de irse solo. */
  lifetimeMs: number;
  squashed: number[];
  missed: number[];
}

export const BUG_COUNT = 18;
/** En pantallas táctiles se puede jugar con dos dedos: salen más bugs y duran menos. */
export const TOUCH_BUG_COUNT = 26;
const TOUCH_LIFETIME_FACTOR = 0.75;
export const BUG_LIFETIME_MS = 1400;
const ASSISTED_LIFETIME_FACTOR = 1.5;
const FIRST_SPAWN_MS = 600;
const SPAWN_SPAN_MS = 7000;
/** Más de 1: cada vez aparecen más seguidos, como cuando se acerca la entrega. */
const RAMP = 1.4;
const MIN_DISTANCE = 0.22;
export const TAPPING_DURATION_MS = FIRST_SPAWN_MS + SPAWN_SPAN_MS + BUG_LIFETIME_MS * ASSISTED_LIFETIME_FACTOR;
/** Proporción de bichos eliminados para cada nivel. */
const PERFECT_RATIO = 0.85;
const GOOD_RATIO = 0.55;

/** Cada bicho aparece más pronto que el anterior; la posición evita los bichos recientes para que no se tapen. */
export function buildBugs(seed: number, count = BUG_COUNT): TappingBug[] {
  const rng = createRng(seed);
  const bugs: TappingBug[] = [];
  for (let id = 0; id < count; id++) {
    const u = id / (count - 1);
    const spawnMs = Math.round(FIRST_SPAWN_MS + SPAWN_SPAN_MS * (1 - (1 - u) ** RAMP));
    let x = 0;
    let y = 0;
    for (let tries = 0; tries < 30; tries++) {
      x = rng.nextFloat(0.08, 0.92);
      y = rng.nextFloat(0.15, 0.85);
      const clear = bugs
        .slice(-6)
        .every((b) => Math.hypot((b.x - x) * 1.6, b.y - y) >= MIN_DISTANCE);
      if (clear) break;
    }
    bugs.push({ id, spawnMs, x, y });
  }
  return bugs;
}

export function createTapping(seed: number, assisted = false, touch = false): TappingState {
  const lifetime = BUG_LIFETIME_MS * (assisted ? ASSISTED_LIFETIME_FACTOR : 1) * (touch ? TOUCH_LIFETIME_FACTOR : 1);
  return {
    elapsedMs: 0,
    bugs: buildBugs(seed, touch ? TOUCH_BUG_COUNT : BUG_COUNT),
    lifetimeMs: Math.round(lifetime),
    squashed: [],
    missed: [],
  };
}

export const isTappingFinished = (s: TappingState): boolean => s.squashed.length + s.missed.length >= s.bugs.length;

/** Bichos que están en pantalla ahora (ya aparecieron, siguen vivos y no se eliminaron). */
export function visibleBugs(s: TappingState): TappingBug[] {
  return s.bugs.filter(
    (b) =>
      s.elapsedMs >= b.spawnMs &&
      s.elapsedMs < b.spawnMs + s.lifetimeMs &&
      !s.squashed.includes(b.id) &&
      !s.missed.includes(b.id)
  );
}

export function squashBug(s: TappingState, id: number): TappingState {
  if (isTappingFinished(s) || !visibleBugs(s).some((b) => b.id === id)) return s;
  return { ...s, squashed: [...s.squashed, id] };
}

/** Bichos que ya aparecieron hasta ahora (para la cuenta "eliminados / aparecidos"). */
export const appearedCount = (s: TappingState): number => s.bugs.filter((b) => s.elapsedMs >= b.spawnMs).length;

export function advance(s: TappingState, dtMs: number): TappingState {
  if (isTappingFinished(s)) return s;
  const elapsedMs = s.elapsedMs + dtMs;
  const missed = [...s.missed];
  for (const b of s.bugs) {
    if (elapsedMs >= b.spawnMs + s.lifetimeMs && !s.squashed.includes(b.id) && !missed.includes(b.id)) missed.push(b.id);
  }
  return { ...s, elapsedMs, missed };
}

/** Rendimiento: bichos eliminados sobre los que aparecieron (en una partida terminada, sobre el total). */
export function tappingPerformance(s: TappingState): Performance {
  const ratio = s.squashed.length / s.bugs.length;
  if (ratio >= PERFECT_RATIO) return 'perfect';
  if (ratio >= GOOD_RATIO) return 'good';
  return 'poor';
}
