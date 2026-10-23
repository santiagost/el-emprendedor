import { describe, it, expect } from 'vitest';
import {
  computeSegments,
  segmentArcs,
  outcomeAt,
  planSpin,
  angleAt,
  stopSpin,
  SPIN_AUTO_STOP_MS,
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

  it('el plan es reproducible por semilla y la versión asistida gira más lento', () => {
    expect(planSpin(4)).toEqual(planSpin(4));
    expect(planSpin(4, true).speed).toBeLessThan(planSpin(4).speed);
    expect(planSpin(4, true).startAngle).toBe(planSpin(4).startAngle);
  });

  it('gira siempre en el mismo sentido y da la vuelta completa', () => {
    const plan = { startAngle: 10, speed: 120 };
    expect(angleAt(plan, 0)).toBeCloseTo(10);
    expect(angleAt(plan, 500)).toBeCloseTo(70);
    expect(angleAt(plan, 3000)).toBeCloseTo(10);
  });

  it('frenar lee el segmento bajo el puntero en ese instante', () => {
    const plan = { startAngle: 0, speed: 100 };
    expect(stopSpin(plan, segments, 1000).outcome).toBe('success'); // 100°
    expect(stopSpin(plan, segments, 2000).outcome).toBe('minor'); // 200°
    expect(stopSpin(plan, segments, 3200).outcome).toBe('critical'); // 320°
  });

  it('si no frena, se detiene sola al llegar al tiempo máximo', () => {
    const plan = { startAngle: 0, speed: 100 };
    expect(stopSpin(plan, segments, SPIN_AUTO_STOP_MS + 5000).wheelAngle).toBeCloseTo(angleAt(plan, SPIN_AUTO_STOP_MS));
  });

  it('el tamaño del segmento es la dificultad: frenar al azar cae según los porcentajes', () => {
    const counts = { success: 0, minor: 0, critical: 0 };
    const n = 4000;
    for (let i = 0; i < n; i++) counts[stopSpin({ startAngle: 0, speed: 150 }, segments, ((i * 0.6180339) % 1) * 2400).outcome]++;
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
