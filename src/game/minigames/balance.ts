import type { Performance } from '../../types/game';
import { createRng } from '../rng';

export const BALANCE_DURATION_MS = 6000;

export interface BalanceParams {
  /** Ancho del rango aceptable, de 0 a 1. */
  width: number;
  phases: { a: number; b: number; push1: number; push2: number };
}

export interface BalanceState {
  pos: number;
  vel: number;
}

const WIDTH_MIN = 0.24;
const WIDTH_MAX = 0.36;
const ASSISTED_WIDTH_FACTOR = 1.35;
const INPUT_FORCE = 3.2;
const PRESSURE = 2.6;
const DAMPING = 3.5;
/** Un toque corto mueve poco: la fuerza arranca en este tramo y llega al máximo tras RAMP_MS de mantener. */
const RAMP_START = 0.2;
const RAMP_MS = 600;

/**
 * Parámetros de la negociación. Con poca Reputación el rango aceptable es más angosto:
 * la contraparte tiene más poder y hay menos margen para equivocarse.
 */
export function buildBalance(seed: number, reputation: number, assisted = false): BalanceParams {
  const rng = createRng(seed);
  const rep = Math.max(0, Math.min(100, reputation)) / 100;
  const width = (WIDTH_MIN + (WIDTH_MAX - WIDTH_MIN) * rep) * (assisted ? ASSISTED_WIDTH_FACTOR : 1);
  const tau = Math.PI * 2;
  return {
    width,
    phases: {
      a: rng.nextFloat(0, tau),
      b: rng.nextFloat(0, tau),
      push1: rng.nextFloat(0, tau),
      push2: rng.nextFloat(0, tau),
    },
  };
}

/** Centro del rango aceptable en el tiempo: suma de dos senos (más barato que ruido Perlin y sin dependencias). */
export function targetCenter(p: BalanceParams, tMs: number): number {
  const t = tMs / 1000;
  const raw = 0.5 + 0.2 * Math.sin((Math.PI * 2 * t) / 4.3 + p.phases.a) + 0.1 * Math.sin((Math.PI * 2 * t) / 2.1 + p.phases.b);
  return Math.max(p.width / 2, Math.min(1 - p.width / 2, raw));
}

/** Empuje de la contraparte (-1..1): la deriva del cursor cuando no hacés nada. */
export function pressure(p: BalanceParams, tMs: number): number {
  const t = tMs / 1000;
  return (Math.sin((Math.PI * 2 * t) / 2.6 + p.phases.push1) + 0.6 * Math.sin((Math.PI * 2 * t) / 1.3 + p.phases.push2)) / 1.6;
}

/**
 * Fuerza de un botón según cuánto tiempo lleva apretado (0 a 1): un toque corto empuja suave
 * y mantenerlo va ganando fuerza, así el movimiento depende de cuánto lo sostenés.
 */
export const holdInput = (heldMs: number): number =>
  heldMs <= 0 ? 0 : Math.min(1, RAMP_START + (1 - RAMP_START) * (heldMs / RAMP_MS));

/** Un paso de física: input va de -1 (izquierda) a 1 (derecha). El cursor rebota suave en los bordes. */
export function stepBalance(s: BalanceState, input: number, tMs: number, dtMs: number, p: BalanceParams): BalanceState {
  const dt = dtMs / 1000;
  const u = Math.max(-1, Math.min(1, input));
  const acc = PRESSURE * pressure(p, tMs) + INPUT_FORCE * u - DAMPING * s.vel;
  let vel = s.vel + acc * dt;
  let pos = s.pos + vel * dt;
  if (pos < 0) {
    pos = 0;
    vel = 0;
  } else if (pos > 1) {
    pos = 1;
    vel = 0;
  }
  return { pos, vel };
}

export const inZone = (pos: number, tMs: number, p: BalanceParams): boolean =>
  Math.abs(pos - targetCenter(p, tMs)) <= p.width / 2;

/** >= 72 % del tiempo dentro es perfecto; 58-72 %, bueno; menos, flojo. */
export function balancePerformance(fractionInZone: number): Performance {
  if (fractionInZone >= 0.72) return 'perfect';
  if (fractionInZone >= 0.58) return 'good';
  return 'poor';
}
