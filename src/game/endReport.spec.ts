import { describe, it, expect } from 'vitest';
import { buildEpilogue, buildWhyLine, buildMetricCurves, buildTimeline, splitPivots, buildOutlook } from './endReport';
import { buildJourney } from './recap';
import { startGame } from './engine';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import type { DecisionLogEntry, GameState, Metrics } from '../types/game';
import type { PivotMoment, Retrospective, Verdict } from './retrospective';

const m = (capital: number, reputacion: number, bienestar: number): Metrics => ({ capital, reputacion, bienestar });

const entry = (turn: number, partial: Partial<DecisionLogEntry> = {}): DecisionLogEntry => ({
  turn,
  eventId: `evento_${turn}`,
  eventTitle: `Evento ${turn}`,
  kind: 'main',
  optionIndex: 0,
  optionText: `Opción del turno ${turn}.`,
  effects: {},
  metricsAfter: m(50 + turn, 50, 50),
  ...partial,
});

const stateWith = (log: DecisionLogEntry[], extra: Partial<GameState> = {}): GameState => ({
  ...startGame(ARCHETYPES[0], FINANCINGS[0]),
  initialMetrics: m(50, 50, 50),
  decisionLog: log,
  ...extra,
});

describe('buildEpilogue', () => {
  it('elige el final de victoria según los tags, con prioridad de venta y sin emojis', () => {
    expect(buildEpilogue('victory', ['salida_exitosa_venta', 'lifestyle_business']).title).toBe('El Unicornio Adquirido');
    expect(buildEpilogue('victory', ['lifestyle_business']).title).toContain('Negocio Sostenible');
    expect(buildEpilogue('victory', ['expansion_global']).title).toBe('La Expansión Global');
    expect(buildEpilogue('victory', ['equity_diluido']).title).toBe('El Fundador Desplazado');
    expect(buildEpilogue('victory', ['equity_diluido', 'autonomia_estrategica']).title).toBe('Empresa Consolidada');
    expect(buildEpilogue('victory', []).tone).toBe('good');
    expect(buildEpilogue('victory', ['salida_exitosa_venta']).title).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('cada derrota tiene su relato y un tono de derrota', () => {
    for (const status of ['game_over_capital', 'game_over_bienestar', 'game_over_reputacion'] as const) {
      const epilogue = buildEpilogue(status, []);
      expect(epilogue.tone).toBe('bad');
      expect(epilogue.title).not.toMatch(/\p{Extended_Pictographic}/u);
    }
    expect(buildEpilogue('game_over_bienestar', []).title).toBe('Colapso por Burnout');
  });

  it('un fin anticipado es neutro', () => {
    expect(buildEpilogue('ended_early', []).tone).toBe('neutral');
  });
});

describe('buildWhyLine', () => {
  it('en una victoria resume el piso de las tres métricas', () => {
    const why = buildWhyLine(stateWith([entry(15)], { status: 'victory', metrics: m(100, 100, 89), currentTurn: 15 }));
    expect(why.strong).toBe('Las tres métricas cerraron arriba de 85.');
    expect(why.rest).toBe('Llegaste al año 15 con capital 100%, reputación 100% y bienestar 89%.');
  });

  it('en una victoria ajustada no promete un piso alto', () => {
    const why = buildWhyLine(stateWith([entry(15)], { status: 'victory', metrics: m(70, 55, 62), currentTurn: 15 }));
    expect(why.strong).toBe('Llegaste al final con las tres métricas en pie.');
  });

  it('en una derrota nombra la métrica que cayó, el año y cómo estaban las otras', () => {
    const why = buildWhyLine(stateWith([entry(5), entry(6)], { status: 'game_over_bienestar', metrics: m(100, 2, 0), currentTurn: 6 }));
    expect(why.strong).toBe('El bienestar llegó a 0% en el año 6 de 15.');
    expect(why.rest).toBe('Las otras dos métricas cerraron así: capital 100% y reputación 2%.');
  });

  it('usa el género correcto de cada métrica', () => {
    const rep = buildWhyLine(stateWith([entry(4)], { status: 'game_over_reputacion', metrics: m(40, 0, 40), currentTurn: 4 }));
    expect(rep.strong.startsWith('La reputación llegó')).toBe(true);
    const cap = buildWhyLine(stateWith([entry(4)], { status: 'game_over_capital', metrics: m(0, 40, 40), currentTurn: 4 }));
    expect(cap.strong.startsWith('El capital llegó')).toBe(true);
  });

  it('en un fin anticipado lo dice sin hablar de derrota', () => {
    const why = buildWhyLine(stateWith([entry(9)], { status: 'ended_early', metrics: m(50, 50, 50), currentTurn: 9 }));
    expect(why.strong).toBe('Se agotaron los eventos disponibles en el año 9.');
  });
});

describe('buildMetricCurves', () => {
  const log = [entry(1), entry(2), entry(3), entry(4), entry(5)];

  it('arma la serie desde el inicio y las posiciones donde termina cada fase', () => {
    const curves = buildMetricCurves(stateWith(log))!;
    expect(curves.decisions).toBe(5);
    expect(curves.curves.map((c) => c.key)).toEqual(['capital', 'reputacion', 'bienestar']);
    expect(curves.curves[0].series).toEqual([50, 51, 52, 53, 54, 55]);
    expect(curves.curves[0].delta).toBe(5);
    expect(curves.slots).toEqual([
      { phaseId: 1, count: 3 },
      { phaseId: 2, count: 2 },
    ]);
    expect(curves.breaks).toEqual([3]);
  });

  it('no marca fases sin decisiones y no deja una línea al final', () => {
    const curves = buildMetricCurves(stateWith([entry(1), entry(2), entry(3)]))!;
    expect(curves.slots).toEqual([{ phaseId: 1, count: 3 }]);
    expect(curves.breaks).toEqual([]);
  });

  it('devuelve null si el guardado no trae el recorrido', () => {
    expect(buildMetricCurves(stateWith([entry(1, { metricsAfter: undefined })]))).toBeNull();
    expect(buildMetricCurves(stateWith([]))).toBeNull();
    expect(buildMetricCurves(stateWith(log, { initialMetrics: undefined }))).toBeNull();
  });
});

describe('buildTimeline', () => {
  const verdicts = new Map<number, Verdict>([[1, 'could_be_better']]);

  it('una victoria completa las cuatro fases', () => {
    const log = Array.from({ length: 15 }, (_, i) => entry(i + 1));
    const state = stateWith(log, { status: 'victory', currentTurn: 15 });
    const timeline = buildTimeline(state, buildJourney(state), verdicts);
    expect(timeline.map((p) => p.status)).toEqual(['completed', 'completed', 'completed', 'completed']);
    expect(timeline[3].decisions).toHaveLength(5);
  });

  it('en una derrota corta la línea en la fase donde caíste y marca las siguientes como no alcanzadas', () => {
    const log = [1, 2, 3, 4, 5, 6].map((t) => entry(t));
    const state = stateWith(log, { status: 'game_over_bienestar', currentTurn: 6 });
    const timeline = buildTimeline(state, buildJourney(state), verdicts);
    expect(timeline.map((p) => p.status)).toEqual(['completed', 'cut', 'not_reached', 'not_reached']);
    expect(timeline[2].recap).toBeNull();
    expect(timeline[2].decisions).toEqual([]);
  });

  it('cae en la mitad de una fase y también la corta', () => {
    const log = [1, 2, 3, 4, 5].map((t) => entry(t));
    const state = stateWith(log, { status: 'game_over_capital', currentTurn: 5 });
    expect(buildTimeline(state, buildJourney(state), verdicts)[1].status).toBe('cut');
  });

  it('un fin anticipado deja la fase como incompleta, sin marcarla como caída', () => {
    const log = [1, 2, 3, 4, 5].map((t) => entry(t));
    const state = stateWith(log, { status: 'ended_early', currentTurn: 5 });
    expect(buildTimeline(state, buildJourney(state), verdicts)[1].status).toBe('incomplete');
  });

  it('cada decisión trae su veredicto y su título sin emoji ni marcas de tipo', () => {
    const log = [
      entry(1, { eventTitle: 'Primer dilema' }),
      entry(2, { kind: 'unforeseen', eventTitle: '⚡ Salto Inflacionario Imprevisto' }),
      entry(3, { kind: 'crisis', eventTitle: '🔥 Colapso por Burnout' }),
    ];
    const state = stateWith(log, { status: 'ended_early', currentTurn: 3 });
    const [first] = buildTimeline(state, buildJourney(state), verdicts);
    expect(first.decisions.map((d) => d.title)).toEqual(['Primer dilema', 'Salto Inflacionario Imprevisto', 'Colapso por Burnout']);
    expect(first.decisions.map((d) => d.kind)).toEqual(['main', 'unforeseen', 'crisis']);
    expect(first.decisions[1].verdict).toBe('could_be_better');
    expect(first.decisions[0].verdict).toBeUndefined();
  });

  it('resuelve el nombre del jugador en los textos', () => {
    const state = stateWith([entry(1, { optionText: '{nombre}, vendé todo.' })], { status: 'ended_early', currentTurn: 1 });
    const [first] = buildTimeline(state, buildJourney(state, 'Santi'), verdicts, 'Santi');
    expect(first.decisions[0].option).toBe('Santi, vendé todo.');
  });
});

describe('splitPivots', () => {
  const pivot = (turn: number, gain: number) => ({ turn, gain }) as PivotMoment;

  it('el momento clave es el de mayor ganancia', () => {
    const a = pivot(3, 5);
    const b = pivot(6, 35);
    const c = pivot(9, 10);
    expect(splitPivots([a, b, c])).toEqual({ main: b, others: [a, c] });
  });

  it('sin momentos no hay clave', () => {
    expect(splitPivots([])).toEqual({ main: null, others: [] });
  });
});

describe('buildOutlook', () => {
  const retro = (projection: Retrospective['projection']) => ({ projection }) as Retrospective;

  it('sin proyección no hay recuadro', () => {
    expect(buildOutlook(stateWith([entry(5)]), retro(null))).toBeNull();
  });

  it('en una victoria da un rango de la métrica que decidió el final', () => {
    const state = stateWith([entry(15)], { status: 'victory', currentTurn: 15 });
    const outlook = buildOutlook(state, retro({ targetMetric: 'bienestar', actual: 89, low: 90, high: 100 }))!;
    expect(outlook.big).toBe('90 a 100');
    expect(outlook.small).toBe('Bienestar probable con los otros caminos. Terminaste en 89.');
    expect(outlook.altBenefit).toBe('Habría cuidado mejor el bienestar');
  });

  it('en una derrota da el rango de años hasta donde habría llegado', () => {
    const state = stateWith([entry(6)], { status: 'game_over_bienestar', currentTurn: 6 });
    const outlook = buildOutlook(state, retro({ targetMetric: 'bienestar', actual: 0, low: 10, high: 30, extraTurns: [4, 7] }))!;
    expect(outlook.big).toBe('Año 10 a 13');
    expect(outlook.small).toContain('Caíste en el año 6.');
  });

  it('si el final no cambiaba lo dice sin inventar turnos', () => {
    const state = stateWith([entry(6)], { status: 'game_over_capital', currentTurn: 6 });
    const outlook = buildOutlook(state, retro({ targetMetric: 'capital', actual: 0, low: 5, high: 15, extraTurns: [0, 0] }))!;
    expect(outlook.big).toBe('Casi igual');
  });
});
