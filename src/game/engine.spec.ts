import { describe, it, expect } from 'vitest';
import {
  clamp,
  applyMetricsEffects,
  applyTags,
  evaluateGameStatus,
  advanceTurn,
  applyDecision,
} from './engine';
import { MAX_TURNS } from './phases';
import type { GameState, GameOption, Metrics } from '../types/game';
import type { Tag } from '../data/tags';

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
});