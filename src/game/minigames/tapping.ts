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
  /** Avance de la entrega, de 0 a 1. */
  progress: number;
  taps: number;
  /** Instante en que se llenó la barra; null si todavía no. */
  filledAtMs: number | null;
  bugs: TappingBug[];
  squashed: number[];
  missed: number[];
}

export const TAPPING_DURATION_MS = 5000;
export const BUG_LIFETIME_MS = 1300;
const DECAY_PER_S = 0.08;
const TAP_GAIN = 0.06;
const ASSISTED_GAIN_FACTOR = 1.4;
/** Pasado este avance cada toque rinde menos: la fatiga. */
const FATIGUE_FROM = 0.7;
const FATIGUE_FACTOR = 0.55;
/** Un bicho que se te pasa sin aplastar te cuesta este avance. */
const BUG_PENALTY = 0.06;
/** Con al menos esta holgura al llenar la barra, la entrega es perfecta. */
const PERFECT_SPARE_MS = 800;
const BUG_COUNT = 3;

export function buildBugs(seed: number): TappingBug[] {
  const rng = createRng(seed);
  const slot = (TAPPING_DURATION_MS - 1500 - BUG_LIFETIME_MS) / BUG_COUNT;
  return Array.from({ length: BUG_COUNT }, (_, id) => ({
    id,
    spawnMs: Math.round(700 + id * slot + rng.nextFloat(0, slot * 0.6)),
    x: rng.nextFloat(0.08, 0.92),
    y: rng.nextFloat(0.2, 0.8),
  }));
}

export function createTapping(seed: number): TappingState {
  return { elapsedMs: 0, progress: 0, taps: 0, filledAtMs: null, bugs: buildBugs(seed), squashed: [], missed: [] };
}

export const isTappingFinished = (s: TappingState): boolean =>
  s.filledAtMs !== null || s.elapsedMs >= TAPPING_DURATION_MS;

export function tap(s: TappingState, assisted = false): TappingState {
  if (isTappingFinished(s)) return s;
  const base = TAP_GAIN * (assisted ? ASSISTED_GAIN_FACTOR : 1);
  const gain = s.progress >= FATIGUE_FROM ? base * FATIGUE_FACTOR : base;
  const progress = Math.min(1, s.progress + gain);
  return { ...s, taps: s.taps + 1, progress, filledAtMs: progress >= 1 ? s.elapsedMs : null };
}

export function squashBug(s: TappingState, id: number): TappingState {
  if (isTappingFinished(s) || s.squashed.includes(id) || s.missed.includes(id)) return s;
  if (!visibleBugs(s).some((b) => b.id === id)) return s;
  return { ...s, squashed: [...s.squashed, id] };
}

/** Bichos que están en pantalla ahora (ya aparecieron, siguen vivos y no se aplastaron). */
export function visibleBugs(s: TappingState): TappingBug[] {
  return s.bugs.filter(
    (b) =>
      s.elapsedMs >= b.spawnMs &&
      s.elapsedMs < b.spawnMs + BUG_LIFETIME_MS &&
      !s.squashed.includes(b.id) &&
      !s.missed.includes(b.id)
  );
}

export function advance(s: TappingState, dtMs: number): TappingState {
  if (isTappingFinished(s)) return s;
  const elapsedMs = Math.min(TAPPING_DURATION_MS, s.elapsedMs + dtMs);
  let progress = Math.max(0, s.progress - (DECAY_PER_S * dtMs) / 1000);
  const missed = [...s.missed];
  for (const b of s.bugs) {
    const expired = elapsedMs >= b.spawnMs + BUG_LIFETIME_MS;
    if (expired && !s.squashed.includes(b.id) && !missed.includes(b.id)) {
      missed.push(b.id);
      progress = Math.max(0, progress - BUG_PENALTY);
    }
  }
  return { ...s, elapsedMs, progress, missed };
}

export function tappingPerformance(s: TappingState): Performance {
  if (s.filledAtMs === null) return 'poor';
  return TAPPING_DURATION_MS - s.filledAtMs >= PERFECT_SPARE_MS ? 'perfect' : 'good';
}
