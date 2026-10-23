import { describe, it, expect } from 'vitest';
import { needlePosition, classifyHit, buildTimingRounds, performanceFromHits, type TimingHit } from './timing';
import { seedFromText } from './performance';

describe('needlePosition', () => {
  it('oscila 0 -> 1 -> 0 con onda triangular', () => {
    expect(needlePosition(0, 1)).toBeCloseTo(0);
    expect(needlePosition(250, 1)).toBeCloseTo(0.5);
    expect(needlePosition(500, 1)).toBeCloseTo(1);
    expect(needlePosition(750, 1)).toBeCloseTo(0.5);
    expect(needlePosition(1000, 1)).toBeCloseTo(0);
  });

  it('nunca sale del rango [0, 1]', () => {
    for (let t = 0; t < 5000; t += 37) {
      const p = needlePosition(t, 1.7);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });
});

describe('classifyHit', () => {
  const round = { center: 0.5, zoneWidth: 0.2, coreWidth: 0.06 };
  it('distingue núcleo, zona y fuera', () => {
    expect(classifyHit(0.5, round)).toBe('core');
    expect(classifyHit(0.52, round)).toBe('core');
    expect(classifyHit(0.57, round)).toBe('zone');
    expect(classifyHit(0.42, round)).toBe('zone');
    expect(classifyHit(0.7, round)).toBe('miss');
    expect(classifyHit(0.1, round)).toBe('miss');
  });
});

describe('buildTimingRounds', () => {
  it('arma 3 rondas que aceleran y es reproducible por semilla', () => {
    const a = buildTimingRounds(123);
    const b = buildTimingRounds(123);
    expect(a).toEqual(b);
    expect(a).toHaveLength(3);
    expect(a[1].speed).toBeGreaterThan(a[0].speed);
    expect(a[2].speed).toBeGreaterThan(a[1].speed);
  });

  it('mantiene la zona dentro de la barra', () => {
    for (let seed = 0; seed < 200; seed++) {
      for (const r of buildTimingRounds(seed, 3)) {
        expect(r.center - r.zoneWidth / 2).toBeGreaterThanOrEqual(0);
        expect(r.center + r.zoneWidth / 2).toBeLessThanOrEqual(1);
      }
    }
  });

  it('el modo asistido ensancha zona y núcleo', () => {
    const normal = buildTimingRounds(7, 2, false)[0];
    const assisted = buildTimingRounds(7, 2, true)[0];
    expect(assisted.zoneWidth).toBeGreaterThan(normal.zoneWidth);
    expect(assisted.coreWidth).toBeGreaterThan(normal.coreWidth);
  });

  it('semillas distintas dan zonas distintas', () => {
    expect(buildTimingRounds(seedFromText('a_1'))[0].center).not.toBe(buildTimingRounds(seedFromText('b_2'))[0].center);
  });
});

describe('performanceFromHits', () => {
  const p = (...h: TimingHit[]) => performanceFromHits(h);
  it('perfecto: casi todo en el núcleo', () => {
    expect(p('core', 'core', 'core')).toBe('perfect');
    expect(p('core', 'core', 'zone')).toBe('perfect');
  });
  it('bueno: en zona al menos en dos rondas', () => {
    expect(p('zone', 'zone', 'zone')).toBe('good');
    expect(p('core', 'zone', 'miss')).toBe('good');
    expect(p('zone', 'zone', 'miss')).toBe('good');
    expect(p('core', 'core', 'miss')).toBe('good');
  });
  it('flojo: fallar casi todo', () => {
    expect(p('miss', 'miss', 'miss')).toBe('poor');
    expect(p('zone', 'miss', 'miss')).toBe('poor');
  });
  it('sin rondas devuelve good', () => {
    expect(p()).toBe('good');
  });
});
