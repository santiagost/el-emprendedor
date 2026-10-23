import { describe, it, expect } from 'vitest';
import { buildBalance, targetCenter, stepBalance, inZone, balancePerformance, holdInput, BALANCE_DURATION_MS, type BalanceParams } from './balance';

const STEP_MS = 16;

/** Simula una negociación completa con un controlador y devuelve la fracción de tiempo dentro del rango. */
function run(p: BalanceParams, control: (pos: number, vel: number, target: number, t: number) => number): number {
  let s = { pos: 0.5, vel: 0 };
  let inside = 0;
  let total = 0;
  for (let t = 0; t < BALANCE_DURATION_MS; t += STEP_MS) {
    const target = targetCenter(p, t);
    s = stepBalance(s, control(s.pos, s.vel, target, t), t, STEP_MS, p);
    if (inZone(s.pos, t, p)) inside++;
    total++;
  }
  return inside / total;
}

/** Jugador con botones: decide cada `reactMs` hacia dónde empujar y mantiene apretado, así que la fuerza crece con el tiempo sostenido. */
function holder(dead: number, reactMs: number) {
  let dir = 0;
  let held = 0;
  let lastDecide = -Infinity;
  return (pos: number, vel: number, target: number, t: number) => {
    if (t - lastDecide >= reactMs) {
      lastDecide = t;
      const err = target - pos - 0.25 * vel;
      const next = Math.abs(err) > dead ? Math.sign(err) : 0;
      if (next !== dir) {
        dir = next;
        held = 0;
      }
    }
    if (dir === 0) return 0;
    held += STEP_MS;
    return dir * holdInput(held);
  };
}
const skilled = () => holder(0.03, 50);
const average = () => holder(0.06, 150);
// Un jugador distraído: no toca nada
const sloppy = () => () => 0;

describe('balance', () => {
  it('el ancho del rango crece con la reputación y con el modo asistido', () => {
    expect(buildBalance(1, 10).width).toBeLessThan(buildBalance(1, 90).width);
    expect(buildBalance(1, 50, true).width).toBeGreaterThan(buildBalance(1, 50).width);
  });

  it('es reproducible por semilla', () => {
    expect(buildBalance(5, 50)).toEqual(buildBalance(5, 50));
  });

  it('el rango objetivo se mantiene dentro de la barra', () => {
    for (let seed = 0; seed < 50; seed++) {
      const p = buildBalance(seed, 20);
      for (let t = 0; t < BALANCE_DURATION_MS; t += 100) {
        const c = targetCenter(p, t);
        expect(c - p.width / 2).toBeGreaterThanOrEqual(-1e-9);
        expect(c + p.width / 2).toBeLessThanOrEqual(1 + 1e-9);
      }
    }
  });

  it('el cursor nunca sale de [0, 1]', () => {
    const p = buildBalance(3, 50);
    let s = { pos: 0.5, vel: 0 };
    for (let t = 0; t < BALANCE_DURATION_MS; t += STEP_MS) {
      s = stepBalance(s, 1, t, STEP_MS, p);
      expect(s.pos).toBeGreaterThanOrEqual(0);
      expect(s.pos).toBeLessThanOrEqual(1);
    }
  });

  const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
  const avg = (rep: number, make: () => (pos: number, vel: number, target: number, t: number) => number) =>
    SEEDS.map((seed) => run(buildBalance(seed, rep), make())).reduce((a, b) => a + b, 0) / SEEDS.length;

  it('un toque corto empuja poco y mantener el botón empuja más', () => {
    expect(holdInput(0)).toBe(0);
    expect(holdInput(50)).toBeLessThan(0.35);
    expect(holdInput(300)).toBeGreaterThan(holdInput(50));
    expect(holdInput(600)).toBe(1);
    expect(holdInput(5000)).toBe(1);
    const p = buildBalance(1, 50);
    const move = (heldMs: number) => {
      let s = { pos: 0.5, vel: 0 };
      for (let h = 0; h < heldMs; h += STEP_MS) s = stepBalance(s, holdInput(h + STEP_MS), 0, STEP_MS, p);
      for (let h = 0; h < 500; h += STEP_MS) s = stepBalance(s, 0, 0, STEP_MS, { ...p, phases: { ...p.phases, push1: 0, push2: 0 } });
      return s.pos;
    };
    expect(Math.abs(move(100) - 0.5)).toBeLessThan(0.12);
    expect(Math.abs(move(500) - 0.5)).toBeGreaterThan(Math.abs(move(100) - 0.5));
  });

  it('sin hacer nada la contraparte te saca del rango la mayor parte del tiempo', () => {
    expect(avg(50, sloppy)).toBeLessThan(0.5);
  });

  it('un jugador atento se queda dentro la mayor parte del tiempo', () => {
    expect(avg(50, skilled)).toBeGreaterThanOrEqual(0.7);
  });

  it('un jugador promedio rinde bien y uno distraído menos', () => {
    expect(avg(50, average)).toBeGreaterThanOrEqual(0.5);
    expect(avg(50, sloppy)).toBeLessThan(avg(50, average));
    expect(avg(50, average)).toBeLessThan(avg(50, skilled));
  });

  it('con poca reputación es más difícil que con mucha', () => {
    expect(avg(5, skilled)).toBeLessThan(avg(95, skilled));
  });

  it('balancePerformance respeta los umbrales 70 % y 50 %', () => {
    expect(balancePerformance(0.9)).toBe('perfect');
    expect(balancePerformance(0.7)).toBe('perfect');
    expect(balancePerformance(0.6)).toBe('good');
    expect(balancePerformance(0.5)).toBe('good');
    expect(balancePerformance(0.49)).toBe('poor');
  });
});
