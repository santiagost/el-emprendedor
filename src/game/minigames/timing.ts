import type { Performance } from '../../types/game';
import { createRng } from '../rng';

export type TimingHit = 'core' | 'zone' | 'miss';

export interface TimingRound {
  label: string;
  /** Ciclos completos (ida y vuelta) por segundo. */
  speed: number;
  /** Centro de la zona verde, de 0 a 1. */
  center: number;
  zoneWidth: number;
  coreWidth: number;
}

/** Las tres rondas del pitch: cada una es un momento distinto de la conversación. */
export const TIMING_ROUND_LABELS = ['Gancho', 'Números', 'Cierre'] as const;

const BASE_SPEED = 1 / 1.2; // 1,2 s por ciclo
const SPEED_STEP = 1.18; // acelera por ronda
const ZONE_BY_DIFFICULTY = { 1: 0.24, 2: 0.2, 3: 0.16 } as const;
const CORE_RATIO = 0.3; // el núcleo "perfecto" es ~6 % del ancho con la zona estándar
const ASSISTED_ZONE_FACTOR = 1.5;
const EDGE_MARGIN = 0.06;

/** Posición de la aguja (0..1) con onda triangular: va y vuelve sin saltos. */
export function needlePosition(elapsedMs: number, speed: number): number {
  const phase = ((elapsedMs / 1000) * speed) % 1;
  return 1 - Math.abs(2 * phase - 1);
}

export function classifyHit(position: number, round: Pick<TimingRound, 'center' | 'zoneWidth' | 'coreWidth'>): TimingHit {
  const distance = Math.abs(position - round.center);
  if (distance <= round.coreWidth / 2) return 'core';
  if (distance <= round.zoneWidth / 2) return 'zone';
  return 'miss';
}

/** Parámetros de las 3 rondas: salen del RNG con semilla, así una misma decisión se reproduce igual. */
export function buildTimingRounds(seed: number, difficulty: 1 | 2 | 3 = 2, assisted = false): TimingRound[] {
  const rng = createRng(seed);
  const zoneWidth = Math.min(0.5, ZONE_BY_DIFFICULTY[difficulty] * (assisted ? ASSISTED_ZONE_FACTOR : 1));
  const coreWidth = zoneWidth * CORE_RATIO;
  return TIMING_ROUND_LABELS.map((label, i) => ({
    label,
    speed: BASE_SPEED * SPEED_STEP ** i,
    center: rng.nextFloat(zoneWidth / 2 + EDGE_MARGIN, 1 - zoneWidth / 2 - EDGE_MARGIN),
    zoneWidth,
    coreWidth,
  }));
}

const HIT_POINTS: Record<TimingHit, number> = { core: 2, zone: 1, miss: 0 };

/**
 * Promedia las rondas: puntos 2 / 1 / 0 por núcleo / zona / fuera.
 * Perfecto exige casi todo en el núcleo (>= 5 de 6); bueno, al menos dos rondas en zona (>= 2); si no, flojo.
 */
export function performanceFromHits(hits: readonly TimingHit[]): Performance {
  if (hits.length === 0) return 'good';
  const max = hits.length * 2;
  const total = hits.reduce((sum, h) => sum + HIT_POINTS[h], 0);
  if (total >= max - 1) return 'perfect';
  if (total >= hits.length - 1) return 'good';
  return 'poor';
}
