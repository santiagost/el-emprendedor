import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Bug, Heart } from 'lucide-react';
import MinigameShell from './MinigameShell';
import { playSound } from '../../../lib/sound';
import { vibrate } from '../../../lib/fx';
import {
  advance,
  appearedCount,
  createTapping,
  isTappingFinished,
  squashBug,
  tappingPerformance,
  visibleBugs,
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
  perfect: 'Casi no se te escapó ninguno.',
  good: 'Apagaste la mayoría de los incendios.',
  poor: 'Se te acumularon los bugs.',
};

/**
 * Crunch nocturno: aparecen bugs en la entrega, duran poco y hay que tocarlos. Cada vez salen más seguidos.
 * El estado vive en un ref; React solo re-renderiza cuando aparece o se va un bicho.
 */
export default function CrunchGame({ seed, title, rule, onResolve, onSkip }: CrunchGameProps) {
  return (
    <MinigameShell
      title={title ?? 'Crunch nocturno'}
      rule={rule ?? 'Salen bugs en la entrega y se van solos en poco tiempo: tocá (o hacé clic en) cada uno para eliminarlo. Cuantos más elimines, mejor sale.'}
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
  // En pantallas táctiles se juega con dos dedos: más bugs y menos tiempo
  const [touch] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true);
  const stateRef = useRef(createTapping(seed, assisted, touch));
  const progressRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const [bugs, setBugs] = useState<TappingBug[]>([]);
  const [counts, setCounts] = useState({ squashed: 0, appeared: 0 });
  const [performance, setPerformance] = useState<Performance | null>(null);
  const resolvedRef = useRef(false);

  const sync = useCallback(() => {
    const s = stateRef.current;
    if (progressRef.current) progressRef.current.style.width = `${(s.squashed.length / s.bugs.length) * 100}%`;
    setCounts((c) =>
      c.squashed === s.squashed.length && c.appeared === appearedCount(s) ? c : { squashed: s.squashed.length, appeared: appearedCount(s) }
    );
  }, []);

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
      const visible = visibleBugs(stateRef.current);
      const key = visible.map((b) => b.id).join(',');
      if (key !== shown) {
        shown = key;
        setBugs(visible);
        sync();
      }
      if (isTappingFinished(stateRef.current)) {
        setBugs([]);
        sync();
        setPerformance(tappingPerformance(stateRef.current));
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, sync]);

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
    // El corazón late con cada bug: el costo en Bienestar se ve
    const heart = heartRef.current;
    if (heart) {
      heart.style.transform = 'scale(1.5)';
      setTimeout(() => {
        if (heartRef.current) heartRef.current.style.transform = '';
      }, 140);
    }
    setBugs(visibleBugs(stateRef.current));
    sync();
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>
            Bugs eliminados · <span className="tabular-nums">{counts.squashed} de {counts.appeared} aparecidos</span>
          </span>
          <span aria-hidden="true" className="inline-flex items-center gap-1">
            <span ref={heartRef} className="inline-block transition-transform duration-100 text-rose-500">
              <Heart className="w-3.5 h-3.5" />
            </span>
            Bienestar en juego
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div ref={progressRef} className="h-full w-0 bg-emerald-500 dark:bg-emerald-400 transition-[width] duration-150" />
        </div>
      </div>

      {/* Arena de bugs */}
      <div className="relative h-48 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 overflow-hidden touch-manipulation select-none">
        {bugs.map((b) => (
          <button
            key={b.id}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              squash(b.id);
            }}
            aria-label="Eliminar el bug"
            className="absolute -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/70 border-2 border-rose-500 text-rose-700 dark:text-rose-300 shadow-md cursor-pointer touch-manipulation select-none stage-stamp"
            style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%` }}
          >
            <Bug className="w-5 h-5" aria-hidden="true" />
          </button>
        ))}
        {bugs.length === 0 && !performance && (
          <p className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-400 dark:text-slate-500">
            {running ? 'Esperá… ya aparece el primero' : ' '}
          </p>
        )}
      </div>

      <p className="min-h-5 text-center text-sm font-bold" aria-live="polite">
        {performance ? (
          <span className="text-[#0A2540] dark:text-white">
            {PERFORMANCE_LABEL[performance]} · <span className="font-medium">{RESULT_TEXT[performance]}</span>
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{running ? 'Tocá los bugs antes de que se vayan' : ' '}</span>
        )}
      </p>
    </div>
  );
}
