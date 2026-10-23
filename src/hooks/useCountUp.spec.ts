import { describe, it, expect } from 'vitest';
import { easeOutCubic, interpolateCount } from './useCountUp';

describe('useCountUp interpolation and easing', () => {
  it('easeOutCubic starts at 0, ends at 1, and reaches ~0.875 at midpoint t=0.5', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    // At t=0.5: 1 - (1 - 0.5)^3 = 1 - 0.125 = 0.875
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 4);
    // Clamping:
    expect(easeOutCubic(-0.2)).toBe(0);
    expect(easeOutCubic(1.5)).toBe(1);
  });

  it('interpolateCount calculates smooth integer values between start and target', () => {
    // Going up: 50 -> 80
    expect(interpolateCount(50, 80, 0, 700)).toBe(50);
    expect(interpolateCount(50, 80, 350, 700)).toBe(76); // 50 + 30 * 0.875 = 76.25 -> 76
    expect(interpolateCount(50, 80, 700, 700)).toBe(80);
    expect(interpolateCount(50, 80, 1000, 700)).toBe(80);

    // Going down: 60 -> 40
    expect(interpolateCount(60, 40, 0, 700)).toBe(60);
    expect(interpolateCount(60, 40, 350, 700)).toBe(43); // 60 - 20 * 0.875 = 42.5 -> 43
    expect(interpolateCount(60, 40, 700, 700)).toBe(40);
  });

  it('interpolateCount immediately returns targetValue if duration is 0 or less', () => {
    expect(interpolateCount(50, 100, 0, 0)).toBe(100);
    expect(interpolateCount(50, 100, 10, -50)).toBe(100);
  });
});
