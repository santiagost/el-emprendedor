import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { prefersReducedMotion, isFxEnabled, setFxEnabled, syncReducedMotionClass } from './motion';
import { vibrate, confetti } from './fx';
import canvasConfetti from 'canvas-confetti';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('motion and fx library (A0 & A1)', () => {
  let mockStore: Record<string, string> = {};
  const mockClassList = new Set<string>();

  beforeEach(() => {
    mockStore = {};
    mockClassList.clear();

    const mockLocalStorage = {
      getItem: (key: string) => mockStore[key] ?? null,
      setItem: (key: string, val: string) => {
        mockStore[key] = val;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
    };

    // Mock document
    vi.stubGlobal('document', {
      documentElement: {
        classList: {
          add: (cls: string) => mockClassList.add(cls),
          remove: (cls: string) => mockClassList.delete(cls),
          contains: (cls: string) => mockClassList.has(cls),
        },
      },
    });

    // Mock window and localStorage
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.stubGlobal('localStorage', mockLocalStorage);

    vi.stubGlobal('navigator', {
      vibrate: vi.fn(),
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('isFxEnabled returns true by default and can be toggled', () => {
    expect(isFxEnabled()).toBe(true);
    setFxEnabled(false);
    expect(isFxEnabled()).toBe(false);
    setFxEnabled(true);
    expect(isFxEnabled()).toBe(true);
  });

  it('prefersReducedMotion returns true if fx is disabled', () => {
    setFxEnabled(false);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('syncReducedMotionClass adds and removes reduced-motion class on document.documentElement', () => {
    setFxEnabled(false);
    expect(syncReducedMotionClass()).toBe(true);
    expect(mockClassList.has('reduced-motion')).toBe(true);

    setFxEnabled(true);
    expect(syncReducedMotionClass()).toBe(false);
    expect(mockClassList.has('reduced-motion')).toBe(false);
  });

  it('vibrate does nothing if reduced motion is preferred', () => {
    setFxEnabled(false);
    vibrate(100);
    expect(navigator.vibrate).not.toHaveBeenCalled();
  });

  it('vibrate calls navigator.vibrate when fx is enabled and no reduced motion', () => {
    setFxEnabled(true);
    vibrate(100);
    expect(navigator.vibrate).toHaveBeenCalledWith(100);
  });

  it('confetti does nothing if reduced motion is preferred', () => {
    setFxEnabled(false);
    confetti('gold');
    expect(canvasConfetti).not.toHaveBeenCalled();
  });

  it('confetti triggers canvasConfetti when fx is enabled', () => {
    setFxEnabled(true);
    confetti('victory');
    expect(canvasConfetti).toHaveBeenCalledWith(
      expect.objectContaining({
        particleCount: 90,
      })
    );
  });
});
