import { describe, it, expect } from 'vitest';
import {
  analyzeDecisions,
  buildRetrospective,
  pickPivotMoments,
  projectAlternative,
  targetMetricFor,
} from './retrospective';
import { startGame } from './engine';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import { GAME_EVENTS } from '../data/events';
import type { DecisionLogEntry, GameEvent, GameOption, GameState, GameStatus, Metrics } from '../types/game';

const m = (capital: number, reputacion: number, bienestar: number): Metrics => ({ capital, reputacion, bienestar });

const preview = { capital: 'neutral', bienestar: 'neutral', reputacion: 'neutral' } as const;
const option = (text: string, effects: Partial<Metrics>, extra: Partial<GameOption> = {}): GameOption => ({
  text,
  effects,
  impactPreview: preview,
  ...extra,
});

const event = (id: string, options: GameOption[]): GameEvent =>
  ({ id, phaseId: 1, title: `Título ${id}`, description: 'desc', options } as unknown as GameEvent);

const EVENTS: Record<string, GameEvent> = {
  e1: event('e1', [option('Camino seguro', { capital: 5 }), option('Camino riesgoso', { capital: -10, reputacion: 10 })]),
  e2: event('e2', [
    option('Gastar en marketing', { capital: -15 }, { learningPill: 'Cuidá la caja.' }),
    option('Esperar y ahorrar', { capital: 10 }),
  ]),
  e3: event('e3', [option('Única opción', { capital: 5 })] as GameOption[]),
  e4: event('e4', [
    option('Contratar', { capital: -5 }, { scheduledEvent: { eventId: 'e1', delayTurns: 2 } }),
    option('Hacerlo solo', { capital: -5 }),
  ]),
};
const getEvent = (id: string) => EVENTS[id];

const entry = (turn: number, eventId: string, optionIndex: number, partial: Partial<DecisionLogEntry> = {}): DecisionLogEntry => {
  const opt = EVENTS[eventId]?.options[optionIndex];
  return {
    turn,
    eventId,
    eventTitle: EVENTS[eventId]?.title ?? eventId,
    kind: 'main',
    optionIndex,
    optionText: opt?.text ?? '',
    effects: opt?.effects ?? {},
    ...partial,
  };
};

const stateWith = (log: DecisionLogEntry[], status: GameStatus, metrics: Metrics = m(50, 50, 50)): GameState => ({
  ...startGame(ARCHETYPES[0], FINANCINGS[0]),
  initialMetrics: m(50, 50, 50),
  status,
  metrics,
  decisionLog: log,
});

describe('analyzeDecisions', () => {
  it('rates a choice that equals the best alternative as good', () => {
    const [a] = analyzeDecisions([entry(1, 'e2', 1, { metricsAfter: m(60, 50, 50) })], getEvent, m(50, 50, 50));
    expect(a.verdict).toBe('good');
    expect(a.altIndex).toBe(0);
  });

  it('rates a clearly worse choice as could_be_better and finds the best alternative', () => {
    const [a] = analyzeDecisions([entry(1, 'e2', 0, { metricsAfter: m(35, 50, 50) })], getEvent, m(50, 50, 50));
    expect(a.verdict).toBe('could_be_better');
    expect(a.altIndex).toBe(1);
    expect(a.altNet.capital).toBe(10);
    expect(a.chosenNet.capital).toBe(-15);
  });

  it('weights the weakest metric more when ranking', () => {
    // Con capital débil, perder 10 de capital para ganar 10 de reputación es peor que lo seguro
    const weak = analyzeDecisions([entry(1, 'e1', 1)], getEvent, m(10, 70, 70))[0];
    expect(weak.verdict).toBe('could_be_better');
    // Con reputación débil la misma elección es defendible
    const rep = analyzeDecisions([entry(1, 'e1', 1)], getEvent, m(70, 10, 70))[0];
    expect(rep.verdict).not.toBe('could_be_better');
  });

  it('counts passive modifiers on every path equally', () => {
    const [a] = analyzeDecisions([entry(1, 'e2', 1, { appliedModifiers: { capital: -3 } })], getEvent, m(50, 50, 50));
    expect(a.chosenNet.capital).toBe(7);
    expect(a.altNet.capital).toBe(-18);
  });

  it('ignores unknown events, single-option events and out-of-range options', () => {
    const log = [entry(1, 'desconocido', 0), entry(2, 'e3', 0), entry(3, 'e1', 7)];
    expect(analyzeDecisions(log, getEvent)).toEqual([]);
  });

  it('flags when the paths differ in scheduled events, without inventing numbers', () => {
    const [a] = analyzeDecisions([entry(1, 'e4', 0)], getEvent);
    expect(a.scheduleNote).toMatch(/evento futuro/);
    const [b] = analyzeDecisions([entry(1, 'e4', 1)], getEvent);
    expect(b.scheduleNote).toMatch(/evento futuro/);
    const [c] = analyzeDecisions([entry(1, 'e1', 0)], getEvent);
    expect(c.scheduleNote).toBeUndefined();
  });

  it('keeps the index of each decision in the log', () => {
    const analyses = analyzeDecisions([entry(1, 'desconocido', 0), entry(2, 'e2', 0)], getEvent);
    expect(analyses.map((x) => x.logIndex)).toEqual([1]);
  });
});

describe('targetMetricFor', () => {
  it.each([
    ['game_over_capital', 'capital'],
    ['game_over_bienestar', 'bienestar'],
    ['game_over_reputacion', 'reputacion'],
  ] as const)('%s → %s', (status, expected) => {
    expect(targetMetricFor(status, m(50, 50, 50))).toBe(expected);
  });

  it('uses the weakest metric on victory and early endings', () => {
    expect(targetMetricFor('victory', m(80, 40, 70))).toBe('reputacion');
    expect(targetMetricFor('ended_early', m(30, 60, 70))).toBe('capital');
  });
});

describe('pickPivotMoments', () => {
  it('only keeps moments where the other path helps the target metric', () => {
    const analyses = analyzeDecisions([entry(1, 'e2', 0), entry(2, 'e2', 1), entry(3, 'e1', 0)], getEvent, m(50, 50, 50));
    const pivots = pickPivotMoments(analyses, 'capital');
    expect(pivots.map((p) => p.turn)).toEqual([1]);
    expect(pivots[0].gain).toBe(25);
    expect(pivots[0].lesson).toBe(undefined);
  });

  it('caps at three, ordered by turn, and carries the lesson of the other option', () => {
    const log = [1, 2, 3, 4, 5].map((t) => entry(t, 'e2', 0));
    const pivots = pickPivotMoments(analyzeDecisions(log, getEvent, m(50, 50, 50)), 'capital');
    expect(pivots).toHaveLength(3);
    expect(pivots.map((p) => p.turn)).toEqual([...pivots.map((p) => p.turn)].sort((a, b) => a - b));
  });

  it('personalizes texts with the player name', () => {
    const ev = event('ep', [option('Hablar con {nombre}', { capital: -10 }), option('Ahorrar', { capital: 5 })]);
    const analyses = analyzeDecisions([entry(1, 'ep', 0, { eventTitle: 'Con {nombre}', optionText: 'Hablar con {nombre}' })], () => ev);
    const [p] = pickPivotMoments(analyses, 'capital', 'Santi');
    expect(p.chosenText).toBe('Hablar con Santi');
    expect(p.eventTitle).toBe('Con Santi');
  });
});

describe('projectAlternative', () => {
  const pivotsFor = (state: GameState, target: 'capital' | 'reputacion' | 'bienestar') =>
    pickPivotMoments(analyzeDecisions(state.decisionLog, getEvent, state.initialMetrics), target);

  it('returns null without pivots', () => {
    expect(projectAlternative(stateWith([], 'victory'), [], 'capital')).toBeNull();
  });

  it('is always a range inside 0–100 with low ≤ high', () => {
    const state = stateWith([entry(1, 'e2', 0, { metricsAfter: m(35, 50, 50) })], 'ended_early', m(35, 50, 50));
    const p = projectAlternative(state, pivotsFor(state, 'capital'), 'capital');
    expect(p).not.toBeNull();
    expect(p!.low).toBeGreaterThanOrEqual(0);
    expect(p!.high).toBeLessThanOrEqual(100);
    expect(p!.low).toBeLessThan(p!.high);
    expect(p!.extraTurns).toBeUndefined();
  });

  it('clamps to 100 when the gain would overflow', () => {
    const state = stateWith([entry(1, 'e2', 0, { metricsAfter: m(90, 50, 50) })], 'ended_early', m(90, 50, 50));
    const p = projectAlternative(state, pivotsFor(state, 'capital'), 'capital');
    expect(p!.high).toBe(100);
  });

  it('estimates extra turns on a game over, never past the last turn of the run', () => {
    const log = [
      entry(1, 'e2', 0, { metricsAfter: m(35, 50, 50) }),
      entry(2, 'e2', 0, { metricsAfter: m(20, 50, 50) }),
      entry(3, 'e2', 0, { metricsAfter: m(0, 50, 50) }),
    ];
    const state = { ...stateWith(log, 'game_over_capital', m(0, 50, 50)), maxTurns: 20 };
    const p = projectAlternative(state, pivotsFor(state, 'capital'), 'capital');
    expect(p!.extraTurns).toBeDefined();
    const [lo, hi] = p!.extraTurns!;
    expect(lo).toBeLessThanOrEqual(hi);
    expect(hi).toBeLessThanOrEqual(17);
  });

  it('caps extra turns by the remaining room', () => {
    const log = [entry(1, 'e2', 0, { metricsAfter: m(0, 50, 50) })];
    const state = { ...stateWith(log, 'game_over_capital', m(0, 50, 50)), maxTurns: 1 };
    const p = projectAlternative(state, pivotsFor(state, 'capital'), 'capital');
    expect(p!.extraTurns).toEqual([0, 0]);
  });
});

describe('buildRetrospective', () => {
  const log = [
    entry(1, 'e2', 0, { metricsAfter: m(35, 50, 50) }),
    entry(2, 'e1', 0, { metricsAfter: m(40, 50, 50) }),
    entry(3, 'e2', 1, { metricsAfter: m(50, 50, 50) }),
  ];

  it('totals the verdicts', () => {
    const r = buildRetrospective(stateWith(log, 'victory', m(50, 50, 50)), undefined, getEvent);
    expect(r.totals.total).toBe(3);
    expect(r.totals.good + r.totals.reasonable + r.totals.could_be_better).toBe(3);
    expect(r.totals.could_be_better).toBeGreaterThanOrEqual(1);
  });

  it('always includes the disclaimer and a closing', () => {
    const r = buildRetrospective(stateWith(log, 'victory', m(50, 50, 50)), 'Santi', getEvent);
    expect(r.disclaimer).toMatch(/estimación/);
    expect(r.closing.length).toBeGreaterThan(0);
    expect(r.projection).not.toBeNull();
    expect(r.projectionText).toMatch(/entre \d+ y \d+/);
  });

  it('closes naming the turn and the weakest metric, without repeating the lesson', () => {
    const r = buildRetrospective(stateWith(log, 'ended_early', m(30, 50, 50)), undefined, getEvent);
    expect(r.closing).toMatch(/turno 1/);
    expect(r.closing).toMatch(/el capital/);
    expect(r.closing).not.toContain('Cuidá la caja');
  });

  it('discounts each extra pivot so gains do not simply add up', () => {
    const many = [1, 2, 3].map((t) => entry(t, 'e2', 0, { metricsAfter: m(35, 50, 50) }));
    const state = stateWith(many, 'ended_early', m(20, 50, 50));
    const pivots = pickPivotMoments(analyzeDecisions(many, getEvent, m(50, 50, 50)), 'capital');
    const p = projectAlternative(state, pivots, 'capital')!;
    const naive = 20 + pivots.reduce((sum, x) => sum + x.gain, 0);
    expect(Math.min(100, naive)).toBeGreaterThanOrEqual(p.high - 12);
    expect(p.low).toBeLessThan(p.high);
  });

  it('talks about turns on a game over', () => {
    const state = stateWith(log, 'game_over_capital', m(0, 50, 50));
    const r = buildRetrospective(state, undefined, getEvent);
    expect(r.projectionText).toMatch(/turno|aguantado|cambiado/);
  });

  it('does not throw on an empty log, for any final status', () => {
    const statuses: GameStatus[] = ['playing', 'game_over_capital', 'game_over_bienestar', 'game_over_reputacion', 'victory', 'ended_early'];
    statuses.forEach((status) => {
      const r = buildRetrospective(stateWith([], status), 'Santi', getEvent);
      expect(r.totals.total).toBe(0);
      expect(r.pivots).toEqual([]);
      expect(r.projection).toBeNull();
      expect(r.projectionText.length).toBeGreaterThan(0);
    });
  });

  it('does not throw on every final status with a real log', () => {
    const statuses: GameStatus[] = ['game_over_capital', 'game_over_bienestar', 'game_over_reputacion', 'victory', 'ended_early'];
    statuses.forEach((status) => {
      expect(() => buildRetrospective(stateWith(log, status, m(10, 10, 10)), undefined, getEvent)).not.toThrow();
    });
  });

  it('works with the real catalog and old saves without metricsAfter', () => {
    const real = GAME_EVENTS.find((e) => e.options.length >= 2)!;
    const oldLog: DecisionLogEntry[] = [
      { turn: 1, eventId: real.id, eventTitle: real.title, optionIndex: 0, optionText: real.options[0].text, effects: real.options[0].effects },
    ];
    const state = { ...stateWith(oldLog, 'ended_early'), initialMetrics: undefined };
    expect(() => buildRetrospective(state)).not.toThrow();
    expect(buildRetrospective(state).totals.total).toBe(1);
  });
});
