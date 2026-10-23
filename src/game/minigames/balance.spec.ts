import { describe, it, expect } from 'vitest';
import { buildBalance, targetCenter, stepBalance, inZone, balancePerformance, BALANCE_DURATION_MS, type BalanceParams } from './balance';

const STEP_MS = 16;

/** Simula una negociación completa con un controlador y devuelve la fracción de tiempo dentro del rango. */
function run(p: BalanceParams, control: (pos: number, vel: number, target: number) => number): number {
  let s = { pos: 0.5, vel: 0 };
  let inside = 0;
  let total = 0;
  for (let t = 0; t < BALANCE_DURATION_MS; t += STEP_MS) {
    const target = targetCenter(p, t);
    s = stepBalance(s, control(s.pos, s.vel, target), t, STEP_MS, p);
    if (inZone(s.pos, t, p)) inside++;
    total++;
  }
  return inside / total;
}

const skilled = (pos: number, vel: number, target: number) => (target - pos) * 6 - vel * 1.2;
// Un jugador que casi no corrige: solo reacciona cuando el rango ya quedó lejos
const sloppy = (pos: number, _vel: number, target: number) => (Math.abs(target - pos) > 0.3 ? Math.sign(target - pos) : 0);

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

  it('sin hacer nada la contraparte te saca del rango casi siempre', () => {
    const fractions = [1, 2, 3, 4, 5, 6].map((seed) => run(buildBalance(seed, 50), () => 0));
    expect(fractions.reduce((a, b) => a + b, 0) / fractions.length).toBeLessThan(0.4);
  });

  it('un jugador atento se queda dentro la mayor parte del tiempo', () => {
    const fractions = [1, 2, 3, 4, 5, 6].map((seed) => run(buildBalance(seed, 50), skilled));
    expect(fractions.reduce((a, b) => a + b, 0) / fractions.length).toBeGreaterThanOrEqual(0.75);
    expect(Math.min(...fractions)).toBeGreaterThanOrEqual(0.5);
  });

  it('un jugador distraído rinde menos que uno atento', () => {
    const avg = (c: typeof skilled) => [1, 2, 3, 4, 5, 6].map((seed) => run(buildBalance(seed, 50), c)).reduce((a, b) => a + b, 0) / 6;
    expect(avg(sloppy)).toBeLessThan(avg(skilled));
  });

  it('con poca reputación es más difícil que con mucha', () => {
    const low = [1, 2, 3, 4].map((seed) => run(buildBalance(seed, 5), skilled));
    const high = [1, 2, 3, 4].map((seed) => run(buildBalance(seed, 95), skilled));
    expect(low.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(high.reduce((a, b) => a + b, 0));
  });

  it('balancePerformance respeta los umbrales 75 % y 40 %', () => {
    expect(balancePerformance(0.9)).toBe('perfect');
    expect(balancePerformance(0.75)).toBe('perfect');
    expect(balancePerformance(0.6)).toBe('good');
    expect(balancePerformance(0.4)).toBe('good');
    expect(balancePerformance(0.39)).toBe('poor');
  });
});
