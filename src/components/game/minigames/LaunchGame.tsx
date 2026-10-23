import { useEffect, useMemo, useRef, useState } from 'react';
import { Rocket, CheckCircle2, AlertTriangle, XOctagon } from 'lucide-react';
import MinigameShell from './MinigameShell';
import { playSound } from '../../../lib/sound';
import { vibrate } from '../../../lib/fx';
import {
  SEGMENT_ORDER,
  computeSegments,
  performanceFromOutcome,
  planSpin,
  stopSpin,
  angleAt,
  SPIN_AUTO_STOP_MS,
  segmentArcs,
  type RouletteOutcome,
} from '../../../game/minigames/roulette';
import { PERFORMANCE_LABEL } from '../../../game/minigames/performance';
import type { Tag } from '../../../data/tags';
import type { Performance } from '../../../types/game';

interface LaunchGameProps {
  seed: number;
  activeTags: readonly Tag[];
  riskBias?: number;
  title?: string;
  rule?: string;
  onResolve: (performance: Performance) => void;
  onSkip: () => void;
}

const RESULT_HOLD_MS = 1300;

const OUTCOME_META: Record<RouletteOutcome, { label: string; text: string; fill: string; Icon: typeof CheckCircle2 }> = {
  success: { label: 'Éxito', text: 'Salió limpio.', fill: 'url(#seg-success)', Icon: CheckCircle2 },
  minor: { label: 'Bug leve', text: 'Salió con algún bug.', fill: 'url(#seg-minor)', Icon: AlertTriangle },
  critical: { label: 'Fallo crítico', text: 'Salió con un fallo serio.', fill: 'url(#seg-critical)', Icon: XOctagon },
};

/** Punto del círculo (radio r) a `deg` grados horarios desde arriba, en coordenadas SVG centradas. */
const polar = (deg: number, r: number): [number, number] => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [Math.cos(rad) * r, Math.sin(rad) * r];
};

const arcPath = (from: number, to: number, r = 90): string => {
  const [x1, y1] = polar(from, r);
  const [x2, y2] = polar(to, r);
  const large = to - from > 180 ? 1 : 0;
  return `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
};

/**
 * Lanzamiento beta: una ruleta que gira sin parar con tres segmentos cuyo tamaño sale de lo que hiciste antes.
 * El jugador la frena en seco y el desenlace es el segmento que queda bajo la flecha: el tamaño es la dificultad, la puntería es suya.
 */
export default function LaunchGame({ seed, activeTags, riskBias, title, rule, onResolve, onSkip }: LaunchGameProps) {
  return (
    <MinigameShell
      title={title ?? 'Lanzamiento beta'}
      rule={rule ?? 'La ruleta gira sin parar. Tocá para frenarla: el resultado es el color que queda bajo la flecha de arriba.'}
      icon={<Rocket className="w-4 h-4" aria-hidden="true" />}
      onSkip={onSkip}
    >
      {(running, assisted) => <LaunchBoard running={running} assisted={assisted} seed={seed} activeTags={activeTags} riskBias={riskBias} onResolve={onResolve} />}
    </MinigameShell>
  );
}

function LaunchBoard({
  running,
  assisted,
  seed,
  activeTags,
  riskBias,
  onResolve,
}: {
  running: boolean;
  assisted: boolean;
  seed: number;
  activeTags: readonly Tag[];
  riskBias?: number;
  onResolve: (performance: Performance) => void;
}) {
  const { segments, reasons } = useMemo(() => computeSegments(activeTags, riskBias), [activeTags, riskBias]);
  const arcs = useMemo(() => segmentArcs(segments), [segments]);
  const plan = useMemo(() => planSpin(seed, assisted), [seed, assisted]);

  const wheelRef = useRef<SVGGElement>(null);
  const startedAtRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);
  const [outcome, setOutcome] = useState<RouletteOutcome | null>(null);
  const resolvedRef = useRef(false);
  const spinning = running && outcome === null;

  const stopAt = (elapsed: number) => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    const result = stopSpin(plan, segments, elapsed);
    if (wheelRef.current) wheelRef.current.style.transform = `rotate(${-result.wheelAngle}deg)`;
    playSound('select');
    vibrate(20);
    setOutcome(result.outcome);
  };

  // Gira sin parar desde que termina la cuenta atrás
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const loop = (now: number) => {
      if (stoppedRef.current) return;
      if (startedAtRef.current === null) startedAtRef.current = now;
      const elapsed = now - startedAtRef.current;
      if (elapsed >= SPIN_AUTO_STOP_MS) {
        stopAt(elapsed);
        return;
      }
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${-angleAt(plan, elapsed)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, plan, segments]);

  // Frenar: Espacio, Enter, un toque en la ruleta o el botón
  const brake = () => {
    if (!spinning || startedAtRef.current === null) return;
    stopAt(performance.now() - startedAtRef.current);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        brake();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!outcome || resolvedRef.current) return;
    const performanceTier = performanceFromOutcome(outcome);
    playSound(outcome === 'critical' ? 'thud' : 'stamp');
    vibrate(outcome === 'critical' ? 60 : [30, 40, 30]);
    const id = setTimeout(() => {
      resolvedRef.current = true;
      onResolve(performanceTier);
    }, RESULT_HOLD_MS);
    return () => clearTimeout(id);
  }, [outcome, onResolve]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Ruleta */}
        <div className="relative shrink-0 cursor-pointer touch-manipulation select-none" aria-hidden="true" onPointerDown={brake}>
          <svg viewBox="-100 -100 200 200" className="w-52 h-52">
            <defs>
              <pattern id="seg-success" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="#10b981" />
                <rect width="3" height="8" fill="#059669" />
              </pattern>
              <pattern id="seg-minor" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#f59e0b" />
                <circle cx="4" cy="4" r="1.6" fill="#b45309" />
              </pattern>
              <pattern id="seg-critical" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                <rect width="8" height="8" fill="#f43f5e" />
                <path d="M0 4 H8 M4 0 V8" stroke="#9f1239" strokeWidth="1.2" />
              </pattern>
            </defs>
            <g ref={wheelRef} style={{ transformOrigin: '0 0' }}>
              {SEGMENT_ORDER.map((key) => (
                <path key={key} d={arcPath(arcs[key][0], arcs[key][1])} fill={OUTCOME_META[key].fill} stroke="white" strokeWidth="1.5" />
              ))}
              <circle r="14" fill="white" stroke="#0A2540" strokeWidth="2" />
            </g>
            {/* Puntero fijo arriba */}
            <polygon points="-8,-100 8,-100 0,-80" fill="#0A2540" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Leyenda con probabilidades visibles */}
        <div className="w-full space-y-2">
          <ul className="space-y-1.5">
            {SEGMENT_ORDER.map((key) => {
              const { label, Icon } = OUTCOME_META[key];
              const active = outcome === key;
              return (
                <li
                  key={key}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${
                    active
                      ? 'border-[#0052CC] bg-[#0052CC]/5 text-[#0A2540] dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </span>
                  <span className="tabular-nums">{Math.round(segments[key] * 100)} %</span>
                </li>
              );
            })}
          </ul>
          {reasons.length > 0 && (
            <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
              Tus decisiones pesan:{' '}
              {reasons.map((r, i) => (
                <span key={r.label}>
                  {i > 0 && ', '}
                  {r.label} ({r.delta > 0 ? '+' : '-'}
                  {Math.round(Math.abs(r.delta) * 100)} % de éxito)
                </span>
              ))}
              .
            </p>
          )}
        </div>
      </div>

      <p className="min-h-5 text-center text-sm font-bold" aria-live="polite">
        {outcome ? (
          <span className="text-[#0A2540] dark:text-white">
            {OUTCOME_META[outcome].label} · <span className="font-medium">{OUTCOME_META[outcome].text}</span>
            <span className="sr-only"> {PERFORMANCE_LABEL[performanceFromOutcome(outcome)]}</span>
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            {spinning ? 'Tocá cuando el color que querés esté bajo la flecha' : ' '}
          </span>
        )}
      </p>

      <button
        type="button"
        disabled={!spinning}
        onPointerDown={(e) => {
          e.preventDefault();
          brake();
        }}
        className="w-full py-4 px-4 bg-[#0A2540] hover:bg-[#0052CC] active:bg-[#081c30] dark:bg-[#0052CC] dark:hover:bg-[#0047b3] disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-xl transition-colors touch-manipulation select-none focus:outline-none focus:ring-2 focus:ring-[#0052CC]/50"
      >
        Frenar (Espacio)
      </button>
    </div>
  );
}
