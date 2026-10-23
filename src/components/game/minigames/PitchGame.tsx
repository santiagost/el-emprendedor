import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Presentation, Check, Minus, X } from 'lucide-react';
import MinigameShell from './MinigameShell';
import { useReducedMotion } from '../../../lib/motion';
import { playSound } from '../../../lib/sound';
import { vibrate } from '../../../lib/fx';
import { buildTimingRounds, classifyHit, needlePosition, performanceFromHits, type TimingHit } from '../../../game/minigames/timing';
import { PERFORMANCE_LABEL } from '../../../game/minigames/performance';
import type { Performance } from '../../../types/game';

interface PitchGameProps {
  seed: number;
  difficulty?: 1 | 2 | 3;
  title?: string;
  rule?: string;
  onResolve: (performance: Performance) => void;
  onSkip: () => void;
}

const HIT_STOP_MS = 80;
const NEXT_ROUND_MS = 700;
const RESULT_HOLD_MS = 1100;

const HIT_LABEL: Record<TimingHit, string> = { core: 'Perfecto', zone: 'En zona', miss: 'Fuera' };
const HIT_STYLE: Record<TimingHit, string> = {
  core: 'text-emerald-700 dark:text-emerald-300',
  zone: 'text-sky-700 dark:text-sky-300',
  miss: 'text-rose-700 dark:text-rose-300',
};

const HitIcon = ({ hit }: { hit: TimingHit }) =>
  hit === 'core' ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : hit === 'zone' ? <Minus className="w-3.5 h-3.5" aria-hidden="true" /> : <X className="w-3.5 h-3.5" aria-hidden="true" />;

/**
 * Pitch de elevador: una aguja va y viene y hay que frenarla en la zona verde. 3 rondas (Gancho, Números, Cierre).
 * La aguja se mueve por ref + transform en rAF: sin setState por frame.
 */
export default function PitchGame({ seed, difficulty = 2, title, rule, onResolve, onSkip }: PitchGameProps) {
  return (
    <MinigameShell
      title={title ?? 'Pitch de elevador'}
      rule={rule ?? 'Frená la aguja dentro de la zona verde. Tenés tres rondas, cada una más rápida.'}
      icon={<Presentation className="w-4 h-4" aria-hidden="true" />}
      onSkip={onSkip}
    >
      {(running, assisted) => <PitchBoard running={running} assisted={assisted} seed={seed} difficulty={difficulty} onResolve={onResolve} />}
    </MinigameShell>
  );
}

function PitchBoard({
  running,
  assisted,
  seed,
  difficulty,
  onResolve,
}: {
  running: boolean;
  assisted: boolean;
  seed: number;
  difficulty: 1 | 2 | 3;
  onResolve: (performance: Performance) => void;
}) {
  const reduced = useReducedMotion();
  const rounds = useMemo(() => buildTimingRounds(seed, difficulty, assisted), [seed, difficulty, assisted]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [hits, setHits] = useState<TimingHit[]>([]);
  const [phase, setPhase] = useState<'aiming' | 'frozen' | 'done'>('aiming');
  const needleRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const resolvedRef = useRef(false);

  const round = rounds[Math.min(roundIndex, rounds.length - 1)];

  // Bucle de la aguja: reinicia el reloj en cada ronda
  useEffect(() => {
    if (!running || phase !== 'aiming') return;
    startRef.current = null;
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      posRef.current = needlePosition(now - startRef.current, round.speed);
      if (needleRef.current) needleRef.current.style.left = `${posRef.current * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, phase, roundIndex, round.speed]);

  const stop = useCallback(() => {
    if (!running || phase !== 'aiming') return;
    const hit = classifyHit(posRef.current, round);
    setPhase('frozen');
    setHits((prev) => [...prev, hit]);
    playSound(hit === 'miss' ? 'tickDown' : 'tickUp');
    vibrate(hit === 'core' ? [20, 30, 20] : hit === 'zone' ? 20 : 45);
  }, [running, phase, round]);

  // Espacio / Enter frenan la aguja (se ignora el auto-repeat al mantener la tecla)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        stop();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stop]);

  // Tras frenar: hit-stop breve, pausa para leer el resultado y siguiente ronda o cierre
  useEffect(() => {
    if (phase !== 'frozen') return;
    const isLast = hits.length >= rounds.length;
    const id = setTimeout(
      () => {
        if (isLast) {
          setPhase('done');
        } else {
          setRoundIndex(hits.length);
          setPhase('aiming');
        }
      },
      HIT_STOP_MS + NEXT_ROUND_MS
    );
    return () => clearTimeout(id);
  }, [phase, hits.length, rounds.length]);

  const performance = hits.length >= rounds.length ? performanceFromHits(hits) : null;

  useEffect(() => {
    if (phase !== 'done' || !performance || resolvedRef.current) return;
    const id = setTimeout(() => {
      resolvedRef.current = true;
      onResolve(performance);
    }, RESULT_HOLD_MS);
    return () => clearTimeout(id);
  }, [phase, performance, onResolve]);

  const lastHit = hits[hits.length - 1];

  return (
    <div className="space-y-3">
      {/* Rondas */}
      <ol className="flex items-center gap-2" aria-label="Rondas del pitch">
        {rounds.map((r, i) => {
          const hit = hits[i];
          const active = i === roundIndex && phase !== 'done';
          return (
            <li
              key={r.label}
              className={`flex-1 flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border text-2xs font-semibold ${
                active
                  ? 'border-brand-cobalt bg-brand-cobalt/5 text-brand-navy dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-white'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              <span>{i + 1}. {r.label}</span>
              {hit && (
                <span className={`inline-flex items-center gap-1 ${HIT_STYLE[hit]}`}>
                  <HitIcon hit={hit} />
                  <span className="hidden sm:inline">{HIT_LABEL[hit]}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Barra */}
      <div className="relative h-14 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-y-0 border-x-2 border-emerald-600/70 dark:border-emerald-400/70 bg-emerald-500/20"
          style={{
            left: `${(round.center - round.zoneWidth / 2) * 100}%`,
            width: `${round.zoneWidth * 100}%`,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(5,150,105,0.28) 0 6px, transparent 6px 12px)',
          }}
        />
        <div
          className="absolute inset-y-0 bg-emerald-500/70 dark:bg-emerald-400/70 flex items-center justify-center"
          style={{ left: `${(round.center - round.coreWidth / 2) * 100}%`, width: `${round.coreWidth * 100}%` }}
        >
          <span className="w-0.5 h-5 rounded bg-white/90" />
        </div>
        <div
          ref={needleRef}
          className="absolute inset-y-0 w-1 -ml-0.5 rounded bg-brand-navy dark:bg-white shadow-[0_0_8px_rgba(0,82,204,0.6)]"
          style={{ left: '0%' }}
        />
      </div>

      {/* Lectura del resultado de la ronda */}
      <p className="min-h-5 text-center text-sm font-bold" aria-live="polite">
        {phase === 'done' && performance ? (
          <span className="text-brand-navy dark:text-white">{PERFORMANCE_LABEL[performance]}</span>
        ) : phase === 'frozen' && lastHit ? (
          <span className={HIT_STYLE[lastHit]}>
            {lastHit === 'core' ? '¡Perfecto!' : lastHit === 'zone' ? 'Casi…' : 'Se te fue.'}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
            {running ? 'Espacio, clic o toque para frenar' : ' '}
          </span>
        )}
      </p>

      <button
        type="button"
        disabled={!running || phase !== 'aiming'}
        onPointerDown={(e) => {
          e.preventDefault();
          stop();
        }}
        className="w-full py-4 px-4 bg-brand-navy hover:bg-brand-cobalt active:bg-brand-navy-press dark:bg-brand-cobalt dark:hover:bg-brand-cobalt-hover disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-xl transition-colors touch-manipulation select-none focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50"
      >
        {reduced ? 'Frenar (Espacio)' : 'Cerrar el trato (Espacio)'}
      </button>
    </div>
  );
}
