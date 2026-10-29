import { describe, it, expect } from 'vitest';
import { evaluateObjective, EXIT_TAGS } from './objectives';
import { OBJETIVOS } from '../data/objetivos';
import { startGame } from './engine';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import type { GameState, GameStatus, Metrics } from '../types/game';
import type { Tag } from '../data/tags';

const finished = (objetivoId: string | undefined, metrics: Metrics, status: GameStatus = 'victory', activeTags: Tag[] = []): GameState => ({
  ...startGame(ARCHETYPES[0], FINANCINGS[0], 15, 'r1_tecnologia', objetivoId),
  status,
  metrics,
  activeTags,
});

const m = (capital: number, reputacion: number, bienestar: number): Metrics => ({ capital, reputacion, bienestar });

describe('OBJETIVOS', () => {
  it('tienen id único, texto narrativo y un criterio válido', () => {
    expect(new Set(OBJETIVOS.map((o) => o.id)).size).toBe(OBJETIVOS.length);
    for (const o of OBJETIVOS) {
      expect(o.titulo.length).toBeGreaterThan(0);
      expect(o.descripcion.length).toBeGreaterThan(40);
      if (o.criterio.tipo !== 'salida') expect(o.criterio.minimo).toBeGreaterThan(50);
    }
  });

  it('startGame guarda el objetivo elegido', () => {
    expect(startGame(ARCHETYPES[0], FINANCINGS[0], 15, 'r1_tecnologia', 'o1_caja').objetivoId).toBe('o1_caja');
    expect(startGame(ARCHETYPES[0], FINANCINGS[0]).objetivoId).toBeUndefined();
  });
});

describe('evaluateObjective', () => {
  it('no hay resultado sin objetivo (guardados viejos) ni mientras se juega', () => {
    expect(evaluateObjective(finished(undefined, m(90, 90, 90)))).toBeNull();
    expect(evaluateObjective(finished('o1_caja', m(90, 90, 90), 'playing'))).toBeNull();
    expect(evaluateObjective(finished('no_existe', m(90, 90, 90)))).toBeNull();
  });

  it('Hacer caja mira solo el capital, aunque las otras métricas estén bajas', () => {
    const met = evaluateObjective(finished('o1_caja', m(70, 5, 5)));
    expect(met?.met).toBe(true);
    expect(met?.detail).toBe('El capital cerró en 70; la meta era 70 o más.');
    expect(evaluateObjective(finished('o1_caja', m(69, 100, 100)))?.met).toBe(false);
  });

  it('Marca reconocida mira solo la reputación', () => {
    expect(evaluateObjective(finished('o2_marca', m(10, 90, 10)))?.met).toBe(true);
    expect(evaluateObjective(finished('o2_marca', m(100, 89, 100)))?.met).toBe(false);
  });

  it('Empresa sana y Empresa modelo piden las tres, e indican la más baja', () => {
    expect(evaluateObjective(finished('o3_sana', m(70, 70, 70)))?.met).toBe(true);
    const short = evaluateObjective(finished('o3_sana', m(80, 62, 90)));
    expect(short?.met).toBe(false);
    expect(short?.detail).toBe('Tu métrica más baja fue la reputación, en 62; la meta era 70 o más en las tres.');
    expect(evaluateObjective(finished('o5_modelo', m(90, 95, 100)))?.met).toBe(true);
    expect(evaluateObjective(finished('o5_modelo', m(89, 100, 100)))?.met).toBe(false);
  });

  it('Llegar a la salida pide cualquiera de los tres finales', () => {
    for (const tag of EXIT_TAGS) expect(evaluateObjective(finished('o4_salida', m(50, 50, 50), 'victory', [tag]))?.met).toBe(true);
    expect(evaluateObjective(finished('o4_salida', m(100, 100, 100), 'victory', ['cultura_lean']))?.met).toBe(false);
  });

  it('perder la partida es no cumplir, aunque las métricas alcancen', () => {
    const result = evaluateObjective(finished('o1_caja', m(95, 0, 50), 'game_over_reputacion'));
    expect(result?.met).toBe(false);
    expect(result?.detail).toMatch(/no llegó al final/);
  });

  it('un fin anticipado se evalúa con lo que quedó', () => {
    expect(evaluateObjective(finished('o1_caja', m(80, 50, 50), 'ended_early'))?.met).toBe(true);
  });
});
