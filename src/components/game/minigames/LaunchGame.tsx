import { useEffect, useMemo, useRef, useState } from 'react';
import { Rocket, CheckCircle2, AlertTriangle, XOctagon } from 'lucide-react';
import MinigameShell from './MinigameShell';
import { useReducedMotion } from '../../../lib/motion';
import { playSound } from '../../../lib/sound';
import { vibrate } from '../../../lib/fx';
import {
  SEGMENT_ORDER,
  computeSegments,
  nudgeFromTap,
  performanceFromOutcome,
  planSpin,
  resolveSpin,
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

const SPIN_MS = 4000;
const SPIN_MS_REDUCED = 1800;
const NUDGE_EASE_MS = 400;
const RESULT_HOLD_MS = 1300;

const OUTCOME_META: Record<RouletteOutcome, { label: string; text: string; fill: string; Icon: typeof CheckCircle2 }> = {
  success: { label: 'Éxito', text: 'Salió limpio.', fill: 'url(#seg-success)', Icon: CheckCircle2 },
  minor: { label: 'Bug leve', text: 'Salió con algún bug.', fill: 'url(#seg-minor)', Icon: AlertTriangle },
  critical: { label: 'Fallo crítico', text: 'Salió con un fallo serio.', fill: 'url(#seg-critical)', Icon: XOctagon },
};

const easeOutCubic = (u: number) => 1 - (1 - u) ** 3;
const smoothstep = (u: number) => {
  const c = Math.max(0, Math.min(1, u));
  return c * c * (3 - 2 * c);
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
 * Lanzamiento beta: una ruleta con tres segmentos cuyo tamaño sale de lo que hiciste antes.
 * El desenlace se decide con el RNG de la semilla y se lee del ángulo final; el jugador solo puede empujarla hasta 10° al frenar.
 */
export default function LaunchGame({ seed, activeTags, riskBias, title, rule, onResolve, onSkip }: LaunchGameProps) {
  return (
    <MinigameShell
      title={title ?? 'Lanzamiento beta'}
      rule={rule ?? 'La ruleta decide cómo sale el lanzamiento. Frenala mientras gira para empujarla unos grados.'}
      icon={<Rocket className="w-4 h-4" aria-hidden="true" />}
      onSkip={onSkip}
    >
      {(running) => <LaunchBoard running={running} seed={seed} activeTags={activeTags} riskBias={riskBias} onResolve={onResolve} />}
    </MinigameShell>
  );
}

function LaunchBoard({
  running,
  seed,
  activeTags,
  riskBias,
  onResolve,
}: {
  running: boolean;
  seed: number;
  activeTags: readonly Tag[];
  riskBias?: number;
  onResolve: (performance: Performance) => void;
}) {
  const reduced = useReducedMotion();
  const { segments, reasons } = useMemo(() => computeSegments(activeTags, riskBias), [activeTags, riskBias]);
  const arcs = useMemo(() => segmentArcs(segments), [segments]);
  const plan = useMemo(() => planSpin(seed), [seed]);

  const wheelRef = useRef<SVGGElement>(null);
  const tapRef = useRef<{ at: number | null }>({ at: null });
  const [nudged, setNudged] = useState(false);
  const [outcome, setOutcome] = useState<RouletteOutcome | null>(null);
  const resolvedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const spinning = running && outcome === null;

  // El giro arranca solo al terminar la cuenta atrás
  useEffect(() => {
    if (!running) return;
    const duration = reduced ? SPIN_MS_REDUCED : SPIN_MS;
    const baseRotation = plan.turns * 360 + 360 - plan.baseAngle;
    let raf = 0;
    let start: number | null = null;
    const loop = (now: number) => {
      if (start === null) {
        start = now;
        startedAtRef.current = now;
      }
      const elapsed = now - start;
      const u = Math.min(1, elapsed / duration);
      const tap = tapRef.current.at;
      const nudge = tap === null ? 0 : nudgeFromTap(tap) * smoothstep((elapsed - tap) / NUDGE_EASE_MS);
      // El empujón mueve la ruleta en sentido contrario al ángulo que queda bajo el puntero
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${baseRotation * easeOutCubic(u) - nudge}deg)`;
      if (u >= 1 && (tap === null || elapsed - tap >= NUDGE_EASE_MS)) {
        const result = resolveSpin(plan, segments, tap === null ? 0 : nudgeFromTap(tap));
        setOutcome(result.outcome);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, plan, segments, reduced]);

  // Frenar: Espacio, Enter o el botón. Solo cuenta una vez y solo mientras gira.
  const brake = () => {
    if (!spinning || tapRef.current.at !== null || startedAtRef.current === null) return;
    tapRef.current.at = performance.now() - startedAtRef.current;
    setNudged(true);
    playSound('select');
    vibrate(20);
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
        <div className="relative shrink-0" aria-hidden="true">
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
            {spinning ? (nudged ? 'Empujón dado, esperá el resultado…' : 'Frená mientras gira para empujarla hasta 10°') : ' '}
          </span>
        )}
      </p>

      <button
        type="button"
        disabled={!spinning || nudged}
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
