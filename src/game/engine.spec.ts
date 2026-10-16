import { describe, it, expect } from 'vitest';
import {
  clamp,
  applyMetricsEffects,
  applyTags,
  evaluateGameStatus,
  advanceTurn,
  applyDecision,
  canDecide,
  passesTagsCondition,
  selectNextEvent,
} from './engine';
import { createRng } from './rng';
import { MAX_TURNS } from './phases';
import type { GameState, GameEvent, GameOption, Metrics } from '../types/game';
import type { Tag } from '../data/tags';
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
    };

    const regularOption: GameOption = {
      text: 'Opción normal',
      impactPreview: { capital: 'up', bienestar: 'down', reputacion: 'neutral' },
      effects: { capital: 10, bienestar: -10 },
      addTags: ['cultura_lean'],
      learningPill: 'Píldora educativa turno 1',
    };

    it('aplica métricas, tags, historial y píldora sin avanzar de turno (el avance vive en advance())', () => {
      const nextState = applyDecision(baseState, regularOption, 'f1_mvp_calidad');

      expect(nextState.currentTurn).toBe(1);
      expect(nextState.metrics).toEqual({ capital: 60, bienestar: 40, reputacion: 50 });
      expect(nextState.activeTags).toEqual(['cultura_lean']);
      expect(nextState.history).toEqual(['f1_mvp_calidad']);
      expect(nextState.lastPill).toBe('Píldora educativa turno 1');
      expect(nextState.status).toBe('playing');
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

  describe('passesTagsCondition', () => {
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

    it('permite eventos sin ninguna condición', () => {
      expect(passesTagsCondition(baseEvent, [])).toBe(true);
    });

    it('exige TODOS los requiredTags para permitir el evento', () => {
      const gated: GameEvent = {
        ...baseEvent,
        requiredTags: ['cliente_dependencia', 'deuda_riesgosa'],
      };
      expect(passesTagsCondition(gated, ['cliente_dependencia'])).toBe(false);
      expect(passesTagsCondition(gated, ['cliente_dependencia', 'deuda_riesgosa'])).toBe(true);
    });

    it('bloquea el evento si tiene CUALQUIER forbiddenTag', () => {
      const gated: GameEvent = {
        ...baseEvent,
        forbiddenTags: ['socio_alineado'],
      };
      expect(passesTagsCondition(gated, ['socio_alineado'])).toBe(false);
      expect(passesTagsCondition(gated, ['cliente_dependencia'])).toBe(true);
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
      };

      const { event, remainingPending, endedEarly } = selectNextEvent(state, rng);

      expect(endedEarly).toBe(false);
      expect(event?.id).not.toBe('f2_crisis_cobro');
      expect(remainingPending).toEqual([{ eventId: 'f2_crisis_cobro', triggerTurn: 6 }]);
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
});