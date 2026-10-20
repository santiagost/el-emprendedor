import { describe, it, expect } from 'vitest';
import { computeMetricDeltas } from './ui';
import type { Metrics } from '../types/game';

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
