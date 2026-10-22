import { useEffect, useMemo } from 'react';
import { ArrowRight, Award, DollarSign, Flag, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Metrics } from '../../types/game';
import type { PhaseRecap as PhaseRecapData } from '../../game/recap';
import { PHASES } from '../../game/phases';
import { useSequence } from '../../hooks/useSequence';

interface PhaseRecapProps {
  recap: PhaseRecapData;
  /** Recarga en pleno resumen: se muestra todo de una vez, sin animar. */
  initialCompleted?: boolean;
  onContinue: () => void;
}

const METRICS_UI: { key: keyof Metrics; label: string; icon: LucideIcon; stroke: string; text: string }[] = [
  { key: 'capital', label: 'Capital', icon: DollarSign, stroke: '#0F9D58', text: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'reputacion', label: 'Reputación', icon: Award, stroke: '#1B68D2', text: 'text-[#1B68D2] dark:text-blue-400' },
  { key: 'bienestar', label: 'Bienestar', icon: Heart, stroke: '#FF9800', text: 'text-amber-600 dark:text-amber-400' },
];

const SPARK_W = 100;
const SPARK_H = 32;

function Sparkline({ values, stroke, label }: { values: number[]; stroke: string; label: string }) {
  const step = values.length > 1 ? SPARK_W / (values.length - 1) : 0;
  const points = values.map((v, i) => [i * step, SPARK_H - 3 - (Math.max(0, Math.min(100, v)) / 100) * (SPARK_H - 6)] as const);
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      className="w-full h-9 lg:h-12 overflow-visible"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Recorrido de ${label} durante la fase: de ${values[0]} a ${values[values.length - 1]}`}
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Punto final: un trazo de largo cero con extremo redondo, así no se deforma con el viewBox estirado */}
      <polyline
        points={`${last[0]},${last[1]} ${last[0]},${last[1]}`}
        fill="none"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function PhaseRecap({ recap, initialCompleted = false, onContinue }: PhaseRecapProps) {
  const phase = PHASES.find((p) => p.id === recap.phaseId) ?? PHASES[0];
  const nextPhase = PHASES.find((p) => p.id === recap.phaseId + 1);

  // Pasos: ① recorrido de métricas, ② titular, ③… cada párrafo
  const steps = useMemo(
    () => [{ at: 0 }, { at: 600 }, ...recap.paragraphs.map((_, i) => ({ at: 1400 + i * 900 }))],
    [recap.paragraphs]
  );
  const sequence = useSequence(steps, { key: `recap-${recap.phaseId}`, initialCompleted });

  // El hito vive dentro de la pantalla de juego: el encabezado queda fijo y el resumen arranca arriba
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (!sequence.isCompleted) sequence.skipToEnd();
      else onContinue();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sequence, onContinue]);

  return (
    <section aria-label={`Resumen de la fase ${phase.id}`} className="w-full max-w-5xl mx-auto space-y-5">
      <div className="space-y-1.5 animate-slide-up-fade">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0052CC] dark:text-indigo-400">
          <Flag className="w-3.5 h-3.5" /> Fin de la Fase {phase.id}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{phase.label}</h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8 items-start">
        {/* ① Recorrido de las métricas durante la fase */}
        <section
          aria-label="Recorrido de las métricas en la fase"
          className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm animate-slide-up-fade"
        >
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-5 lg:gap-6">
            {METRICS_UI.map(({ key, label, icon: Icon, stroke, text }) => {
              const delta = recap.deltas?.[key];
              const showDelta = delta !== undefined && Math.abs(delta) >= 4;
              return (
                <div key={key} className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${text}`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{label}</span>
                    </span>
                  </div>
                  {recap.series ? (
                    <Sparkline values={recap.series.map((s) => s[key])} stroke={stroke} label={label} />
                  ) : (
                    <div className="h-9 lg:h-12" />
                  )}
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm sm:text-base font-black tabular-nums text-slate-900 dark:text-slate-100">
                      {recap.endMetrics[key]}%
                    </span>
                    {showDelta && (
                      <span
                        className={`text-[11px] font-bold tabular-nums ${
                          (delta as number) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {(delta as number) > 0 ? '+' : ''}
                        {delta}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="space-y-4 min-w-0">
          {/* ② Perfil de la fase y titular */}
          {sequence.currentStep >= 1 && (
            <div className="space-y-2 animate-slide-up-fade">
              <span className="inline-flex px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/70 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                {recap.trend.label}
              </span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">{recap.headline}</p>
            </div>
          )}

          {/* ③… Párrafos por capas */}
          <div className="space-y-3">
            {recap.paragraphs.map((text, i) =>
              sequence.currentStep >= 2 + i ? (
                <p key={i} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed animate-slide-up-fade">
                  {text}
                </p>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* El botón queda donde suelen estar las opciones del dilema */}
      <div className="w-full max-w-[640px] mx-auto pt-2">
        {sequence.isCompleted ? (
          <div className="space-y-2 animate-slide-up-fade">
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-4 px-4 bg-[#0A2540] hover:bg-[#0052CC] active:bg-[#081c30] dark:bg-[#0052CC] dark:hover:bg-[#0047b3] text-white font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0052CC]/25 group"
            >
              <span>{nextPhase ? `Empezar Fase ${nextPhase.id}: ${nextPhase.label}` : 'Continuar'}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
              Presioná{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Espacio</kbd> o{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Enter</kbd> para continuar
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={sequence.skipToEnd}
            className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Saltar animación</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(Espacio)</span>
          </button>
        )}
      </div>
    </section>
  );
}
