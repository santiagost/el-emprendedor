import { AlertTriangle, Zap, Lightbulb } from 'lucide-react';
import type { DecisionLogEntry, GameEvent } from '../../types/game';
import type { MetricDeltas } from '../../game/ui';
import { PERFORMANCE_HINT, PERFORMANCE_LABEL } from '../../game/minigames/performance';
import { personalize } from '../../lib/personalize';
import { EventKindIcon } from '../common/EventKindIcon';
import { INLINE_ICON_CLASS } from '../common/iconStyles';
import Card from '../common/Card';

const METRICS = [
  { key: 'capital', label: 'Capital' },
  { key: 'reputacion', label: 'Reputación' },
  { key: 'bienestar', label: 'Bienestar' },
] as const;

/** Las píldoras didácticas vienen como "Título: texto": se separan para no anidar tres textos. */
const splitPill = (pill: string) => {
  const i = pill.indexOf(': ');
  return i > 0 ? { title: pill.slice(0, i), text: pill.slice(i + 2) } : { title: null, text: pill };
};

interface EventCardProps {
  /** Evento ya localizado (con el nombre del jugador). */
  event: GameEvent;
  /** La coreografía de la interrupción todavía está en pantalla: la carta ocupa su lugar pero no se ve. */
  hidden: boolean;
  /** La carta acaba de revelarse tras la coreografía: anima su entrada. */
  justRevealed: boolean;
  /** Suspenso "Calculando…" antes de mostrar el impacto (A4). */
  isRevealing: boolean;
  /** Paso de la secuencia del resultado por capas (A3); null mientras se decide. */
  outcomeStep: number | null;
  lastDecision: DecisionLogEntry | null | undefined;
  decisionDeltas: MetricDeltas;
  lastPill: string | null | undefined;
  /** "Qué podría venir" tras la decisión (siempre en condicional); null si no deja nada pendiente. */
  forecast?: string | null;
  playerName?: string;
}

/** Carta del dilema: situación y, después de decidir, el resultado en una sola carta por capas. */
export default function EventCard({
  event,
  hidden,
  justRevealed,
  isRevealing,
  outcomeStep,
  lastDecision,
  decisionDeltas,
  lastPill,
  forecast,
  playerName,
}: EventCardProps) {
  const isInterruption = event.kind === 'crisis' || event.kind === 'unforeseen';
  const showOutcome = outcomeStep !== null && !isRevealing;
  const layer = outcomeStep ?? -1;

  return (
    <Card
      shadow="raised"
      className={`overflow-hidden transition-colors ${
        hidden ? 'invisible' : justRevealed ? 'stage-reveal' : ''
      }`}
    >
      {event.kind === 'crisis' && (
        <div className="flex items-center gap-2 px-5 sm:px-7 py-2 bg-rose-600 text-white text-xs font-extrabold uppercase tracking-widest">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Crisis
        </div>
      )}
      {event.kind === 'unforeseen' && (
        <div className="flex items-center gap-2 px-5 sm:px-7 py-2 bg-amber-500 text-white text-xs font-extrabold uppercase tracking-widest">
          <Zap className="w-4 h-4" aria-hidden="true" /> Imprevisto
        </div>
      )}

      <div className={showOutcome ? 'px-5 sm:px-7 py-4' : 'p-5 sm:p-7'}>
        <h2 className={`font-bold text-brand-navy dark:text-slate-100 leading-tight text-balance ${showOutcome ? 'text-sm sm:text-base mb-1' : 'text-2xl sm:text-3xl mb-3'}`}>
          {event.kind !== 'unforeseen' && <EventKindIcon kind={event.kind} />}
          {event.title}
        </h2>
        <p className={`text-slate-600 dark:text-slate-300 leading-relaxed max-w-[62ch] ${showOutcome ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'}`}>
          {event.description}
        </p>
      </div>

      {/* Estado de Suspenso / Calculando (A4) */}
      {isRevealing && (
        <div className="mx-5 sm:mx-7 mb-5 sm:mb-7 p-5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 flex flex-col items-center justify-center space-y-2.5 py-6 text-center animate-in fade-in duration-200">
          <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {isInterruption ? 'Analizando impacto de la crisis…' : 'Calculando consecuencias…'}
            </p>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              Simulando reacción de mercado y métricas vitales
            </p>
          </div>
        </div>
      )}

      {/* Resultado por capas (A3), todo dentro de la misma carta */}
      {showOutcome && (
        <div className="border-t border-slate-200 dark:border-slate-800">
          {/* Paso ①: opción elegida y deltas */}
          {layer >= 0 && lastDecision && (
            <div className="animate-in fade-in duration-200">
              <div className="px-5 sm:px-7 py-5 bg-blue-50 dark:bg-indigo-950/40 border-b border-slate-200 dark:border-slate-800">
                <p className="text-2xs font-extrabold uppercase tracking-widest text-brand-cobalt dark:text-indigo-300">Elegiste</p>
                <p className="mt-1 text-lg sm:text-2xl font-bold leading-snug text-brand-navy dark:text-slate-100">
                  “{personalize(lastDecision.optionText, playerName)}”
                </p>
                {lastDecision.performance && (
                  <p className="mt-1.5 text-xs font-semibold text-brand-navy dark:text-slate-100">
                    {PERFORMANCE_LABEL[lastDecision.performance]}
                    <span className="font-normal text-slate-500 dark:text-slate-400"> · {PERFORMANCE_HINT[lastDecision.performance]}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2.5 px-5 sm:px-7 pt-4">
                {METRICS.map(({ key, label }) => {
                  const value = decisionDeltas[key];
                  if (!value) return null;
                  const after = lastDecision.metricsAfter?.[key];
                  const before = after !== undefined ? after - value : undefined;
                  return (
                    <div key={key} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3">
                      <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
                      <p className={`text-2xl font-extrabold tabular-nums ${value > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {value > 0 ? '+' : '−'}{Math.abs(value)}
                      </p>
                      {after !== undefined && before !== undefined && (
                        <p className="text-2xs text-slate-500 dark:text-slate-400 tabular-nums">{before}% → {after}%</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Paso ②: consecuencia narrativa */}
          {layer >= 1 && lastDecision?.outcomeText && (
            <p className="px-5 sm:px-7 pt-5 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-[64ch] animate-in fade-in duration-200">
              {personalize(lastDecision.outcomeText, playerName)}
            </p>
          )}
          {layer >= 1 && forecast && (
            <p className="px-5 sm:px-7 pt-3 text-sm italic text-slate-500 dark:text-slate-400 leading-relaxed max-w-[64ch] animate-in fade-in duration-200">
              {forecast}
            </p>
          )}

          {/* Paso ③: concepto clave */}
          {layer >= 2 && lastPill && (() => {
            const pill = splitPill(personalize(lastPill, playerName));
            return (
              <div className="mx-5 sm:mx-7 mt-5 mb-5 sm:mb-7 p-3.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl animate-slide-up-fade">
                <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-normal">
                  <Lightbulb className={INLINE_ICON_CLASS} aria-hidden="true" /> <span className="font-bold text-indigo-700 dark:text-indigo-300">Para llevarte:</span>{' '}
                  {pill.title && <span className="font-semibold">{pill.title}. </span>}
                  {pill.text}
                </p>
              </div>
            );
          })()}
          {!(layer >= 2 && lastPill) && <div className="h-5 sm:h-7" />}
        </div>
      )}
    </Card>
  );
}
