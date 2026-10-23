import { describe, it, expect } from 'vitest';
import { createTapping, advance, squashBug, visibleBugs, appearedCount, tappingPerformance, isTappingFinished, buildBugs, BUG_COUNT, BUG_LIFETIME_MS, TAPPING_DURATION_MS } from './tapping';

/** Juega con un ritmo: elimina de a un bug (el más viejo en pantalla) cada `gapMs`; null = no toca nada. */
function play(gapMs: number | null, { assisted = false, seed = 1 } = {}) {
  let s = createTapping(seed, assisted);
  let next = 0;
  while (!isTappingFinished(s)) {
    s = advance(s, 10);
    const seen = visibleBugs(s);
    if (gapMs !== null && s.elapsedMs >= next && seen.length) {
      s = squashBug(s, seen[0].id);
      next = s.elapsedMs + gapMs;
    }
  }
  return s;
}

describe('tapping (cazar bugs)', () => {
  it('los bugs salen reproducibles por semilla, dentro de la arena y con tiempo de sobra', () => {
    expect(buildBugs(9)).toEqual(buildBugs(9));
    expect(buildBugs(9)).toHaveLength(BUG_COUNT);
    buildBugs(9).forEach((b) => {
      expect(b.x).toBeGreaterThan(0);
      expect(b.x).toBeLessThan(1);
      expect(b.spawnMs + BUG_LIFETIME_MS * 1.5).toBeLessThanOrEqual(TAPPING_DURATION_MS);
    });
  });

  it('cada vez aparecen más seguidos', () => {
    const t = buildBugs(2).map((b) => b.spawnMs);
    const first = t[1] - t[0];
    const last = t[t.length - 1] - t[t.length - 2];
    expect(last).toBeLessThan(first);
  });

  it('un bug se va solo si no lo tocás', () => {
    let s = createTapping(3);
    const bug = s.bugs[0];
    s = advance(s, bug.spawnMs + 50);
    expect(visibleBugs(s).map((b) => b.id)).toContain(bug.id);
    s = advance(s, BUG_LIFETIME_MS);
    expect(visibleBugs(s).map((b) => b.id)).not.toContain(bug.id);
    expect(s.missed).toContain(bug.id);
  });

  it('eliminar un bug visible lo saca; uno que no apareció o ya se fue no cuenta', () => {
    let s = createTapping(3);
    const [first, last] = [s.bugs[0], s.bugs[s.bugs.length - 1]];
    expect(squashBug(s, first.id)).toBe(s);
    s = advance(s, first.spawnMs + 50);
    expect(squashBug(s, last.id)).toBe(s);
    s = squashBug(s, first.id);
    expect(s.squashed).toEqual([first.id]);
    expect(squashBug(s, first.id)).toBe(s);
    expect(appearedCount(s)).toBe(1);
  });

  it('el rendimiento sale de eliminados sobre aparecidos: rápido perfecto, medio bueno, sin tocar flojo', () => {
    expect(tappingPerformance(play(400))).toBe('perfect');
    expect(tappingPerformance(play(750))).toBe('good');
    expect(tappingPerformance(play(1100))).toBe('poor');
    expect(tappingPerformance(play(null))).toBe('poor');
  });

  it('el modo asistido ayuda', () => {
    expect(play(1100, { assisted: true }).squashed.length).toBeGreaterThan(play(1100).squashed.length);
    expect(tappingPerformance(play(800, { assisted: true }))).toBe('good');
  });

  it('termina cuando se resolvieron todos y no avanza después', () => {
    const s = play(300);
    expect(isTappingFinished(s)).toBe(true);
    expect(advance(s, 100)).toBe(s);
    expect(s.squashed.length + s.missed.length).toBe(BUG_COUNT);
    expect(s.elapsedMs).toBeLessThanOrEqual(TAPPING_DURATION_MS);
  });
});
