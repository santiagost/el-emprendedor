import { describe, it, expect } from 'vitest';
import { createTapping, tap, advance, squashBug, visibleBugs, tappingPerformance, isTappingFinished, buildBugs, TAPPING_DURATION_MS, BUG_LIFETIME_MS } from './tapping';

/** Juega una partida con una cadencia constante de toques por segundo y aplasta los bichos al verlos. */
function play(tapsPerSecond: number, { squash = true, assisted = false, seed = 1 } = {}) {
  let s = createTapping(seed);
  const stepMs = 10;
  const tapEveryMs = 1000 / tapsPerSecond;
  let sinceTap = 0;
  while (!isTappingFinished(s)) {
    s = advance(s, stepMs);
    if (squash) visibleBugs(s).forEach((b) => (s = squashBug(s, b.id)));
    sinceTap += stepMs;
    if (sinceTap >= tapEveryMs) {
      sinceTap -= tapEveryMs;
      s = tap(s, assisted);
    }
  }
  return s;
}

describe('tapping', () => {
  it('la barra decae sola y nunca baja de 0', () => {
    let s = tap(createTapping(1));
    s = advance(s, 3000);
    expect(s.progress).toBeGreaterThanOrEqual(0);
    expect(s.progress).toBeLessThan(0.06);
  });

  it('pasado el 70 % cada toque rinde menos (fatiga)', () => {
    const early = tap({ ...createTapping(1), progress: 0.2 });
    const late = tap({ ...createTapping(1), progress: 0.8 });
    expect(early.progress - 0.2).toBeGreaterThan(late.progress - 0.8);
  });

  it('un bicho que se pasa sin aplastar quita avance', () => {
    const base = { ...createTapping(3), progress: 0.5 };
    const bug = base.bugs[0];
    const after = advance({ ...base, elapsedMs: bug.spawnMs + BUG_LIFETIME_MS - 1 }, 5);
    expect(after.missed).toContain(bug.id);
    expect(after.progress).toBeLessThan(0.5 - 0.05);
  });

  it('aplastar un bicho visible lo saca y evita la penalidad', () => {
    let s = { ...createTapping(3), elapsedMs: 0 };
    const bug = s.bugs[0];
    s = advance(s, bug.spawnMs + 50);
    expect(visibleBugs(s).map((b) => b.id)).toContain(bug.id);
    s = squashBug(s, bug.id);
    expect(visibleBugs(s).map((b) => b.id)).not.toContain(bug.id);
    s = advance(s, BUG_LIFETIME_MS);
    expect(s.missed).not.toContain(bug.id);
  });

  it('los bichos salen reproducibles por semilla y dentro de la arena', () => {
    expect(buildBugs(9)).toEqual(buildBugs(9));
    buildBugs(9).forEach((b) => {
      expect(b.x).toBeGreaterThan(0);
      expect(b.x).toBeLessThan(1);
      expect(b.spawnMs + BUG_LIFETIME_MS).toBeLessThanOrEqual(TAPPING_DURATION_MS);
    });
  });

  it('el ritmo del jugador define el rendimiento: rápido perfecto, medio bueno, lento flojo', () => {
    expect(tappingPerformance(play(9))).toBe('perfect');
    expect(tappingPerformance(play(6.5))).toBe('good');
    expect(tappingPerformance(play(3))).toBe('poor');
  });

  it('sin tocar nada es flojo y el modo asistido ayuda', () => {
    expect(tappingPerformance(play(0.01))).toBe('poor');
    expect(tappingPerformance(play(5, { assisted: true }))).not.toBe('poor');
    expect(tappingPerformance(play(5))).toBe('poor');
  });

  it('no avanza después de terminar', () => {
    const s = play(9);
    expect(tap(s)).toBe(s);
    expect(advance(s, 100)).toBe(s);
    expect(s.elapsedMs).toBeLessThanOrEqual(TAPPING_DURATION_MS);
  });
});
