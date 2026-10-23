import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Handshake, ChevronLeft, ChevronRight } from 'lucide-react';
import MinigameShell from './MinigameShell';
import { playSound } from '../../../lib/sound';
import { vibrate } from '../../../lib/fx';
import {
  BALANCE_DURATION_MS,
  balancePerformance,
  buildBalance,
  holdInput,
  inZone,
  pressure,
  stepBalance,
  targetCenter,
  type BalanceState,
} from '../../../game/minigames/balance';
import { PERFORMANCE_LABEL } from '../../../game/minigames/performance';
import type { Performance } from '../../../types/game';

interface NegotiationGameProps {
  seed: number;
  /** Reputación actual: con poca, el rango aceptable es más angosto. */
  reputation: number;
  title?: string;
  rule?: string;
  onResolve: (performance: Performance) => void;
  onSkip: () => void;
}

const RESULT_HOLD_MS = 1200;

const RESULT_TEXT: Record<Performance, string> = {
  perfect: 'Cerraste un acuerdo muy favorable.',
  good: 'Llegaron a un acuerdo razonable.',
  poor: 'Cedieron más de lo que convenía.',
};

/**
 * Negociación: mantener el cursor dentro de un rango móvil mientras la contraparte empuja hacia un lado.
 * Estado físico en refs y actualización por DOM en rAF (sin setState por frame).
 */
export default function NegotiationGame({ seed, reputation, title, rule, onResolve, onSkip }: NegotiationGameProps) {
  return (
    <MinigameShell
      title={title ?? 'Negociación'}
      rule={rule ?? 'Mantené el cursor dentro del rango aceptable mientras la otra parte empuja. Cuanto más tiempo mantengas apretado un botón (o las teclas A / D o las flechas), más fuerte empujás.'}
      icon={<Handshake className="w-4 h-4" aria-hidden="true" />}
      onSkip={onSkip}
    >
      {(running, assisted) => (
        <NegotiationBoard running={running} assisted={assisted} seed={seed} reputation={reputation} onResolve={onResolve} />
      )}
    </MinigameShell>
  );
}

function NegotiationBoard({
  running,
  assisted,
  seed,
  reputation,
  onResolve,
}: {
  running: boolean;
  assisted: boolean;
  seed: number;
  reputation: number;
  onResolve: (performance: Performance) => void;
}) {
  const params = useMemo(() => buildBalance(seed, reputation, assisted), [seed, reputation, assisted]);
  const trackRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeInZoneRef = useRef<HTMLDivElement>(null);
  const leftPushRef = useRef<HTMLSpanElement>(null);
  const rightPushRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<BalanceState>({ pos: 0.5, vel: 0 });
  // Fuentes de control: instante en que se empezó a apretar cada lado (botón o tecla) y dedo sobre la barra (posición objetivo o null)
  const holdRef = useRef<{ left: number | null; right: number | null }>({ left: null, right: null });
  const dragRef = useRef<number | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const resolvedRef = useRef(false);

  const paint = useCallback(
    (tMs: number, fraction: number, inside: boolean) => {
      const center = targetCenter(params, tMs);
      if (zoneRef.current) {
        zoneRef.current.style.left = `${(center - params.width / 2) * 100}%`;
        zoneRef.current.style.width = `${params.width * 100}%`;
      }
      if (cursorRef.current) {
        cursorRef.current.style.left = `${stateRef.current.pos * 100}%`;
        cursorRef.current.dataset.inside = inside ? 'true' : 'false';
      }
      if (timeInZoneRef.current) timeInZoneRef.current.style.width = `${fraction * 100}%`;
      if (statusRef.current) statusRef.current.textContent = inside ? 'Dentro del rango' : 'Fuera del rango';
      const push = pressure(params, tMs);
      if (leftPushRef.current) leftPushRef.current.style.opacity = String(Math.max(0.15, -push));
      if (rightPushRef.current) rightPushRef.current.style.opacity = String(Math.max(0.15, push));
    },
    [params]
  );

  useEffect(() => {
    paint(0, 0, inZone(stateRef.current.pos, 0, params));
  }, [paint, params]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last: number | null = null;
    let t = 0;
    let insideMs = 0;
    let wasInside = true;
    const loop = (now: number) => {
      const dt = last === null ? 0 : Math.min(50, now - last);
      last = now;
      const hold = holdRef.current;
      // La fuerza crece con el tiempo que llevás apretando
      let input = (hold.right === null ? 0 : holdInput(now - hold.right)) - (hold.left === null ? 0 : holdInput(now - hold.left));
      if (dragRef.current !== null) input = (dragRef.current - stateRef.current.pos) * 6;
      stateRef.current = stepBalance(stateRef.current, input, t, dt, params);
      t = Math.min(BALANCE_DURATION_MS, t + dt);
      const inside = inZone(stateRef.current.pos, t, params);
      if (inside) insideMs += dt;
      if (inside !== wasInside) {
        wasInside = inside;
        playSound(inside ? 'tickUp' : 'tickDown');
        if (!inside) vibrate(15);
      }
      paint(t, insideMs / BALANCE_DURATION_MS, inside);
      if (t >= BALANCE_DURATION_MS) {
        setPerformance(balancePerformance(insideMs / BALANCE_DURATION_MS));
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, params, paint]);

  // Teclado: flechas o A / D
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      const side = k === 'arrowleft' || k === 'a' ? 'left' : k === 'arrowright' || k === 'd' ? 'right' : null;
      if (!side) return;
      e.preventDefault();
      if (down) {
        if (holdRef.current[side] === null) holdRef.current[side] = window.performance.now();
      } else {
        holdRef.current[side] = null;
      }
    };
    const onDown = (e: KeyboardEvent) => set(e, true);
    const onUp = (e: KeyboardEvent) => set(e, false);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useEffect(() => {
    if (!performance || resolvedRef.current) return;
    playSound(performance === 'poor' ? 'thud' : 'stamp');
    const id = setTimeout(() => {
      resolvedRef.current = true;
      onResolve(performance);
    }, RESULT_HOLD_MS);
    return () => clearTimeout(id);
  }, [performance, onResolve]);

  const release = (side: 'left' | 'right') => {
    holdRef.current[side] = null;
  };
  const holdProps = (side: 'left' | 'right') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      holdRef.current[side] = window.performance.now();
    },
    onPointerUp: () => release(side),
    onPointerLeave: () => release(side),
    onPointerCancel: () => release(side),
  });

  const dragTo = (e: React.PointerEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    dragRef.current = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const disabled = !running || performance !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-2xs font-semibold text-slate-500 dark:text-slate-400" aria-hidden="true">
        <span>Presión de la otra parte</span>
        <span className="inline-flex items-center gap-0.5 text-brand-navy dark:text-slate-200">
          <span ref={leftPushRef} className="inline-block"><ChevronLeft className="w-4 h-4" /></span>
          <span ref={rightPushRef} className="inline-block"><ChevronRight className="w-4 h-4" /></span>
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-14 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 overflow-hidden touch-none select-none"
        onPointerDown={(e) => {
          if (disabled) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          dragTo(e);
        }}
        onPointerMove={(e) => {
          if (dragRef.current !== null) dragTo(e);
        }}
        onPointerUp={() => {
          dragRef.current = null;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
        aria-hidden="true"
      >
        <div
          ref={zoneRef}
          className="absolute inset-y-0 border-x-2 border-emerald-600/70 dark:border-emerald-400/70 bg-emerald-500/20"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(5,150,105,0.28) 0 6px, transparent 6px 12px)' }}
        />
        <div
          ref={cursorRef}
          data-inside="true"
          className="absolute inset-y-1 w-3 -ml-1.5 rounded-full bg-brand-navy dark:bg-white shadow-[0_0_8px_rgba(0,82,204,0.6)] data-[inside=false]:bg-rose-600 dark:data-[inside=false]:bg-rose-400"
          style={{ left: '50%' }}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-2xs font-semibold text-slate-500 dark:text-slate-400">
          <span ref={statusRef} aria-live="off">Dentro del rango</span>
          <span>Tiempo en el rango</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-900/80 overflow-hidden">
          <div ref={timeInZoneRef} className="h-full w-0 bg-emerald-500 dark:bg-emerald-400" />
        </div>
      </div>

      <p className="min-h-5 text-center text-sm font-bold" aria-live="polite">
        {performance ? (
          <span className="text-brand-navy dark:text-white">
            {PERFORMANCE_LABEL[performance]} · <span className="font-medium">{RESULT_TEXT[performance]}</span>
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            {running ? 'Mantené apretado: cuanto más tiempo, más fuerte empujás' : ' '}
          </span>
        )}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {(['left', 'right'] as const).map((side) => (
          <button
            key={side}
            type="button"
            disabled={disabled}
            {...holdProps(side)}
            className="py-4 px-4 bg-brand-navy hover:bg-brand-cobalt active:bg-brand-navy-press dark:bg-brand-cobalt dark:hover:bg-brand-cobalt-hover disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors touch-none select-none inline-flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50"
          >
            {side === 'left' ? <ChevronLeft className="w-4 h-4" aria-hidden="true" /> : null}
            {side === 'left' ? 'Izquierda' : 'Derecha'}
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white/15 px-1.5 py-0.5 text-2xs font-semibold" aria-hidden="true">
              {side === 'left' ? 'A / ←' : 'D / →'}
            </kbd>
            {side === 'right' ? <ChevronRight className="w-4 h-4" aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
