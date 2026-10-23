import type { Performance } from '../../types/game';
import { TAGS, type Tag } from '../../data/tags';
import { createRng } from '../rng';

export type RouletteOutcome = 'success' | 'minor' | 'critical';

export interface RouletteSegments {
  success: number;
  minor: number;
  critical: number;
}

export interface SegmentReason {
  label: string;
  /** Cambio en la probabilidad de éxito (en puntos de 0 a 1): positivo ayuda, negativo perjudica. */
  delta: number;
}

/** Lo que hiciste antes agranda el verde: producto cuidado, procesos y equipo alineado. */
export const LAUNCH_TAILWINDS: readonly Tag[] = ['calidad_producto', 'procesos_solidos', 'obsesion_calidad', 'socio_alineado'];
/** Lo que arrastrás agranda el rojo: deuda, equipo quemado, dependencias y conflictos. */
export const LAUNCH_HEADWINDS: readonly Tag[] = ['deuda_riesgosa', 'equipo_sobrecargado', 'proveedor_dependiente', 'socio_conflictivo'];

const BASE: RouletteSegments = { success: 0.5, minor: 0.3, critical: 0.2 };
const TAG_WEIGHT = 0.05;
const MIN_SEGMENT = 0.05;
const MAX_NUDGE_DEG = 10;

const round3 = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Tamaño de cada segmento a partir de los tags activos y del sesgo de riesgo de la opción
 * (positivo = más riesgo, negativo = más seguro). Siempre suma 1 y ningún segmento baja de 5 %.
 * `reasons` explica qué tags movieron las probabilidades, para mostrarlo en pantalla.
 */
export function computeSegments(
  activeTags: readonly Tag[],
  riskBias = 0
): { segments: RouletteSegments; reasons: SegmentReason[] } {
  const reasons: SegmentReason[] = [];
  let shift = -riskBias; // cuánto pasa de crítico a éxito (negativo: al revés)
  for (const tag of activeTags) {
    if (LAUNCH_TAILWINDS.includes(tag)) {
      shift += TAG_WEIGHT;
      reasons.push({ label: TAGS[tag].label, delta: TAG_WEIGHT });
    } else if (LAUNCH_HEADWINDS.includes(tag)) {
      shift -= TAG_WEIGHT;
      reasons.push({ label: TAGS[tag].label, delta: -TAG_WEIGHT });
    }
  }

  // El éxito gana lo que pierde el crítico y viceversa; el "bug leve" queda como amortiguador
  const minor = BASE.minor;
  const success = Math.max(MIN_SEGMENT, Math.min(1 - minor - MIN_SEGMENT, BASE.success + shift));

  const s = round3(success);
  const m = round3(minor);
  return { segments: { success: s, minor: m, critical: round3(1 - s - m) }, reasons };
}

/** Orden de los segmentos en la ruleta, en sentido horario desde arriba. */
export const SEGMENT_ORDER: readonly RouletteOutcome[] = ['success', 'minor', 'critical'];

/** Ángulos [desde, hasta) de cada segmento, en grados horarios desde arriba. */
export function segmentArcs(segments: RouletteSegments): Record<RouletteOutcome, [number, number]> {
  let from = 0;
  const arcs = {} as Record<RouletteOutcome, [number, number]>;
  for (const key of SEGMENT_ORDER) {
    const to = from + segments[key] * 360;
    arcs[key] = [from, to];
    from = to;
  }
  return arcs;
}

export function outcomeAt(wheelAngle: number, segments: RouletteSegments): RouletteOutcome {
  const a = ((wheelAngle % 360) + 360) % 360;
  const arcs = segmentArcs(segments);
  for (const key of SEGMENT_ORDER) {
    if (a >= arcs[key][0] && a < arcs[key][1]) return key;
  }
  return 'critical';
}

/**
 * Empujón del jugador según el momento en que frena: oscila entre -10° y +10°.
 * El jugador tiene algo de agencia sin que la ruleta sea pura habilidad.
 */
export function nudgeFromTap(tapMs: number | null): number {
  if (tapMs === null) return 0;
  return MAX_NUDGE_DEG * Math.sin((tapMs / 1000) * ((Math.PI * 2) / 0.9));
}

export interface SpinPlan {
  /** Ángulo de la ruleta que queda bajo el puntero antes del empujón. */
  baseAngle: number;
  /** Vueltas completas que da antes de frenar. */
  turns: number;
}

/** Plan del giro: sale del RNG con semilla, así una misma decisión se reproduce igual. */
export function planSpin(seed: number): SpinPlan {
  const rng = createRng(seed);
  return { baseAngle: rng.nextFloat(0, 360), turns: rng.nextInt(4, 6) };
}

/** Resultado final: el ángulo bajo el puntero se decide antes y el desenlace se lee del ángulo (nunca al revés). */
export function resolveSpin(plan: SpinPlan, segments: RouletteSegments, nudgeDeg: number): { wheelAngle: number; outcome: RouletteOutcome } {
  const wheelAngle = (((plan.baseAngle + nudgeDeg) % 360) + 360) % 360;
  return { wheelAngle, outcome: outcomeAt(wheelAngle, segments) };
}

export const performanceFromOutcome = (outcome: RouletteOutcome): Performance =>
  outcome === 'success' ? 'perfect' : outcome === 'minor' ? 'good' : 'poor';
