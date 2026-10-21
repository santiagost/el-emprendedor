import { describe, it, expect } from 'vitest';
import { computeMetricDeltas, getRevealingDuration, netDecisionEffect, stressLevel } from './ui';
import type { DecisionLogEntry, Metrics } from '../types/game';

describe('computeMetricDeltas', () => {
  it('returns undefined for metrics with zero change', () => {
    const prev: Metrics = { capital: 50, reputacion: 50, bienestar: 50 };
    const next: Metrics = { capital: 50, reputacion: 50, bienestar: 50 };

    const deltas = computeMetricDeltas(prev, next);
    expect(deltas.capital).toBeUndefined();
    expect(deltas.reputacion).toBeUndefined();
    expect(deltas.bienestar).toBeUndefined();
  });

  it('correctly calculates positive and negative deltas', () => {
    const prev: Metrics = { capital: 60, reputacion: 40, bienestar: 70 };
    const next: Metrics = { capital: 30, reputacion: 55, bienestar: 70 };

    const deltas = computeMetricDeltas(prev, next);
    expect(deltas.capital).toBe(-30);
    expect(deltas.reputacion).toBe(15);
    expect(deltas.bienestar).toBeUndefined();
  });

  it('handles edge boundaries cleanly', () => {
    const prev: Metrics = { capital: 0, reputacion: 100, bienestar: 10 };
    const next: Metrics = { capital: 10, reputacion: 90, bienestar: 0 };

    const deltas = computeMetricDeltas(prev, next);
    expect(deltas.capital).toBe(10);
    expect(deltas.reputacion).toBe(-10);
    expect(deltas.bienestar).toBe(-10);
  });
});

describe('getRevealingDuration (A4)', () => {
  it('returns 0 ms if reduced motion is active regardless of event kind', () => {
    expect(getRevealingDuration('crisis', true)).toBe(0);
    expect(getRevealingDuration('unforeseen', true)).toBe(0);
    expect(getRevealingDuration('main', true)).toBe(0);
    expect(getRevealingDuration(undefined, true)).toBe(0);
  });

  it('returns 1000 ms for crisis and unforeseen events', () => {
    expect(getRevealingDuration('crisis', false)).toBe(1000);
    expect(getRevealingDuration('unforeseen', false)).toBe(1000);
  });

  it('returns 350 ms for standard events', () => {
    expect(getRevealingDuration('main', false)).toBe(350);
    expect(getRevealingDuration(undefined, false)).toBe(350);
  });
});

describe('netDecisionEffect', () => {
  const baseEntry: DecisionLogEntry = {
    turn: 1,
    eventId: 'e1',
    eventTitle: 'Evento',
    optionIndex: 0,
    optionText: 'Opción',
    effects: { capital: -10, reputacion: 5 },
  };

  it('returns option effects when there are no modifiers', () => {
    expect(netDecisionEffect(baseEntry)).toEqual({ capital: -10, reputacion: 5, bienestar: undefined });
  });

  it('adds passive tag modifiers and omits metrics that net to zero', () => {
    const entry: DecisionLogEntry = {
      ...baseEntry,
      appliedModifiers: { capital: -2, reputacion: -5, bienestar: -3 },
    };
    expect(netDecisionEffect(entry)).toEqual({ capital: -12, reputacion: undefined, bienestar: -3 });
  });
});

describe('stressLevel', () => {
  const m = (capital: number, reputacion: number, bienestar: number): Metrics => ({ capital, reputacion, bienestar });

  it('is 0 when every metric is at or above 70', () => {
    expect(stressLevel(m(70, 80, 100))).toBe(0);
    expect(stressLevel(m(100, 100, 100))).toBe(0);
  });

  it('is 1 when the lowest metric is at or below 15', () => {
    expect(stressLevel(m(15, 90, 90))).toBe(1);
    expect(stressLevel(m(80, 0, 90))).toBe(1);
  });

  it('interpolates linearly using the lowest metric', () => {
    // (70 - 42.5) / 55 = 0.5
    expect(stressLevel(m(90, 42.5, 60))).toBeCloseTo(0.5, 5);
    expect(stressLevel(m(60, 90, 90))).toBeCloseTo(10 / 55, 5);
  });

  it('stays within 0-1 for any input', () => {
    for (let v = -20; v <= 120; v += 5) {
      const s = stressLevel(m(v, 50, 50));
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
  });
});
