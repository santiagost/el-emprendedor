import { describe, it, expect } from 'vitest';
import { buildPhaseRecap, buildJourney, classifyTrend, HEADLINES, OUTLOOKS } from './recap';
import { startGame, applyDecision } from './engine';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import { MAIN_EVENTS } from '../data/events';
import { createRng } from './rng';
import type { DecisionLogEntry, GameState, Metrics } from '../types/game';

const m = (capital: number, reputacion: number, bienestar: number): Metrics => ({ capital, reputacion, bienestar });

const entry = (turn: number, partial: Partial<DecisionLogEntry> = {}): DecisionLogEntry => ({
  turn,
  eventId: `f1_evento_${turn}`,
  eventTitle: `Evento ${turn}`,
  kind: 'main',
  optionIndex: 0,
  optionText: `Opción del turno ${turn}.`,
  effects: {},
  ...partial,
});

const baseState = (log: DecisionLogEntry[], metrics: Metrics = m(50, 50, 50)): GameState => ({
  ...startGame(ARCHETYPES[0], FINANCINGS[0]),
  initialMetrics: m(50, 50, 50),
  metrics,
  decisionLog: log,
});

describe('classifyTrend', () => {
  it.each([
    [m(70, 70, 70), 'equilibrista'],
    [m(60, 60, 60), 'equilibrista'],
    [m(30, 20, 10), 'cuesta_arriba'],
    [m(75, 50, 20), 'quema_naves'],
    [m(75, 80, 20), 'quema_naves'],
    [m(20, 75, 50), 'querido_pero_justo'],
    [m(20, 50, 75), 'sostenible'],
    [m(50, 50, 50), 'rumbo_abierto'],
    [m(65, 50, 50), 'rumbo_abierto'],
  ])('%j → %s', (metrics, expected) => {
    expect(classifyTrend(metrics).id).toBe(expected);
  });
});

describe('text banks', () => {
  // El perfil se calcula con el nivel al cierre: un titular que habla de movimiento puede contradecir las curvas
  const MOVEMENT = /(?<!\p{L})(sube|subió|baja|bajó|cae|cayó|cayendo|crece|creció|crecés|mejoró|mejoraron|empeoró|ganaste|perdiste|se resintieron)(?!\p{L})/iu;
  it.each(Object.entries(HEADLINES))('headlines of %s talk about levels, not movement', (_, texts) => {
    texts.forEach((t) => expect(t).not.toMatch(MOVEMENT));
  });
  it.each(Object.entries(OUTLOOKS))('outlooks of %s do not assume a direction', (_, texts) => {
    texts.forEach((t) => expect(t).not.toMatch(MOVEMENT));
  });
});

describe('buildPhaseRecap', () => {
  const log: DecisionLogEntry[] = [
    entry(1, { effects: { capital: 5 }, metricsAfter: m(55, 50, 50) }),
    entry(2, { effects: { capital: 20, bienestar: -15 }, optionText: 'Aceptar el contrato grande aunque implique trabajar de noche todo el mes sin descanso alguno.', metricsAfter: m(75, 50, 35) }),
    entry(3, { kind: 'crisis', effects: { bienestar: -5 }, metricsAfter: m(75, 52, 30) }),
  ];

  it('classifies the phase by its closing metrics and builds a headline + 2-3 paragraphs', () => {
    const recap = buildPhaseRecap(baseState(log, m(75, 52, 30)), 1, 'Santi');
    expect(recap.trend.id).toBe('quema_naves');
    expect(recap.headline.length).toBeGreaterThan(0);
    expect(recap.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(recap.paragraphs.length).toBeLessThanOrEqual(3);
    expect(recap.partial).toBe(false);
  });

  it('computes the series and net deltas from the initial metrics', () => {
    const recap = buildPhaseRecap(baseState(log, m(75, 52, 30)), 1);
    expect(recap.series).toEqual([m(50, 50, 50), m(55, 50, 50), m(75, 50, 35), m(75, 52, 30)]);
    expect(recap.deltas).toEqual(m(25, 2, -20));
  });

  it('mentions numbers only for big moves and the most impactful decision, shortened', () => {
    const text = buildPhaseRecap(baseState(log, m(75, 52, 30)), 1).paragraphs.join(' ');
    expect(text).toContain('el capital subió 25 puntos');
    expect(text).toContain('la reputación casi no se movió');
    expect(text).toContain('el bienestar bajó 20 puntos');
    expect(text).toMatch(/«Aceptar el contrato grande[^»]*…»/);
    expect(text).toContain('(turno 2)');
    expect(text).toContain('1 crisis');
  });

  it('never returns empty text and leaves no braces, with and without a name', () => {
    for (const name of [undefined, 'Santi']) {
      const recap = buildPhaseRecap(baseState(log, m(75, 52, 30)), 1, name);
      for (const t of [recap.headline, ...recap.paragraphs]) {
        expect(t.trim().length).toBeGreaterThan(0);
        expect(t).not.toMatch(/[{}]/);
        expect(t).not.toMatch(/\s{2,}/);
      }
    }
  });

  it('uses the name in some variants and reads well in all of them', () => {
    const headlines = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const variantLog = [{ ...log[0], eventId: `f1_variante_${i}` }, log[1], log[2]];
      headlines.add(buildPhaseRecap(baseState(variantLog, m(75, 52, 30)), 1, 'Santi').headline);
    }
    expect(headlines.size).toBe(3);
    expect([...headlines].some((h) => h.includes('Santi'))).toBe(true);
    expect([...headlines].every((h) => !/[{}]/.test(h))).toBe(true);
  });

  it('is deterministic for the same state', () => {
    const state = baseState(log, m(75, 52, 30));
    expect(buildPhaseRecap(state, 1, 'Santi')).toEqual(buildPhaseRecap(state, 1, 'Santi'));
  });

  it('works for a phase without decisions', () => {
    const recap = buildPhaseRecap(baseState([]), 2);
    expect(recap.paragraphs[0].length).toBeGreaterThan(0);
    expect(recap.series).toBeNull();
    expect(recap.deltas).toBeNull();
    expect(recap.partial).toBe(true);
  });

  it('degrades to qualitative text when the save has no metricsAfter (old saves)', () => {
    const legacy = [entry(1, { effects: { capital: 5 } }), entry(2, { effects: { capital: 5 } }), entry(3, { effects: { capital: 5 } })];
    const recap = buildPhaseRecap(baseState(legacy, m(80, 50, 50)), 1);
    expect(recap.series).toBeNull();
    expect(recap.deltas).toBeNull();
    expect(recap.paragraphs.join(' ')).toContain('Hoy el capital está alto, la reputación media y el bienestar medio.');
    expect(recap.paragraphs.join(' ')).not.toMatch(/subió|bajó/);
  });

  it('handles a decision with no net effect', () => {
    const flat = [entry(1, { metricsAfter: m(50, 50, 50) })];
    const recap = buildPhaseRecap(baseState(flat), 1);
    expect(recap.paragraphs.join(' ')).not.toContain('movió la aguja');
    expect(recap.partial).toBe(true);
  });

  it('gives different variants to consecutive phases of the same profile', () => {
    const phase = (turns: number[], phaseLog: DecisionLogEntry[]) => phaseLog.filter((e) => turns.includes(e.turn));
    const flat = (turn: number) => entry(turn, { effects: { capital: 1 }, metricsAfter: m(50, 50, 50) });
    const full = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(flat);
    const state = baseState(full);
    expect(phase([1, 2, 3], full)).toHaveLength(3);
    const headlines = [1, 2, 3].map((id) => buildPhaseRecap(state, id as 1 | 2 | 3).headline);
    expect(new Set(headlines).size).toBe(3);
  });
});

describe('buildJourney', () => {
  it('returns one recap per phase that has decisions', () => {
    const log = [1, 2, 3, 4, 5].map((t) => entry(t, { effects: { capital: 1 }, metricsAfter: m(50, 50, 50) }));
    const journey = buildJourney(baseState(log), 'Santi');
    expect(journey.map((r) => r.phaseId)).toEqual([1, 2]);
    expect(journey[1].partial).toBe(true);
  });

  it('is empty when there are no decisions', () => {
    expect(buildJourney(baseState([]))).toEqual([]);
  });
});

describe('integración con el motor', () => {
  it('el motor registra metricsAfter e initialMetrics para el recap', () => {
    let state = startGame(ARCHETYPES[0], FINANCINGS[0]);
    expect(state.initialMetrics).toEqual(state.metrics);
    const rng = createRng(7);
    const event = rng.pick(MAIN_EVENTS.filter((e) => e.phaseId === 1));
    state = applyDecision(state, event.options[0], event.id, event.title, 0, event.kind);
    expect(state.decisionLog[0].metricsAfter).toEqual(state.metrics);
    const recap = buildPhaseRecap(state, 1, 'Santi');
    expect(recap.series).toHaveLength(2);
    expect(recap.series?.[0]).toEqual(state.initialMetrics);
  });
});
