import type { DecisionLogEntry, GameEvent, GameOption, GameState, GameStatus, Metrics } from '../types/game';
import { getEventById } from '../data/events';
import { clamp } from './engine';
import { personalize } from '../lib/personalize';

export type Verdict = 'good' | 'reasonable' | 'could_be_better';
type MetricKey = keyof Metrics;
type Net = Record<MetricKey, number>;

const METRIC_KEYS: MetricKey[] = ['capital', 'reputacion', 'bienestar'];

export const METRIC_NAMES: Record<MetricKey, { name: string; to: string }> = {
  capital: { name: 'el capital', to: 'al capital' },
  reputacion: { name: 'la reputación', to: 'a la reputación' },
  bienestar: { name: 'el bienestar', to: 'al bienestar' },
};

export const VERDICT_LABELS: Record<Verdict, string> = {
  good: 'Buena jugada',
  reasonable: 'Razonable',
  could_be_better: 'Pudo ir mejor',
};

// Peso de cada métrica según qué tan débil estaba antes de decidir: la más débil pesa el doble.
const WEAKNESS_WEIGHTS = [2, 1.2, 1];
const GOOD_GAP = 2;
const REASONABLE_GAP = 8;
const MAX_PIVOTS = 3;
const MIN_PIVOT_GAIN = 3;
const BASE_MARGIN = 6;
const MARGIN_PER_PIVOT = 2;
const MAX_MARGIN = 12;
// Cada momento bisagra adicional pesa menos: los efectos se pisan y el clamp a 100 recorta ganancias acumuladas.
const PIVOT_DISCOUNTS = [1, 0.7, 0.5];

export interface DecisionAnalysis {
  /** Posición en el decisionLog (para relacionarla con el historial). */
  logIndex: number;
  entry: DecisionLogEntry;
  event: GameEvent;
  chosenIndex: number;
  /** La mejor alternativa no elegida según el puntaje ponderado. */
  altIndex: number;
  chosenNet: Net;
  altNet: Net;
  chosenScore: number;
  altScore: number;
  verdict: Verdict;
  /** Métrica más débil antes de decidir. */
  weakest: MetricKey;
  /** Nota cuando los caminos difieren en eventos programados (sin proyectar números). */
  scheduleNote?: string;
}

export interface PivotMoment {
  analysis: DecisionAnalysis;
  turn: number;
  eventTitle: string;
  chosenText: string;
  altText: string;
  chosenNet: Net;
  altNet: Net;
  /** Mejora de la alternativa en la métrica objetivo (la que decidió el final). */
  gain: number;
  lesson?: string;
  scheduleNote?: string;
}

export interface Projection {
  targetMetric: MetricKey;
  /** Valor real de la métrica objetivo al final. */
  actual: number;
  /** Rango estimado con las otras decisiones (siempre un rango, nunca una cifra exacta). */
  low: number;
  high: number;
  /** Solo en finales por derrota: turnos extra estimados [mín, máx]. */
  extraTurns?: [number, number];
}

export interface Retrospective {
  status: GameStatus;
  totals: Record<Verdict, number> & { total: number };
  analyses: DecisionAnalysis[];
  pivots: PivotMoment[];
  projection: Projection | null;
  projectionText: string;
  closing: string;
  disclaimer: string;
}

const DISCLAIMER = 'Es una estimación: los dilemas reales tienen más variables que las que se pueden medir acá.';

const netOf = (effects: Partial<Metrics> | undefined, modifiers: Partial<Metrics> | undefined): Net => ({
  capital: (effects?.capital ?? 0) + (modifiers?.capital ?? 0),
  reputacion: (effects?.reputacion ?? 0) + (modifiers?.reputacion ?? 0),
  bienestar: (effects?.bienestar ?? 0) + (modifiers?.bienestar ?? 0),
});

const weakestOrder = (m: Metrics): MetricKey[] => [...METRIC_KEYS].sort((a, b) => m[a] - m[b]);

const weightsFor = (before: Metrics | undefined): Record<MetricKey, number> => {
  if (!before) return { capital: 1, reputacion: 1, bienestar: 1 };
  const order = weakestOrder(before);
  return { [order[0]]: WEAKNESS_WEIGHTS[0], [order[1]]: WEAKNESS_WEIGHTS[1], [order[2]]: WEAKNESS_WEIGHTS[2] } as Record<MetricKey, number>;
};

const score = (net: Net, weights: Record<MetricKey, number>): number =>
  METRIC_KEYS.reduce((sum, k) => sum + net[k] * weights[k], 0);

const scheduleNoteFor = (chosen: GameOption, alt: GameOption): string | undefined => {
  const a = chosen.scheduledEvent?.eventId;
  const b = alt.scheduledEvent?.eventId;
  if (a === b) return undefined;
  if (a && !b) return 'Esta decisión dejó programado un evento futuro que el otro camino habría evitado.';
  if (!a && b) return 'El otro camino habría activado un evento futuro que en tu partida no ocurrió.';
  return 'Cada camino habría activado un evento futuro distinto.';
};

/**
 * Compara cada decisión con sus alternativas y le asigna un veredicto cualitativo.
 * Ignora con gracia eventos que ya no existen en el catálogo o que tienen una sola opción.
 */
export function analyzeDecisions(
  log: DecisionLogEntry[],
  getEvent: (id: string) => GameEvent | undefined = getEventById,
  initialMetrics?: Metrics
): DecisionAnalysis[] {
  const analyses: DecisionAnalysis[] = [];

  log.forEach((entry, logIndex) => {
    const event = getEvent(entry.eventId);
    if (!event || event.options.length < 2 || !event.options[entry.optionIndex]) return;

    const before = logIndex > 0 ? log[logIndex - 1].metricsAfter : initialMetrics;
    const weights = weightsFor(before);
    const chosen = event.options[entry.optionIndex];
    const chosenNet = netOf(entry.effects, entry.appliedModifiers);
    const chosenScore = score(chosenNet, weights);

    // Las alternativas heredan los modificadores pasivos de la decisión real (no se simulan tags)
    let altIndex = -1;
    let altScore = -Infinity;
    event.options.forEach((option, i) => {
      if (i === entry.optionIndex) return;
      const s = score(netOf(option.effects, entry.appliedModifiers), weights);
      if (s > altScore) {
        altScore = s;
        altIndex = i;
      }
    });
    const alt = event.options[altIndex];

    const gap = altScore - chosenScore;
    const verdict: Verdict = gap <= GOOD_GAP ? 'good' : gap <= REASONABLE_GAP ? 'reasonable' : 'could_be_better';

    analyses.push({
      logIndex,
      entry,
      event,
      chosenIndex: entry.optionIndex,
      altIndex,
      chosenNet,
      altNet: netOf(alt.effects, entry.appliedModifiers),
      chosenScore,
      altScore,
      verdict,
      weakest: before ? weakestOrder(before)[0] : 'capital',
      scheduleNote: scheduleNoteFor(chosen, alt),
    });
  });

  return analyses;
}

/** Métrica que decidió el final: la que llegó a 0, o la más débil en una victoria / fin anticipado. */
export function targetMetricFor(status: GameStatus, finalMetrics: Metrics): MetricKey {
  if (status === 'game_over_capital') return 'capital';
  if (status === 'game_over_bienestar') return 'bienestar';
  if (status === 'game_over_reputacion') return 'reputacion';
  return weakestOrder(finalMetrics)[0];
}

/**
 * Los 2-3 momentos donde el otro camino habría ayudado más a la métrica objetivo.
 * Solo cuenta si la alternativa mejora esa métrica de forma apreciable.
 */
export function pickPivotMoments(analyses: DecisionAnalysis[], target: MetricKey, name?: string): PivotMoment[] {
  return analyses
    .map((analysis) => ({ analysis, gain: analysis.altNet[target] - analysis.chosenNet[target] }))
    .filter(({ gain }) => gain >= MIN_PIVOT_GAIN)
    .sort((a, b) => b.gain - a.gain || b.analysis.altScore - b.analysis.chosenScore - (a.analysis.altScore - a.analysis.chosenScore))
    .slice(0, MAX_PIVOTS)
    .sort((a, b) => a.analysis.entry.turn - b.analysis.entry.turn)
    .map(({ analysis, gain }) => {
      const { event, entry } = analysis;
      const alt = event.options[analysis.altIndex];
      return {
        analysis,
        turn: entry.turn,
        eventTitle: personalize(entry.eventTitle, name),
        chosenText: personalize(entry.optionText, name),
        altText: personalize(alt.text, name),
        chosenNet: analysis.chosenNet,
        altNet: analysis.altNet,
        gain,
        lesson: alt.learningPill ? personalize(alt.learningPill, name) : undefined,
        scheduleNote: analysis.scheduleNote,
      };
    });
}

/**
 * Proyección del final con las alternativas de los momentos bisagra:
 * final − efecto elegido + efecto alternativo, con clamp, sin simular tags ni eventos posteriores.
 * Siempre devuelve un rango. En derrotas estima además cuántos turnos extra se habría aguantado.
 */
export function projectAlternative(
  state: GameState,
  pivots: PivotMoment[],
  target: MetricKey
): Projection | null {
  if (pivots.length === 0) return null;

  const actual = state.metrics[target];
  const totalGain = [...pivots]
    .sort((a, b) => b.gain - a.gain)
    .reduce((sum, p, i) => sum + p.gain * (PIVOT_DISCOUNTS[i] ?? PIVOT_DISCOUNTS[PIVOT_DISCOUNTS.length - 1]), 0);
  const estimate = clamp(actual + totalGain);
  const margin = Math.min(MAX_MARGIN, BASE_MARGIN + MARGIN_PER_PIVOT * pivots.length);
  const projection: Projection = {
    targetMetric: target,
    actual,
    low: clamp(estimate - margin),
    high: clamp(estimate + margin),
  };

  if (state.status.startsWith('game_over')) {
    const log = state.decisionLog;
    const first = pivots[0].analysis.logIndex;
    const before = first > 0 ? log[first - 1].metricsAfter?.[target] : state.initialMetrics?.[target];
    const turnsSince = log.length - first;
    if (before !== undefined && turnsSince > 0) {
      // Ritmo promedio de caída desde el primer momento bisagra hasta el final
      const dropPerTurn = Math.max(1, (before - actual) / turnsSince);
      const gained = totalGain / dropPerTurn;
      const lastTurn = log[log.length - 1].turn;
      const room = Math.max(0, state.maxTurns - lastTurn);
      const lo = Math.min(room, Math.max(0, Math.floor(gained) - 1));
      const hi = Math.min(room, Math.max(lo, Math.ceil(gained) + 1));
      projection.extraTurns = [lo, hi];
    }
  }

  return projection;
}

const rangeText = (low: number, high: number) => (low === high ? `${low}` : `${low} y ${high}`);

const describeProjection = (state: GameState, projection: Projection | null, target: MetricKey): string => {
  if (!projection) {
    return 'No encontré un momento puntual donde otro camino hubiera cambiado tu final: fue la suma de varias decisiones, no una sola.';
  }
  const name = METRIC_NAMES[target].name;
  const lastTurn = state.decisionLog[state.decisionLog.length - 1]?.turn ?? state.currentTurn;

  if (state.status.startsWith('game_over') && projection.extraTurns) {
    const [lo, hi] = projection.extraTurns;
    if (hi <= 0) {
      return `Con esos otros caminos ${name} habría aguantado un poco más, aunque probablemente el final no habría cambiado.`;
    }
    const from = lastTurn + lo;
    const to = lastTurn + hi;
    return `Con esos otros caminos, probablemente habrías llegado al año ${from === to ? from : `${from} o ${to}`} en lugar de caer en el ${lastTurn}.`;
  }

  return `Con esos otros caminos, ${name} habría terminado probablemente entre ${rangeText(projection.low, projection.high)} en lugar de ${projection.actual}.`;
};

const describeClosing = (pivots: PivotMoment[], target: MetricKey): string => {
  if (pivots.length === 0) {
    return 'Mirá tu historial: las decisiones que más te costaron suelen enseñar más que las que salieron bien.';
  }
  const top = [...pivots].sort((a, b) => b.gain - a.gain)[0];
  const alt = top.altText.replace(/[.!¡]+$/, '');
  return `Si en el año ${top.turn} hubieras elegido «${alt}», habrías cuidado mejor ${METRIC_NAMES[target].name}.`;
};

/**
 * Retrospectiva "¿y si…?" de una partida (en curso o terminada). Función pura: sin React ni azar.
 * Funciona con logs vacíos o cortos, eventos que ya no existen y cualquier estado final.
 */
export function buildRetrospective(
  state: GameState,
  playerName?: string,
  getEvent: (id: string) => GameEvent | undefined = getEventById
): Retrospective {
  const analyses = analyzeDecisions(state.decisionLog, getEvent, state.initialMetrics);
  const target = targetMetricFor(state.status, state.metrics);
  const pivots = pickPivotMoments(analyses, target, playerName);
  const projection = projectAlternative(state, pivots, target);

  const totals = { good: 0, reasonable: 0, could_be_better: 0, total: analyses.length };
  analyses.forEach((a) => {
    totals[a.verdict] += 1;
  });

  return {
    status: state.status,
    totals,
    analyses,
    pivots,
    projection,
    projectionText: describeProjection(state, projection, target),
    closing: describeClosing(pivots, target),
    disclaimer: DISCLAIMER,
  };
}
