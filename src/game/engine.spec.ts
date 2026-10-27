import { describe, it, expect } from 'vitest';
import {
  clamp,
  startGame,
  applyMetricsEffects,
  applyTags,
  evaluateGameStatus,
  advanceTurn,
  applyDecision,
  canDecide,
  passesWhenCondition,
  selectNextEvent,
  applyModifiers,
  checkTurnInterruption,
  surpriseChance,
  rollSurprise,
} from './engine';
import { createRng } from './rng';
import { MAX_TURNS } from './phases';
import type { GameState, GameEvent, GameOption, Metrics } from '../types/game';
import type { Tag } from '../data/tags';
import { TAGS } from '../data/tags';
import { defineEvent, defineOption } from '../data/events/builders';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';

describe('Motor de Juego (Engine Spec)', () => {
  describe('clamp', () => {
    it('mantiene valores dentro del rango [0, 100]', () => {
      expect(clamp(-10)).toBe(0);
      expect(clamp(0)).toBe(0);
      expect(clamp(50)).toBe(50);
      expect(clamp(100)).toBe(100);
      expect(clamp(120)).toBe(100);
    });
  });

  describe('applyMetricsEffects', () => {
    const initial: Metrics = { capital: 50, bienestar: 50, reputacion: 50 };

    it('aplica deltas sumando y restando correctamente con límites de clamp', () => {
      const result = applyMetricsEffects(initial, {
        capital: -60,
        bienestar: 10,
        reputacion: 60,
      });

      expect(result).toEqual({
        capital: 0,
        bienestar: 60,
        reputacion: 100,
      });
    });

    it('devuelve una copia intacta si effects es undefined o vacío', () => {
      expect(applyMetricsEffects(initial, undefined)).toEqual(initial);
      expect(applyMetricsEffects(initial, {})).toEqual(initial);
    });
  });

  describe('applyTags', () => {
    it('agrega tags sin duplicados', () => {
      const current: Tag[] = ['cultura_lean'];
      const next = applyTags(current, ['obsesion_calidad', 'cultura_lean']);
      expect(next).toEqual(['cultura_lean', 'obsesion_calidad']);
    });

    it('remueve tags preservando los no afectados', () => {
      const current: Tag[] = ['cultura_lean', 'deuda_riesgosa', 'socio_alineado'];
      const next = applyTags(current, [], ['deuda_riesgosa']);
      expect(next).toEqual(['cultura_lean', 'socio_alineado']);
    });

    it('procesa adiciones y remociones en una sola operación', () => {
      const current: Tag[] = ['deuda_riesgosa'];
      const next = applyTags(current, ['autonomia_estrategica'], ['deuda_riesgosa']);
      expect(next).toEqual(['autonomia_estrategica']);
    });
  });

  describe('evaluateGameStatus', () => {
    const healthy: Metrics = { capital: 40, bienestar: 40, reputacion: 40 };

    it('detecta derrota inmediata si capital llega a 0', () => {
      expect(evaluateGameStatus({ ...healthy, capital: 0 }, 5, MAX_TURNS)).toBe('game_over_capital');
    });

    it('detecta derrota inmediata si bienestar llega a 0', () => {
      expect(evaluateGameStatus({ ...healthy, bienestar: 0 }, 5, MAX_TURNS)).toBe('game_over_bienestar');
    });

    it('detecta derrota inmediata si reputacion llega a 0', () => {
      expect(evaluateGameStatus({ ...healthy, reputacion: 0 }, 5, MAX_TURNS)).toBe('game_over_reputacion');
    });

    it('da prioridad estricta a la derrota sobre la victoria en el turno final', () => {
      // Si en el último turno el capital toca 0, pierde aunque complete los turnos
      const status = evaluateGameStatus({ ...healthy, capital: 0 }, MAX_TURNS, MAX_TURNS);
      expect(status).toBe('game_over_capital');
    });

    it('retorna victory cuando se completa el último turno con todas las métricas en verde', () => {
      expect(evaluateGameStatus(healthy, MAX_TURNS, MAX_TURNS)).toBe('victory');
    });

    it('retorna playing mientras los turnos no alcancen maxTurns y las métricas sean > 0', () => {
      expect(evaluateGameStatus(healthy, MAX_TURNS - 1, MAX_TURNS)).toBe('playing');
    });
  });

  describe('advanceTurn', () => {
    it('avanza el turno y deriva la fase correcta según phases.ts', () => {
      // Turno 1 -> 2 (Fase 1: 1 a 3)
      expect(advanceTurn(1, MAX_TURNS)).toEqual({ nextTurn: 2, nextPhaseId: 1 });
      // Turno 3 -> 4 (Fase 2: 4 a 6)
      expect(advanceTurn(3, MAX_TURNS)).toEqual({ nextTurn: 4, nextPhaseId: 2 });
    });

    it('acota el turno en maxTurns si intenta excederlo', () => {
      const result = advanceTurn(MAX_TURNS, MAX_TURNS);
      expect(result.nextTurn).toBe(MAX_TURNS);
      expect(result.nextPhaseId).toBe(4);
    });
  });

  describe('applyDecision', () => {
    const baseState: GameState = {
      currentTurn: 1,
      maxTurns: MAX_TURNS,
      phaseId: 1,
      metrics: { capital: 50, bienestar: 50, reputacion: 50 },
      activeTags: [],
      history: [],
      status: 'playing',
      lastPill: null,
      pendingEvents: [],
      decisionLog: [],
    };

    const regularOption: GameOption = {
      text: 'Opción normal',
      impactPreview: { capital: 'up', bienestar: 'down', reputacion: 'neutral' },
      effects: { capital: 10, bienestar: -10 },
      addTags: ['cultura_lean'],
      learningPill: 'Píldora educativa turno 1',
    };

    it('aplica effects + modificadores pasivos, tags, historial y píldora sin avanzar de turno', () => {
      const nextState = applyDecision(baseState, regularOption, 'f1_mvp_calidad');
      const mods: Partial<Metrics> = TAGS.cultura_lean.modifiers;

      expect(nextState.currentTurn).toBe(1);
      expect(nextState.metrics).toEqual({
        capital: 60 + (mods.capital ?? 0),
        bienestar: 40 + (mods.bienestar ?? 0),
        reputacion: 50 + (mods.reputacion ?? 0),
      });
      expect(nextState.activeTags).toEqual(['cultura_lean']);
      expect(nextState.history).toEqual(['f1_mvp_calidad']);
      expect(nextState.lastPill).toBe('Píldora educativa turno 1');
      expect(nextState.status).toBe('playing');
      expect(nextState.lastDecision).toBeDefined();
      expect(nextState.lastDecision?.eventId).toBe('f1_mvp_calidad');
      expect(nextState.lastDecision?.optionText).toBe('Opción normal');
      expect(nextState.decisionLog).toHaveLength(1);
      expect(nextState.decisionLog[0].eventId).toBe('f1_mvp_calidad');
    });

    it('encola eventos diferidos (scheduledEvent) con triggerTurn calculado', () => {
      const scheduledOption: GameOption = {
        ...regularOption,
        scheduledEvent: { eventId: 'f2_crisis_cobro', delayTurns: 2 },
      };

      const nextState = applyDecision(baseState, scheduledOption, 'f1_evento');

      expect(nextState.pendingEvents).toEqual([
        { eventId: 'f2_crisis_cobro', triggerTurn: 3 }, // 1 (currentTurn) + 2
      ]);
    });

    it('no avanza el turno si la decisión causa game over', () => {
      const fatalOption: GameOption = {
        ...regularOption,
        effects: { capital: -60 }, // 50 - 60 = 0 -> quiebra
        addTags: [],
      };

      const nextState = applyDecision(baseState, fatalOption, 'f1_mvp_calidad');

      expect(nextState.status).toBe('game_over_capital');
      expect(nextState.currentTurn).toBe(1);
      expect(nextState.metrics.capital).toBe(0);
      expect(nextState.history).toEqual(['f1_mvp_calidad']);
    });

    it('no avanza el turno si la decisión completa la victoria en el turno final', () => {
      const finalTurnState: GameState = {
        ...baseState,
        currentTurn: MAX_TURNS,
        phaseId: 4,
      };

      const nextState = applyDecision(finalTurnState, regularOption, 'f4_evento_final');

      expect(nextState.status).toBe('victory');
      expect(nextState.currentTurn).toBe(MAX_TURNS);
    });
  });

  describe('startGame', () => {
    it('registra el perfil del setup en el estado (archetypeId / financingId)', () => {
      const state = startGame(ARCHETYPES[0], FINANCINGS[1]);

      expect(state.archetypeId).toBe('a1_tecnico');
      expect(state.financingId).toBe('f2_prestamo_bancario');
      expect(state.activeTags).toEqual(['calidad_producto', 'deuda_riesgosa']);
    });
  });

  describe('passesWhenCondition (condiciones ricas)', () => {
    const baseEvent: GameEvent = defineEvent({
      id: 'f1_evento_prueba',
      phaseId: 1,
      title: 'Evento de prueba',
      description: 'Evento sintético para testear condiciones.',
      options: [
        defineOption('Opción A', {}, { learningPill: 'Píldora A.' }),
        defineOption('Opción B', {}, { learningPill: 'Píldora B.' }),
      ],
    });

    const stateWith = (overrides: Partial<GameState> = {}): GameState => ({
      currentTurn: 5,
      maxTurns: MAX_TURNS,
      phaseId: 2,
      metrics: { capital: 50, bienestar: 50, reputacion: 50 },
      activeTags: [],
      history: [],
      status: 'playing',
      lastPill: null,
      pendingEvents: [],
      decisionLog: [],
      ...overrides,
    });

    it('permite eventos sin ninguna condición', () => {
      expect(passesWhenCondition(baseEvent, stateWith())).toBe(true);
    });

    it('when.tags: exige TODOS los tags activos', () => {
      const gated: GameEvent = { ...baseEvent, when: { tags: ['cliente_dependencia', 'deuda_riesgosa'] } };

      expect(passesWhenCondition(gated, stateWith({ activeTags: ['cliente_dependencia'] }))).toBe(false);
      expect(passesWhenCondition(gated, stateWith({ activeTags: ['cliente_dependencia', 'deuda_riesgosa'] }))).toBe(true);
    });

    it('when.forbiddenTags: bloquea con CUALQUIER tag presente', () => {
      const gated: GameEvent = { ...baseEvent, when: { forbiddenTags: ['socio_alineado'] } };

      expect(passesWhenCondition(gated, stateWith({ activeTags: ['socio_alineado'] }))).toBe(false);
      expect(passesWhenCondition(gated, stateWith({ activeTags: ['cliente_dependencia'] }))).toBe(true);
    });

    it('los requiredTags/forbiddenTags legacy siguen funcionando como fallback', () => {
      const legacy: GameEvent = {
        ...baseEvent,
        requiredTags: ['cliente_dependencia'],
        forbiddenTags: ['socio_alineado'],
      };

      expect(passesWhenCondition(legacy, stateWith({ activeTags: ['cliente_dependencia'] }))).toBe(true);
      expect(passesWhenCondition(legacy, stateWith({ activeTags: ['cliente_dependencia', 'socio_alineado'] }))).toBe(false);
      expect(passesWhenCondition(legacy, stateWith({ activeTags: [] }))).toBe(false);
    });

    it('when.archetype: filtra por el perfil del jugador', () => {
      const gated: GameEvent = { ...baseEvent, when: { archetype: ['a3_inversionista'] } };

      expect(passesWhenCondition(gated, stateWith({ archetypeId: 'a3_inversionista' }))).toBe(true);
      expect(passesWhenCondition(gated, stateWith({ archetypeId: 'a1_tecnico' }))).toBe(false);
      expect(passesWhenCondition(gated, stateWith())).toBe(false);
    });

    it('when.financing: filtra por el origen de los fondos', () => {
      const gated: GameEvent = { ...baseEvent, when: { financing: ['f1_bootstrap'] } };

      expect(passesWhenCondition(gated, stateWith({ financingId: 'f1_bootstrap' }))).toBe(true);
      expect(passesWhenCondition(gated, stateWith({ financingId: 'f2_prestamo_bancario' }))).toBe(false);
    });

    it('when.playedBefore: exige que TODOS los eventos estén en history', () => {
      const gated: GameEvent = { ...baseEvent, when: { playedBefore: ['f1_mvp_calidad', 'f1_primer_socio'] } };

      expect(passesWhenCondition(gated, stateWith({ history: ['f1_mvp_calidad', 'f1_primer_socio'] }))).toBe(true);
      expect(passesWhenCondition(gated, stateWith({ history: ['f1_mvp_calidad'] }))).toBe(false);
    });

    it('when.metrics: lt exige estrictamente menor y gt estrictamente mayor', () => {
      const lowCapital: GameEvent = { ...baseEvent, when: { metrics: { capital: { lt: 30 } } } };

      expect(passesWhenCondition(lowCapital, stateWith({ metrics: { capital: 20, bienestar: 50, reputacion: 50 } }))).toBe(true);
      expect(passesWhenCondition(lowCapital, stateWith({ metrics: { capital: 30, bienestar: 50, reputacion: 50 } }))).toBe(false);

      const highReputation: GameEvent = { ...baseEvent, when: { metrics: { reputacion: { gt: 80 } } } };

      expect(passesWhenCondition(highReputation, stateWith({ metrics: { capital: 50, bienestar: 50, reputacion: 85 } }))).toBe(true);
      expect(passesWhenCondition(highReputation, stateWith({ metrics: { capital: 50, bienestar: 50, reputacion: 80 } }))).toBe(false);
    });

    it('combina varias condiciones: todas deben cumplirse', () => {
      const gated: GameEvent = {
        ...baseEvent,
        when: {
          tags: ['deuda_riesgosa'],
          archetype: ['a1_tecnico'],
          metrics: { capital: { lt: 40 } },
        },
      };

      expect(
        passesWhenCondition(gated, stateWith({
          activeTags: ['deuda_riesgosa'],
          archetypeId: 'a1_tecnico',
          metrics: { capital: 10, bienestar: 50, reputacion: 50 },
        }))
      ).toBe(true);
      expect(
        passesWhenCondition(gated, stateWith({
          activeTags: ['deuda_riesgosa'],
          archetypeId: 'a2_comercial',
          metrics: { capital: 10, bienestar: 50, reputacion: 50 },
        }))
      ).toBe(false);
    });
  });

  describe('selectNextEvent con eventos diferidos', () => {
    it('prioriza un pending vencido sobre el pool de la fase', () => {
      const rng = createRng(42);
      const state: GameState = {
        currentTurn: 5,
        maxTurns: MAX_TURNS,
        phaseId: 2,
        metrics: { capital: 50, bienestar: 50, reputacion: 50 },
        activeTags: ['cliente_dependencia'],
        history: [],
        status: 'playing',
        lastPill: null,
        pendingEvents: [{ eventId: 'f2_crisis_cobro', triggerTurn: 5 }],
        decisionLog: [],
      };

      const { event, remainingPending, endedEarly } = selectNextEvent(state, rng);

      expect(endedEarly).toBe(false);
      expect(event?.id).toBe('f2_crisis_cobro');
      expect(remainingPending).toEqual([]);
    });

    it('ignora un pending que aún no vence (triggerTurn futuro)', () => {
      const rng = createRng(42);
      const state: GameState = {
        currentTurn: 4,
        maxTurns: MAX_TURNS,
        phaseId: 2,
        metrics: { capital: 50, bienestar: 50, reputacion: 50 },
        activeTags: ['cliente_dependencia'],
        history: [],
        status: 'playing',
        lastPill: null,
        pendingEvents: [{ eventId: 'f2_crisis_cobro', triggerTurn: 6 }],
        decisionLog: [],
      };

      const { event, remainingPending, endedEarly } = selectNextEvent(state, rng);

      expect(endedEarly).toBe(false);
      expect(event?.id).not.toBe('f2_crisis_cobro');
      expect(remainingPending).toEqual([{ eventId: 'f2_crisis_cobro', triggerTurn: 6 }]);
    });

    it('un pending vencido sin condiciones cumplidas queda en cola y dispara cuando cambian', () => {
      const rng = createRng(42);
      const due = { eventId: 'f2_crisis_cobro', triggerTurn: 5 };
      const base: GameState = {
        currentTurn: 5,
        maxTurns: MAX_TURNS,
        phaseId: 2,
        metrics: { capital: 50, bienestar: 50, reputacion: 50 },
        activeTags: [],
        history: [],
        status: 'playing',
        lastPill: null,
        pendingEvents: [due],
        decisionLog: [],
      };

      const blocked = selectNextEvent(base, rng);
      expect(blocked.event?.id).not.toBe('f2_crisis_cobro');
      expect(blocked.remainingPending).toEqual([due]);

      const ready = selectNextEvent({ ...base, activeTags: ['cliente_dependencia'] }, rng);
      expect(ready.event?.id).toBe('f2_crisis_cobro');
      expect(ready.remainingPending).toEqual([]);
    });
  });

  describe('canDecide (guard anti doble click)', () => {
    const dummyEvent = defineEvent({
      id: 'f1_evento_prueba',
      phaseId: 1,
      title: 'Evento de prueba',
      description: 'Evento sintético para el guard.',
      options: [
        defineOption('Opción A', {}, { learningPill: 'Píldora A.' }),
        defineOption('Opción B', {}, { learningPill: 'Píldora B.' }),
      ],
    });

    it('acepta la decisión con estado válido y turno coincidente', () => {
      expect(canDecide('playing', dummyEvent, 'decision', 3, 3)).toBe(true);
    });

    it('rechaza si el turno de la acción no coincide con el actual', () => {
      expect(canDecide('playing', dummyEvent, 'decision', 2, 3)).toBe(false);
    });

    it('rechaza si no está en paso decision, no está jugando o no hay evento', () => {
      expect(canDecide('playing', dummyEvent, 'outcome', 3, 3)).toBe(false);
      expect(canDecide('victory', dummyEvent, 'decision', 3, 3)).toBe(false);
      expect(canDecide('playing', null, 'decision', 3, 3)).toBe(false);
    });
  });

  describe('impactPreview derivado en setup', () => {
    it('arquetipos y financiamientos tienen el preview consistente con sus effects', () => {
      const trendOf = (value?: number): 'up' | 'down' | 'neutral' => {
        if (value == null || value === 0) return 'neutral';
        return value > 0 ? 'up' : 'down';
      };

      [...ARCHETYPES, ...FINANCINGS].forEach((entry) => {
        expect(entry.impactPreview.capital).toBe(trendOf(entry.effects.capital));
        expect(entry.impactPreview.bienestar).toBe(trendOf(entry.effects.bienestar));
        expect(entry.impactPreview.reputacion).toBe(trendOf(entry.effects.reputacion));
      });
    });
  });
  describe('applyModifiers (C3: modificadores pasivos)', () => {
    it('aplica el modificador pasivo de cada tag activo', () => {
      const initial: Metrics = { capital: 50, bienestar: 50, reputacion: 50 };
      const modified = applyModifiers(initial, ['deuda_riesgosa']);

      const expectedDelta = TAGS.deuda_riesgosa?.modifiers?.capital ?? 0;
      expect(modified.capital).toBe(50 + expectedDelta);
    });

    it('suma los modificadores de todos los tags activos (Σ)', () => {
      const tags: Tag[] = ['deuda_riesgosa', 'cultura_lean'];
      const mods = (tag: Tag): Partial<Metrics> => TAGS[tag].modifiers;
      const delta = (metric: keyof Metrics): number =>
        tags.reduce((sum, tag) => sum + (mods(tag)[metric] ?? 0), 0);

      const modified = applyModifiers({ capital: 50, bienestar: 50, reputacion: 50 }, tags);

      expect(modified.capital).toBe(50 + delta('capital'));
      expect(modified.bienestar).toBe(50 + delta('bienestar'));
      expect(modified.reputacion).toBe(50 + delta('reputacion'));
    });

    it('clampa en 0 cuando los modificadores drenan por debajo del piso', () => {
      const modified = applyModifiers({ capital: 1, bienestar: 50, reputacion: 50 }, ['deuda_riesgosa']);
      expect(modified.capital).toBe(0);
    });

    it('un modificador pasivo puede causar derrota: se aplica antes del chequeo de derrota', () => {
      const state: GameState = {
        currentTurn: 1,
        maxTurns: MAX_TURNS,
        phaseId: 1,
        metrics: { capital: 3, bienestar: 50, reputacion: 50 },
        activeTags: ['deuda_riesgosa'],
        history: [],
        status: 'playing',
        lastPill: null,
        pendingEvents: [],
        decisionLog: [],
      };

      const neutralOption: GameOption = {
        text: 'Opción sin impacto directo',
        impactPreview: { capital: 'neutral', bienestar: 'neutral', reputacion: 'neutral' },
        effects: {},
        learningPill: 'Píldora',
      };

      const nextState = applyDecision(state, neutralOption, 'f1_test');

      expect(nextState.status).toBe('game_over_capital');
      expect(nextState.metrics.capital).toBe(0);
    });
  });

  describe('checkTurnInterruption', () => {
    const baseState: GameState = {
      currentTurn: 3,
      maxTurns: MAX_TURNS,
      phaseId: 1,
      metrics: { capital: 50, bienestar: 50, reputacion: 50 },
      activeTags: [],
      history: [],
      status: 'playing',
      lastPill: null,
      pendingEvents: [],
      decisionLog: [],
      unforeseenEventsPlayed: 0,
    };

    it('no interrumpe si la partida terminó (status !== playing)', () => {
      const rng = createRng(42);
      const endedState: GameState = { ...baseState, status: 'game_over_capital', metrics: { ...baseState.metrics, capital: 10 } };
      expect(checkTurnInterruption(endedState, rng)).toBeNull();
    });

    it('dispara crisis cuando una métrica cae al 25% o menos', () => {
      const rng = createRng(42);
      const crisisState: GameState = { ...baseState, metrics: { capital: 25, bienestar: 60, reputacion: 60 } };
      const interruption = checkTurnInterruption(crisisState, rng);

      expect(interruption).not.toBeNull();
      expect(interruption?.kind).toBe('crisis');
      expect(interruption?.event.id).toBe('crisis_quiebra_inminente');
    });

    it('no repite un evento de crisis ya jugado (presente en history)', () => {
      const rng = createRng(42);
      const playedCrisisState: GameState = {
        ...baseState,
        metrics: { capital: 20, bienestar: 60, reputacion: 60 },
        history: ['crisis_quiebra_inminente'],
      };
      // Con capital bajo pero su crisis ya jugada, si bienestar y reputacion están sanos no dispara crisis
      // Podría disparar imprevisto según la tirada de dados
      const interruption = checkTurnInterruption(playedCrisisState, rng);
      if (interruption) {
        expect(interruption.event.id).not.toBe('crisis_quiebra_inminente');
      }
    });

    const createMockRng = (roll: number) => {
      const base = createRng(1);
      return {
        ...base,
        next: () => roll,
      };
    };

    it('sortea imprevistos exógenos con RNG determinístico', () => {
      const interruption = checkTurnInterruption(baseState, createMockRng(0.1));
      expect(interruption).not.toBeNull();
      expect(interruption?.kind).toBe('unforeseen');
    });

    it('no dispara imprevisto si la tirada supera el umbral de probabilidad', () => {
      const interruption = checkTurnInterruption(baseState, createMockRng(0.9));
      expect(interruption).toBeNull();
    });

    it('aumenta la probabilidad a 45% si estamos en turno 7+ y aún no ocurrió ningún imprevisto', () => {
      const turn7State: GameState = {
        ...baseState,
        currentTurn: 7,
        unforeseenEventsPlayed: 0,
      };

      const interruption = checkTurnInterruption(turn7State, createMockRng(0.35));
      expect(interruption).not.toBeNull();
      expect(interruption?.kind).toBe('unforeseen');
    });

    it('respeta el tope máximo de 3 imprevistos por partida', () => {
      const maxedState: GameState = {
        ...baseState,
        unforeseenEventsPlayed: 3,
      };

      const interruption = checkTurnInterruption(maxedState, createMockRng(0.01));
      expect(interruption).toBeNull();
    });
  });

  describe('applyDecision con consecuencias narrativas y tipo de evento', () => {
    const baseState: GameState = {
      currentTurn: 2,
      maxTurns: MAX_TURNS,
      phaseId: 1,
      metrics: { capital: 50, bienestar: 50, reputacion: 50 },
      activeTags: [],
      history: [],
      status: 'playing',
      lastPill: null,
      pendingEvents: [],
      decisionLog: [],
      unforeseenEventsPlayed: 0,
    };

    it('registra outcomeText y kind en lastDecision y decisionLog', () => {
      const option: GameOption = {
        text: 'Decisión con consecuencia narrativa',
        impactPreview: { capital: 'up', bienestar: 'down', reputacion: 'neutral' },
        effects: { capital: 10, bienestar: -10 },
        learningPill: 'Píldora educativa',
        outcomeText: 'Se aceleró el producto pero el equipo quedó cansado.',
      };

      const next = applyDecision(baseState, option, 'imp_salto_inflacionario', 'Salto Inflacionario', 0, 'unforeseen');

      expect(next.lastDecision?.outcomeText).toBe('Se aceleró el producto pero el equipo quedó cansado.');
      expect(next.lastDecision?.kind).toBe('unforeseen');
      expect(next.unforeseenEventsPlayed).toBe(1);
      expect(next.decisionLog[0].outcomeText).toBe('Se aceleró el producto pero el equipo quedó cansado.');
    });
  });
  describe('sorpresas (la tendencia a veces falla)', () => {
    const state = (overrides: Partial<GameState> = {}): GameState => ({
      currentTurn: 8,
      maxTurns: MAX_TURNS,
      phaseId: 3,
      metrics: { capital: 50, bienestar: 50, reputacion: 50 },
      activeTags: [],
      history: [],
      status: 'playing',
      lastPill: null,
      pendingEvents: [],
      decisionLog: [],
      ...overrides,
    });
    const option: GameOption = {
      text: 'Subir precios',
      impactPreview: { capital: 'up', bienestar: 'neutral', reputacion: 'down' },
      effects: { capital: 10, reputacion: -10 },
      learningPill: 'Pill',
      surprise: { effects: { capital: -5, reputacion: -10 }, outcomeText: 'Los clientes se fueron.' },
    };

    it('la probabilidad es 0 antes de la fase 3, 25 % en la fase 3 y 0 con el tope de 6', () => {
      expect(surpriseChance(state({ phaseId: 2, currentTurn: 5 }))).toBe(0);
      expect(surpriseChance(state())).toBe(0.25);
      expect(surpriseChance(state({ phaseId: 4, currentTurn: 12, surprisesPlayed: 6 }))).toBe(0);
    });

    it('en la fase 4 sube a faltantes / turnos que quedan mientras no salgan 3, y vuelve al 25 %', () => {
      expect(surpriseChance(state({ phaseId: 4, currentTurn: 11, surprisesPlayed: 0 }))).toBeCloseTo(3 / 5);
      expect(surpriseChance(state({ phaseId: 4, currentTurn: 13, surprisesPlayed: 2 }))).toBeCloseTo(1 / 3);
      expect(surpriseChance(state({ phaseId: 4, currentTurn: 15, surprisesPlayed: 1 }))).toBe(1);
      expect(surpriseChance(state({ phaseId: 4, currentTurn: 11, surprisesPlayed: 3 }))).toBe(0.25);
    });

    it('rollSurprise no consume el RNG sin sorpresa posible (sin opción, con minijuego o en fase 2)', () => {
      const rng = createRng(1);
      const before = rng.getState();
      expect(rollSurprise(state(), { ...option, surprise: undefined }, rng)).toBe(false);
      expect(rollSurprise(state(), { ...option, minigame: { kind: 'timing' } }, rng)).toBe(false);
      expect(rollSurprise(state({ phaseId: 2 }), option, rng)).toBe(false);
      expect(rng.getState()).toBe(before);
    });

    it('rollSurprise sortea con la probabilidad vigente', () => {
      expect(rollSurprise(state({ phaseId: 4, currentTurn: 15, surprisesPlayed: 0 }), option, createRng(7))).toBe(true);
      const rng = { next: () => 0.3 } as ReturnType<typeof createRng>;
      expect(rollSurprise(state(), option, rng)).toBe(false);
    });

    it('applyDecision con sorpresa usa los efectos y el texto alternativos, la registra y la cuenta', () => {
      const next = applyDecision(state(), option, 'f3_x', 'X', 0, 'main', undefined, true);
      expect(next.metrics.capital).toBe(45);
      expect(next.decisionLog[0].surprised).toBe(true);
      expect(next.decisionLog[0].outcomeText).toBe('Los clientes se fueron.');
      expect(next.surprisesPlayed).toBe(1);
    });

    it('sin sorpresa aplica el desenlace normal y no la registra', () => {
      const next = applyDecision(state(), option, 'f3_x', 'X', 0, 'main', undefined, false);
      expect(next.metrics.capital).toBe(60);
      expect(next.decisionLog[0].surprised).toBeUndefined();
      expect(next.surprisesPlayed).toBe(0);
    });

    it('la sorpresa nunca causa un game over por sí sola', () => {
      const fatal: GameOption = { ...option, surprise: { effects: { capital: -20 }, outcomeText: 'Cayó.' } };
      const next = applyDecision(state({ metrics: { capital: 15, bienestar: 50, reputacion: 50 } }), fatal, 'f3_x', 'X', 0, 'main', undefined, true);
      expect(next.status).toBe('playing');
      expect(next.metrics.capital).toBe(25);
      expect(next.surprisesPlayed).toBe(0);
    });
  });
});