import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSoundPlayer, isSoundEnabled, setSoundEnabled, SOUND_SCORES, type AudioContextLike, type SoundName } from './sound';

const fakeContext = (state = 'running') => {
  const oscillators: { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }[] = [];
  const ctx: AudioContextLike = {
    currentTime: 10,
    state,
    destination: {},
    resume: vi.fn(),
    createOscillator: vi.fn(() => {
      const osc = {
        type: 'sine' as OscillatorType,
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      oscillators.push(osc);
      return osc;
    }),
    createGain: vi.fn(() => ({
      gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    })),
  };
  return { ctx, oscillators };
};

describe('sound preference', () => {
  const store = new Map<string, string>();
  const listeners = new Map<string, Set<(e: unknown) => void>>();

  beforeEach(() => {
    store.clear();
    listeners.clear();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });
    vi.stubGlobal(
      'CustomEvent',
      class {
        type: string;
        constructor(type: string) {
          this.type = type;
        }
      }
    );
    vi.stubGlobal('window', {
      addEventListener: (t: string, cb: (e: unknown) => void) => {
        if (!listeners.has(t)) listeners.set(t, new Set());
        listeners.get(t)!.add(cb);
      },
      removeEventListener: (t: string, cb: (e: unknown) => void) => listeners.get(t)?.delete(cb),
      dispatchEvent: (e: { type: string }) => listeners.get(e.type)?.forEach((cb) => cb(e)),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('is off by default', () => {
    expect(isSoundEnabled()).toBe(false);
  });

  it('persists and notifies when toggled', () => {
    const listener = vi.fn();
    window.addEventListener('el_emprendedor_sound_change', listener);
    setSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    setSoundEnabled(false);
    expect(isSoundEnabled()).toBe(false);
  });

  it('falls back to off if storage throws', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } });
    expect(isSoundEnabled()).toBe(false);
    expect(() => setSoundEnabled(true)).not.toThrow();
  });
});

describe('createSoundPlayer', () => {
  it('never creates an AudioContext while sound is off', () => {
    const getContext = vi.fn();
    const player = createSoundPlayer(getContext, () => false);
    player.play('thud');
    player.prime();
    expect(getContext).not.toHaveBeenCalled();
  });

  it('creates the context once and reuses it', () => {
    const { ctx } = fakeContext();
    const getContext = vi.fn(() => ctx);
    const player = createSoundPlayer(getContext, () => true);
    player.play('select');
    player.play('tickUp');
    expect(getContext).toHaveBeenCalledTimes(1);
  });

  it('schedules one oscillator per note of the score', () => {
    const { ctx, oscillators } = fakeContext();
    const player = createSoundPlayer(() => ctx, () => true);
    player.play('milestone');
    expect(oscillators).toHaveLength(SOUND_SCORES.milestone.length);
    oscillators.forEach((osc) => {
      expect(osc.start).toHaveBeenCalledTimes(1);
      expect(osc.stop).toHaveBeenCalledTimes(1);
    });
  });

  it('resumes a suspended context (autoplay policy)', () => {
    const { ctx } = fakeContext('suspended');
    createSoundPlayer(() => ctx, () => true).play('select');
    expect(ctx.resume).toHaveBeenCalled();
  });

  it('survives a browser without WebAudio or a context that throws', () => {
    expect(() => createSoundPlayer(() => null, () => true).play('thud')).not.toThrow();
    const throwing = createSoundPlayer(() => { throw new Error('no audio'); }, () => true);
    expect(() => throwing.play('thud')).not.toThrow();
  });

  it('stops playing right away if sound is switched off', () => {
    const { ctx, oscillators } = fakeContext();
    let on = true;
    const player = createSoundPlayer(() => ctx, () => on);
    player.play('select');
    on = false;
    player.play('select');
    expect(oscillators).toHaveLength(SOUND_SCORES.select.length);
  });
});

describe('SOUND_SCORES', () => {
  it.each(Object.entries(SOUND_SCORES) as [SoundName, (typeof SOUND_SCORES)[SoundName]][])('%s has valid notes and stays short', (_, notes) => {
    expect(notes.length).toBeGreaterThan(0);
    notes.forEach((n) => {
      expect(n.freq).toBeGreaterThan(20);
      expect(n.dur).toBeGreaterThan(0);
      expect(n.gain).toBeGreaterThan(0);
      expect(n.gain).toBeLessThanOrEqual(1);
      expect(n.at + n.dur).toBeLessThan(1.2);
    });
  });
});
