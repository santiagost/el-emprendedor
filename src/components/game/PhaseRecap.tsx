import { useEffect, useMemo } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Award, DollarSign, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Metrics } from '../../types/game';
import type { PhaseRecap as PhaseRecapData } from '../../game/recap';
import { PHASES } from '../../game/phases';
import { INTUITION_FIRST_PHASE, INTUITION_NOTE } from '../../game/intuition';
import { useSequence } from '../../hooks/useSequence';
import Button from '../common/Button';
import Card from '../common/Card';

interface PhaseRecapProps {
  recap: PhaseRecapData;
  /** Recarga en pleno resumen: se muestra todo de una vez, sin animar. */
  initialCompleted?: boolean;
  onContinue: () => void;
  disabled?: boolean;
}

const METRICS_UI: { key: keyof Metrics; label: string; icon: LucideIcon; stroke: string; text: string }[] = [
  { key: 'capital', label: 'Capital', icon: DollarSign, stroke: 'var(--color-metric-capital)', text: 'text-metric-capital' },
  { key: 'reputacion', label: 'Reputación', icon: Award, stroke: 'var(--color-metric-reputacion)', text: 'text-metric-reputacion' },
  { key: 'bienestar', label: 'Bienestar', icon: Heart, stroke: 'var(--color-metric-bienestar)', text: 'text-metric-bienestar' },
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
      className="w-full h-8 overflow-visible"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Recorrido de ${label} durante la fase: de ${values[0]} a ${values[values.length - 1]}`}
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        style={{ stroke }}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Punto final: un trazo de largo cero con extremo redondo, así no se deforma con el viewBox estirado */}
      <polyline
        points={`${last[0]},${last[1]} ${last[0]},${last[1]}`}
        fill="none"
        style={{ stroke }}
        strokeWidth={6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function PhaseRecap({ recap, initialCompleted = false, onContinue, disabled = false }: PhaseRecapProps) {
  const phase = PHASES.find((p) => p.id === recap.phaseId) ?? PHASES[0];
  const nextPhase = PHASES.find((p) => p.id === recap.phaseId + 1);

  // En el cierre de la fase anterior a la tendencia se avisa que es intuición, no certeza
  const paragraphs = useMemo(
    () => (recap.phaseId === INTUITION_FIRST_PHASE - 1 ? [...recap.paragraphs, INTUITION_NOTE] : recap.paragraphs),
    [recap.paragraphs, recap.phaseId]
  );

  // Pasos: ① fase, sello y titular, ② métricas, ③… cada párrafo
  const steps = useMemo(
    () => [{ at: 0 }, { at: 600 }, ...paragraphs.map((_, i) => ({ at: 1400 + i * 900 }))],
    [paragraphs]
  );
  const sequence = useSequence(steps, { key: `recap-${recap.phaseId}`, initialCompleted });

  // El hito vive dentro de la pantalla de juego: el encabezado queda fijo y el resumen arranca arriba
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (!sequence.isCompleted) sequence.skipToEnd();
      else onContinue();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sequence, onContinue, disabled]);

  return (
    <section aria-label={`Resumen de la fase ${phase.id}`} className="w-full max-w-5xl mx-auto space-y-5">
      {/* ① Nivel superado: nombre de la fase, el perfil como sello y el titular */}
      <div className="space-y-3 animate-slide-up-fade">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[0.98]">{phase.label}</h2>
        {/* El sello cae rotado (animación stage-stamp); el margen evita que pise el título y el titular */}
        <div className="py-2.5 pl-1">
          <span className="stage-stamp inline-block px-3.5 py-1.5 rounded-[10px] border-[3px] border-indigo-500 dark:border-indigo-300 font-display text-lg sm:text-xl font-extrabold uppercase tracking-[0.06em] text-indigo-700 dark:text-indigo-200">
            {recap.trend.label}
          </span>
        </div>
        <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-snug max-w-[56ch]">{recap.headline}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8 items-start">
        {/* ② Métricas de la fase en filas: nombre, recorrido, valor final y cambio */}
        {sequence.currentStep >= 1 && (
          <Card
            as="section"
            aria-label="Cómo cambiaron tus métricas en la fase"
            className="px-4 sm:px-5 py-1.5 animate-slide-up-fade"
          >
            {METRICS_UI.map(({ key, label, icon: Icon, stroke, text }, i) => {
              const delta = recap.deltas?.[key];
              const showDelta = delta !== undefined && Math.abs(delta) >= 4;
              return (
                <div
                  key={key}
                  className={`grid grid-cols-[6.5rem_minmax(0,1fr)_3rem_3.5rem] items-center gap-2.5 py-3 ${
                    i > 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''
                  }`}
                >
                  <span className={`flex items-center gap-1.5 min-w-0 text-sm font-semibold ${text}`}>
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </span>
                  {recap.series ? (
                    <Sparkline values={recap.series.map((s) => s[key])} stroke={stroke} label={label} />
                  ) : (
                    <span />
                  )}
                  <span className="font-display text-xl font-extrabold tabular-nums text-right text-slate-900 dark:text-slate-100">
                    {recap.endMetrics[key]}
                  </span>
                  <span
                    className={`inline-flex items-center justify-end gap-0.5 text-xs font-bold tabular-nums ${
                      showDelta && (delta as number) > 0 ? text : 'text-metric-peligro'
                    }`}
                  >
                    {showDelta && (
                      <>
                        {(delta as number) > 0 ? <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /> : <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />}
                        {(delta as number) > 0 ? '+' : '−'}
                        {Math.abs(delta as number)}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </Card>
        )}

        {/* ③… Párrafos por capas */}
        <div className="space-y-3 min-w-0">
          {paragraphs.map((text, i) =>
            sequence.currentStep >= 2 + i ? (
              <p key={i} className={`text-sm sm:text-base leading-relaxed animate-slide-up-fade ${
                text === INTUITION_NOTE ? 'italic font-semibold text-brand-cobalt dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'
              }`}>
                {text}
              </p>
            ) : null
          )}
        </div>
      </div>

      {/* El botón queda donde suelen estar las opciones del dilema */}
      <div className="w-full max-w-[640px] mx-auto pt-2">
        {sequence.isCompleted ? (
          <div className="space-y-2 animate-slide-up-fade">
            <Button
              size="lg"
              disabled={disabled}
              onClick={onContinue}
              className="w-full shadow-lg shadow-brand-cobalt/25 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{nextPhase ? `Empezar Fase ${nextPhase.id}: ${nextPhase.label}` : 'Continuar'}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Presioná{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Espacio</kbd> o{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Enter</kbd> para continuar
            </p>
          </div>
        ) : (
          <Button
            variant="secondary"
            disabled={disabled}
            onClick={sequence.skipToEnd}
            className="w-full py-3.5 px-4 text-xs sm:text-sm rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Saltar animación</span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">(Espacio)</span>
          </Button>
        )}
      </div>
    </section>
  );
}
