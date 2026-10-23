import { describe, it, expect } from 'vitest';
import { scaleEffects, applyDecision, startGame } from './engine';
import { defineOption } from '../data/events/builders';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import type { GameState } from '../types/game';

const baseState = (): GameState => startGame(ARCHETYPES[0], FINANCINGS[0]);

describe('scaleEffects', () => {
  const effects = { capital: 20, reputacion: -10, bienestar: 0 };

  it("'good' deja los efectos intactos", () => {
    expect(scaleEffects(effects, 'good')).toEqual(effects);
  });

  it("'perfect' sube lo positivo y baja lo negativo", () => {
    expect(scaleEffects(effects, 'perfect')).toEqual({ capital: 25, reputacion: -6, bienestar: 0 });
  });

  it("'poor' baja lo positivo y sube lo negativo", () => {
    expect(scaleEffects(effects, 'poor')).toEqual({ capital: 12, reputacion: -13, bienestar: 0 });
  });

  it('ignora métricas ausentes', () => {
    expect(scaleEffects({ capital: 10 }, 'perfect')).toEqual({ capital: 13 });
  });
});

describe('applyDecision con minijuego', () => {
  const option = defineOption(
    'Aceptar la inversión.',
    { capital: 30, reputacion: 10, bienestar: -10 },
    {
      addTags: ['inversion_externa', 'equity_diluido'],
      learningPill: 'Valuación.',
      minigame: {
        kind: 'timing',
        tagsByPerformance: { perfect: { removeTags: ['equity_diluido'] }, poor: { addTags: ['conflicto_legal'] } },
      },
    }
  );

  it('sin rendimiento se comporta como siempre y no registra tier', () => {
    const next = applyDecision(baseState(), option, 'f3_x');
    expect(next.lastDecision?.effects).toEqual(option.effects);
    expect(next.lastDecision?.performance).toBeUndefined();
    expect(next.activeTags).toContain('equity_diluido');
  });

  it("'good' equivale a no pasar rendimiento, pero registra el tier", () => {
    const next = applyDecision(baseState(), option, 'f3_x', undefined, 0, undefined, 'good');
    expect(next.lastDecision?.effects).toEqual(option.effects);
    expect(next.lastDecision?.performance).toBe('good');
  });

  it("'perfect' escala los efectos y aplica sus etiquetas", () => {
    const next = applyDecision(baseState(), option, 'f3_x', undefined, 0, undefined, 'perfect');
    expect(next.lastDecision?.effects).toEqual({ capital: 38, reputacion: 13, bienestar: -6 });
    expect(next.activeTags).toContain('inversion_externa');
    expect(next.activeTags).not.toContain('equity_diluido');
  });

  it("'poor' escala hacia abajo y suma sus etiquetas", () => {
    const next = applyDecision(baseState(), option, 'f3_x', undefined, 0, undefined, 'poor');
    expect(next.lastDecision?.effects).toEqual({ capital: 18, reputacion: 6, bienestar: -13 });
    expect(next.activeTags).toContain('conflicto_legal');
  });

  it('ignora el rendimiento si la opción no tiene minijuego', () => {
    const plain = defineOption('Rechazar.', { capital: 10 }, { learningPill: 'x' });
    const next = applyDecision(baseState(), plain, 'f3_y', undefined, 0, undefined, 'perfect');
    expect(next.lastDecision?.effects).toEqual({ capital: 10 });
    expect(next.lastDecision?.performance).toBeUndefined();
  });

  it("un 'poor' nunca provoca un game over que 'good' no provoca", () => {
    const risky = defineOption('Apostar.', { bienestar: -9 }, { learningPill: 'x', minigame: { kind: 'tapping' } });
    const state = { ...baseState(), metrics: { capital: 50, reputacion: 50, bienestar: 10 } };
    const poor = applyDecision(state, risky, 'f2_z', undefined, 0, undefined, 'poor');
    expect(poor.status).toBe('playing');
    expect(poor.lastDecision?.performance).toBe('good');
  });

  it("un 'poor' no impide el game over si 'good' ya lo provocaba", () => {
    const fatal = defineOption('Apostar.', { bienestar: -20 }, { learningPill: 'x', minigame: { kind: 'tapping' } });
    const state = { ...baseState(), metrics: { capital: 50, reputacion: 50, bienestar: 10 } };
    const poor = applyDecision(state, fatal, 'f2_z', undefined, 0, undefined, 'poor');
    expect(poor.status).toBe('game_over_bienestar');
  });
});
