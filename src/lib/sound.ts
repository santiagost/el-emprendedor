import { useCallback, useEffect, useState } from 'react';

/**
 * Sonido mínimo (Sprint 2 · A3): efectos sintetizados con WebAudio, sin archivos ni dependencias.
 * Arranca APAGADO y se activa con SoundToggle. Con el sonido apagado no se crea ningún AudioContext.
 */

export type SoundName = 'select' | 'tickUp' | 'tickDown' | 'thud' | 'stamp' | 'heartbeat' | 'reveal' | 'milestone' | 'phase';

export interface ToneStep {
  /** Segundos desde el inicio del sonido. */
  at: number;
  freq: number;
  dur: number;
  type: OscillatorType;
  /** Volumen relativo (0-1) antes del volumen maestro. */
  gain: number;
  /** Si está, la frecuencia se desliza hasta este valor durante la nota. */
  slideTo?: number;
}

const MASTER_GAIN = 0.18;

export const SOUND_SCORES: Record<SoundName, ToneStep[]> = {
  select: [{ at: 0, freq: 520, dur: 0.06, type: 'triangle', gain: 0.6 }],
  tickUp: [{ at: 0, freq: 740, dur: 0.05, type: 'sine', gain: 0.5 }],
  tickDown: [{ at: 0, freq: 330, dur: 0.07, type: 'sine', gain: 0.5 }],
  thud: [
    { at: 0, freq: 110, dur: 0.22, type: 'sine', gain: 1, slideTo: 45 },
    { at: 0, freq: 70, dur: 0.18, type: 'triangle', gain: 0.6, slideTo: 40 },
  ],
  stamp: [
    { at: 0, freq: 160, dur: 0.14, type: 'square', gain: 0.55, slideTo: 60 },
    { at: 0.03, freq: 90, dur: 0.25, type: 'sine', gain: 0.9, slideTo: 40 },
  ],
  heartbeat: [
    { at: 0, freq: 80, dur: 0.12, type: 'sine', gain: 0.9, slideTo: 50 },
    { at: 0.2, freq: 70, dur: 0.14, type: 'sine', gain: 0.7, slideTo: 45 },
    { at: 0.7, freq: 85, dur: 0.12, type: 'sine', gain: 1, slideTo: 50 },
    { at: 0.9, freq: 75, dur: 0.14, type: 'sine', gain: 0.8, slideTo: 45 },
  ],
  reveal: [
    { at: 0, freq: 392, dur: 0.5, type: 'triangle', gain: 0.5 },
    { at: 0, freq: 494, dur: 0.5, type: 'triangle', gain: 0.4 },
    { at: 0, freq: 587, dur: 0.5, type: 'triangle', gain: 0.35 },
  ],
  milestone: [
    { at: 0, freq: 659, dur: 0.12, type: 'triangle', gain: 0.6 },
    { at: 0.1, freq: 784, dur: 0.12, type: 'triangle', gain: 0.6 },
    { at: 0.2, freq: 1047, dur: 0.3, type: 'triangle', gain: 0.6 },
  ],
  phase: [
    { at: 0, freq: 523, dur: 0.15, type: 'triangle', gain: 0.55 },
    { at: 0.14, freq: 659, dur: 0.15, type: 'triangle', gain: 0.55 },
    { at: 0.28, freq: 784, dur: 0.15, type: 'triangle', gain: 0.55 },
    { at: 0.42, freq: 1047, dur: 0.4, type: 'triangle', gain: 0.6 },
  ],
};

// --- Preferencia guardada (mismo patrón que el toggle de efectos) ---

export const SOUND_STORAGE_KEY = 'el_emprendedor_sound_enabled';
export const SOUND_CHANGE_EVENT = 'el_emprendedor_sound_change';

/** Apagado salvo que el jugador lo haya activado. */
export const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // sin storage: la preferencia vale solo para esta sesión
  }
  window.dispatchEvent(new CustomEvent(SOUND_CHANGE_EVENT, { detail: enabled }));
};

// --- Reproductor ---

/** Subconjunto de AudioContext que usamos (permite inyectar uno falso en los tests). */
export interface AudioContextLike {
  currentTime: number;
  state: string;
  destination: unknown;
  resume: () => Promise<void> | void;
  createOscillator: () => {
    type: OscillatorType;
    frequency: { setValueAtTime: (v: number, t: number) => void; exponentialRampToValueAtTime: (v: number, t: number) => void };
    connect: (n: unknown) => void;
    start: (t: number) => void;
    stop: (t: number) => void;
  };
  createGain: () => {
    gain: { setValueAtTime: (v: number, t: number) => void; linearRampToValueAtTime: (v: number, t: number) => void; exponentialRampToValueAtTime: (v: number, t: number) => void };
    connect: (n: unknown) => void;
  };
}

export function createSoundPlayer(getContext: () => AudioContextLike | null, isEnabled: () => boolean) {
  let ctx: AudioContextLike | null = null;

  const ensureContext = (): AudioContextLike | null => {
    if (!ctx) {
      try {
        ctx = getContext();
      } catch {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') void ctx.resume();
    return ctx;
  };

  /** Crea el contexto sin sonar (se llama desde el gesto que activa el sonido). */
  const prime = (): void => {
    if (isEnabled()) ensureContext();
  };

  const play = (name: SoundName): void => {
    if (!isEnabled()) return;
    const audio = ensureContext();
    if (!audio) return;
    const start = audio.currentTime;
    SOUND_SCORES[name].forEach((step) => {
      const t0 = start + step.at;
      const osc = audio.createOscillator();
      const amp = audio.createGain();
      osc.type = step.type;
      osc.frequency.setValueAtTime(step.freq, t0);
      if (step.slideTo) osc.frequency.exponentialRampToValueAtTime(step.slideTo, t0 + step.dur);
      amp.gain.setValueAtTime(0.0001, t0);
      amp.gain.linearRampToValueAtTime(step.gain * MASTER_GAIN, t0 + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + step.dur);
      osc.connect(amp);
      amp.connect(audio.destination);
      osc.start(t0);
      osc.stop(t0 + step.dur + 0.02);
    });
  };

  return { play, prime };
}

const player = createSoundPlayer(() => {
  const Ctor =
    typeof window !== 'undefined'
      ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
      : undefined;
  return Ctor ? (new Ctor() as unknown as AudioContextLike) : null;
}, isSoundEnabled);

export const playSound = player.play;
export const primeSound = player.prime;

/** Estado del toggle de sonido; activarlo crea el AudioContext dentro del gesto y confirma con un tick. */
export function useSoundToggle(): { soundEnabled: boolean; toggleSound: () => void } {
  const [soundEnabled, setState] = useState<boolean>(() => isSoundEnabled());

  useEffect(() => {
    const sync = () => setState(isSoundEnabled());
    window.addEventListener(SOUND_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SOUND_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const next = !isSoundEnabled();
    setSoundEnabled(next);
    if (next) {
      primeSound();
      playSound('select');
    }
  }, []);

  return { soundEnabled, toggleSound };
}
