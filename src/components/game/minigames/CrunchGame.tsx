import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Bug, Heart } from 'lucide-react';
import MinigameShell from './MinigameShell';
import { playSound } from '../../../lib/sound';
import { vibrate } from '../../../lib/fx';
import {
  advance,
  createTapping,
  isTappingFinished,
  squashBug,
  tap,
  tappingPerformance,
  visibleBugs,
  TAPPING_DURATION_MS,
  type TappingBug,
} from '../../../game/minigames/tapping';
import { PERFORMANCE_LABEL } from '../../../game/minigames/performance';
import type { Performance } from '../../../types/game';

interface CrunchGameProps {
  seed: number;
  title?: string;
  rule?: string;
  onResolve: (performance: Performance) => void;
  onSkip: () => void;
}

const RESULT_HOLD_MS = 1200;

const RESULT_TEXT: Record<Performance, string> = {
  perfect: 'Entregaste con tiempo de sobra.',
  good: 'Llegaste justo.',
  poor: 'No llegaste a tiempo.',
};

/**
 * Crunch nocturno: tocar rápido para llenar la entrega antes de que se acabe el tiempo.
 * El estado vive en un ref y las barras se actualizan por DOM en rAF; React solo re-renderiza al aparecer o irse un bicho.
 */
export default function CrunchGame({ seed, title, rule, onResolve, onSkip }: CrunchGameProps) {
  return (
    <MinigameShell
      title={title ?? 'Crunch nocturno'}
      rule={rule ?? 'Tocá lo más rápido que puedas para llenar la entrega antes de que se acabe el tiempo. Pasado el 70 % cada toque rinde menos.'}
      icon={<Moon className="w-4 h-4" aria-hidden="true" />}
      onSkip={onSkip}
    >
      {(running, assisted) => <CrunchBoard running={running} assisted={assisted} seed={seed} onResolve={onResolve} />}
    </MinigameShell>
  );
}

function CrunchBoard({
  running,
  assisted,
  seed,
  onResolve,
}: {
  running: boolean;
  assisted: boolean;
  seed: number;
  onResolve: (performance: Performance) => void;
}) {
  const stateRef = useRef(createTapping(seed));
  const progressRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const [bugs, setBugs] = useState<TappingBug[]>([]);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const resolvedRef = useRef(false);

  const sync = useCallback(() => {
    const s = stateRef.current;
    if (progressRef.current) progressRef.current.style.width = `${s.progress * 100}%`;
    if (timeRef.current) timeRef.current.style.width = `${(1 - s.elapsedMs / TAPPING_DURATION_MS) * 100}%`;
  }, []);

  const finishIfDone = useCallback(() => {
    if (isTappingFinished(stateRef.current)) setPerformance(tappingPerformance(stateRef.current));
  }, []);

  const doTap = useCallback(() => {
    if (!running || isTappingFinished(stateRef.current)) return;
    stateRef.current = tap(stateRef.current, assisted);
    playSound('tickUp');
    vibrate(8);
    // El corazón late más fuerte con cada toque: el costo en Bienestar se ve
    const heart = heartRef.current;
    if (heart) {
      heart.style.transform = `scale(${1 + Math.min(0.6, stateRef.current.taps * 0.04)})`;
      heart.style.color = '';
    }
    sync();
    finishIfDone();
  }, [running, assisted, sync, finishIfDone]);

  // Bucle de tiempo
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last: number | null = null;
    let shown = '';
    const loop = (now: number) => {
      const dt = last === null ? 0 : Math.min(50, now - last);
      last = now;
      stateRef.current = advance(stateRef.current, dt);
      sync();
      const visible = visibleBugs(stateRef.current);
      const key = visible.map((b) => b.id).join(',');
      if (key !== shown) {
        shown = key;
        setBugs(visible);
      }
      if (isTappingFinished(stateRef.current)) {
        setBugs([]);
        finishIfDone();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, sync, finishIfDone]);

  // Espacio / Enter también tocan (sin auto-repeat)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        doTap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doTap]);

  useEffect(() => {
    if (!performance || resolvedRef.current) return;
    playSound(performance === 'poor' ? 'thud' : 'stamp');
    const id = setTimeout(() => {
      resolvedRef.current = true;
      onResolve(performance);
    }, RESULT_HOLD_MS);
    return () => clearTimeout(id);
  }, [performance, onResolve]);

  const squash = (id: number) => {
    stateRef.current = squashBug(stateRef.current, id);
    playSound('select');
    vibrate(12);
    setBugs(visibleBugs(stateRef.current));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>Entrega</span>
          <span aria-hidden="true" className="inline-flex items-center gap-1">
            <span ref={heartRef} className="inline-block transition-transform duration-100 text-rose-500">
              <Heart className="w-3.5 h-3.5" />
            </span>
            Bienestar en juego
          </span>
        </div>
        <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div ref={progressRef} className="h-full w-0 bg-emerald-500 dark:bg-emerald-400" />
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-900/80 overflow-hidden" aria-label="Tiempo restante">
          <div ref={timeRef} className="h-full w-full bg-[#0052CC] dark:bg-indigo-400" />
        </div>
      </div>

      {/* Arena de bichos */}
      <div className="relative h-24 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
        {bugs.map((b) => (
          <button
            key={b.id}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              squash(b.id);
            }}
            aria-label="Aplastar el bicho"
            className="absolute -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/70 border-2 border-rose-500 text-rose-700 dark:text-rose-300 shadow-md touch-manipulation select-none stage-stamp"
            style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%` }}
          >
            <Bug className="w-5 h-5" aria-hidden="true" />
          </button>
        ))}
        {bugs.length === 0 && !performance && (
          <p className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-400 dark:text-slate-500">
            {running ? 'Si aparece un bicho, tocalo antes de que se te pase' : ' '}
          </p>
        )}
      </div>

      <p className="min-h-5 text-center text-sm font-bold" aria-live="polite">
        {performance ? (
          <span className="text-[#0A2540] dark:text-white">
            {PERFORMANCE_LABEL[performance]} · <span className="font-medium">{RESULT_TEXT[performance]}</span>
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{running ? 'Espacio, clic o toque para empujar' : ' '}</span>
        )}
      </p>

      <button
        type="button"
        disabled={!running || performance !== null}
        onPointerDown={(e) => {
          e.preventDefault();
          doTap();
        }}
        className="w-full py-6 px-4 bg-[#0A2540] hover:bg-[#0052CC] active:bg-[#081c30] active:scale-[0.99] dark:bg-[#0052CC] dark:hover:bg-[#0047b3] disabled:opacity-50 text-white font-bold text-base rounded-xl transition-colors touch-manipulation select-none focus:outline-none focus:ring-2 focus:ring-[#0052CC]/50"
      >
        Empujar (Espacio)
      </button>
    </div>
  );
}
