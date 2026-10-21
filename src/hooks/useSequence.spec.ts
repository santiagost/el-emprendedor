import { describe, it, expect } from 'vitest';
import { getStepAtTime, type SequenceStep } from './useSequence';

describe('useSequence logic (A3)', () => {
  const steps: SequenceStep[] = [
    { at: 0 },    // Paso 0: Deltas
    { at: 700 },  // Paso 1: Consecuencia
    { at: 1500 }, // Paso 2: Concepto clave y fin
  ];

  it('handles empty steps cleanly', () => {
    const res = getStepAtTime([], 100);
    expect(res.step).toBe(0);
    expect(res.isCompleted).toBe(true);
  });

  it('reports step 0 at beginning of sequence', () => {
    const res = getStepAtTime(steps, 0);
    expect(res.step).toBe(0);
    expect(res.isCompleted).toBe(false);
  });

  it('reports step 0 before step 1 trigger', () => {
    const res = getStepAtTime(steps, 699);
    expect(res.step).toBe(0);
    expect(res.isCompleted).toBe(false);
  });

  it('reports step 1 at and after its trigger time', () => {
    const at700 = getStepAtTime(steps, 700);
    expect(at700.step).toBe(1);
    expect(at700.isCompleted).toBe(false);

    const at1200 = getStepAtTime(steps, 1200);
    expect(at1200.step).toBe(1);
    expect(at1200.isCompleted).toBe(false);
  });

  it('reports step 2 and isCompleted = true at final step', () => {
    const at1500 = getStepAtTime(steps, 1500);
    expect(at1500.step).toBe(2);
    expect(at1500.isCompleted).toBe(true);

    const at3000 = getStepAtTime(steps, 3000);
    expect(at3000.step).toBe(2);
    expect(at3000.isCompleted).toBe(true);
  });
});
