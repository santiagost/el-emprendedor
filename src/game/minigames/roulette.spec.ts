import { describe, it, expect } from 'vitest';
import {
  computeSegments,
  segmentArcs,
  outcomeAt,
  planSpin,
  resolveSpin,
  nudgeFromTap,
  performanceFromOutcome,
  LAUNCH_HEADWINDS,
  LAUNCH_TAILWINDS,
} from './roulette';
import { TAGS } from '../../data/tags';

const sum = (s: { success: number; minor: number; critical: number }) => s.success + s.minor + s.critical;

describe('computeSegments', () => {
  it('siempre suma 1 y ningún segmento baja de 5 %', () => {
    const cases = [[], [...LAUNCH_TAILWINDS], [...LAUNCH_HEADWINDS], [...LAUNCH_TAILWINDS, ...LAUNCH_HEADWINDS]] as const;
    for (const tags of cases) {
      for (const bias of [-0.5, -0.2, 0, 0.12, 0.5]) {
        const { segments } = computeSegments(tags, bias);
        expect(sum(segments)).toBeCloseTo(1, 5);
        expect(segments.success).toBeGreaterThanOrEqual(0.049);
        expect(segments.minor).toBeGreaterThanOrEqual(0.049);
        expect(segments.critical).toBeGreaterThanOrEqual(0.049);
      }
    }
  });

  it('los tags buenos agrandan el verde y los de deuda agrandan el rojo', () => {
    const base = computeSegments([]).segments;
    const good = computeSegments(['procesos_solidos']).segments;
    const bad = computeSegments(['deuda_riesgosa']).segments;
    expect(good.success).toBeGreaterThan(base.success);
    expect(good.critical).toBeLessThan(base.critical);
    expect(bad.critical).toBeGreaterThan(base.critical);
    expect(bad.success).toBeLessThan(base.success);
  });

  it('el sesgo de riesgo de la opción mueve las probabilidades', () => {
    expect(computeSegments([], 0.12).segments.critical).toBeGreaterThan(computeSegments([], 0).segments.critical);
    expect(computeSegments([], -0.2).segments.success).toBeGreaterThan(computeSegments([], 0).segments.success);
  });

  it('explica qué tags movieron las probabilidades', () => {
    const { reasons } = computeSegments(['procesos_solidos', 'deuda_riesgosa', 'inversiones']);
    expect(reasons.map((r) => r.label)).toEqual([TAGS.procesos_solidos.label, TAGS.deuda_riesgosa.label]);
    expect(reasons[0].delta).toBeGreaterThan(0);
    expect(reasons[1].delta).toBeLessThan(0);
  });

  it('todos los tags de las listas existen', () => {
    [...LAUNCH_TAILWINDS, ...LAUNCH_HEADWINDS].forEach((t) => expect(TAGS[t]).toBeDefined());
  });
});

describe('ruleta', () => {
  const segments = { success: 0.5, minor: 0.3, critical: 0.2 };

  it('los arcos cubren los 360 grados en orden', () => {
    const arcs = segmentArcs(segments);
    expect(arcs.success).toEqual([0, 180]);
    expect(arcs.minor[0]).toBeCloseTo(180);
    expect(arcs.critical[1]).toBeCloseTo(360);
  });

  it('outcomeAt lee el segmento bajo el puntero, también con ángulos negativos o mayores a 360', () => {
    expect(outcomeAt(10, segments)).toBe('success');
    expect(outcomeAt(200, segments)).toBe('minor');
    expect(outcomeAt(300, segments)).toBe('critical');
    expect(outcomeAt(370, segments)).toBe('success');
    expect(outcomeAt(-30, segments)).toBe('critical');
  });

  it('el plan es reproducible por semilla y el empujón respeta ±10°', () => {
    expect(planSpin(4)).toEqual(planSpin(4));
    for (let t = 0; t < 4000; t += 13) expect(Math.abs(nudgeFromTap(t))).toBeLessThanOrEqual(10.0001);
    expect(nudgeFromTap(null)).toBe(0);
  });

  it('el empujón solo cambia el resultado cuando el ángulo cae a menos de 10° de un borde', () => {
    let changed = 0;
    for (let seed = 0; seed < 400; seed++) {
      const plan = planSpin(seed);
      const without = resolveSpin(plan, segments, 0).outcome;
      const withNudge = resolveSpin(plan, segments, 10).outcome;
      const nearEdge = [0, 180, 288, 360].some((edge) => Math.abs(plan.baseAngle - edge) < 10.01 || Math.abs(plan.baseAngle + 10 - edge) < 10.01);
      if (without !== withNudge) {
        changed++;
        expect(nearEdge).toBe(true);
      }
    }
    expect(changed).toBeGreaterThan(0);
  });

  it('las frecuencias salen cerca de las probabilidades visibles', () => {
    const counts = { success: 0, minor: 0, critical: 0 };
    const n = 4000;
    for (let seed = 1; seed <= n; seed++) counts[resolveSpin(planSpin(seed), segments, 0).outcome]++;
    expect(counts.success / n).toBeGreaterThan(0.45);
    expect(counts.success / n).toBeLessThan(0.55);
    expect(counts.critical / n).toBeGreaterThan(0.15);
    expect(counts.critical / n).toBeLessThan(0.25);
  });

  it('mapea el desenlace a rendimiento', () => {
    expect(performanceFromOutcome('success')).toBe('perfect');
    expect(performanceFromOutcome('minor')).toBe('good');
    expect(performanceFromOutcome('critical')).toBe('poor');
  });
});
