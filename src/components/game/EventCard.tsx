import { AlertTriangle, Zap, CheckCircle2, Lightbulb } from 'lucide-react';
import type { DecisionLogEntry, GameEvent } from '../../types/game';
import type { MetricDeltas } from '../../game/ui';
import { PERFORMANCE_HINT, PERFORMANCE_LABEL } from '../../game/minigames/performance';
import { personalize } from '../../lib/personalize';
import { EventKindIcon } from '../common/EventKindIcon';
import { INLINE_ICON_CLASS } from '../common/iconStyles';
import Card from '../common/Card';

const renderDeltaBadge = (value: number | undefined, label: string, color: string) => {
  if (value === undefined || value === 0) return null;
  const isPositive = value > 0;
  const sign = isPositive ? '+' : '';
  const textColor = isPositive ? color : 'text-rose-600 dark:text-rose-400';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-bold bg-slate-100 dark:bg-slate-800/80 ${textColor} border border-slate-200 dark:border-slate-700/60`}>
      {sign}{value} {label}
    </span>
  );
};

interface EventCardProps {
  /** Evento ya localizado (con el nombre del jugador). */
  event: GameEvent;
  currentTurn: number;
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
  playerName?: string;
}

/** Carta del dilema: tipo de evento, situación y, después de decidir, el resultado por capas. */
export default function EventCard({
  event,
  currentTurn,
  hidden,
  justRevealed,
  isRevealing,
  outcomeStep,
  lastDecision,
  decisionDeltas,
  lastPill,
  playerName,
}: EventCardProps) {
  const isInterruption = event.kind === 'crisis' || event.kind === 'unforeseen';
  const showOutcome = outcomeStep !== null && !isRevealing;
  const layer = outcomeStep ?? -1;

  return (
    <Card
      shadow="raised"
      className={`p-5 sm:p-7 flex flex-col justify-between transition-colors ${
        hidden ? 'invisible' : justRevealed ? 'stage-reveal' : ''
      }`}
    >
      <div>
        {/* Header del tipo de evento */}
        <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider mb-2">
          {event.kind === 'crisis' ? (
            <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/70 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Crisis Operativa • Turno {currentTurn}
            </span>
          ) : event.kind === 'unforeseen' ? (
            <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/70 animate-pulse">
              <Zap className="w-3.5 h-3.5" /> Suceso Imprevisto • Turno {currentTurn}
            </span>
          ) : (
            <span className="text-brand-cobalt dark:text-indigo-400 font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-indigo-950/50 border border-blue-200 dark:border-indigo-800/50">
              Dilema del Turno {currentTurn}
            </span>
          )}

          {showOutcome && (
            <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1 text-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Decisión Registrada
            </span>
          )}
        </div>

        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2.5 leading-snug">
          <EventKindIcon kind={event.kind} />
          {event.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Estado de Suspenso / Calculando (A4) */}
      {isRevealing && (
        <div className="mt-5 p-5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 flex flex-col items-center justify-center space-y-2.5 py-6 text-center animate-in fade-in duration-200 shadow-sm">
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

      {/* Panel de Resultado por capas (A3) */}
      {showOutcome && (
        <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {/* Paso ① (layer >= 0): Opción seleccionada y deltas */}
          {layer >= 0 && lastDecision && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2 animate-in fade-in duration-200">
              <p className="text-2xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Elegiste:{' '}
                <span className="text-slate-900 dark:text-slate-100 normal-case font-medium">
                  "{personalize(lastDecision.optionText, playerName)}"
                </span>
              </p>

              {lastDecision.performance && (
                <p className="text-2xs font-semibold text-brand-navy dark:text-slate-100">
                  {PERFORMANCE_LABEL[lastDecision.performance]}
                  <span className="font-normal text-slate-500 dark:text-slate-400"> · {PERFORMANCE_HINT[lastDecision.performance]}</span>
                </p>
              )}

              {/* Deltas de la decisión */}
              <div className="flex flex-wrap gap-1.5">
                {renderDeltaBadge(decisionDeltas.capital, 'Capital', 'text-emerald-600 dark:text-emerald-400')}
                {renderDeltaBadge(decisionDeltas.reputacion, 'Reputación', 'text-brand-cobalt dark:text-blue-400')}
                {renderDeltaBadge(decisionDeltas.bienestar, 'Bienestar', 'text-amber-600 dark:text-amber-400')}
              </div>
            </div>
          )}

          {/* Paso ② (layer >= 1): Texto de consecuencia narrativa personalizada */}
          {layer >= 1 && lastDecision?.outcomeText && (
            <div className="p-3.5 bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/70 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
              <span className="font-semibold text-slate-900 dark:text-slate-200">Consecuencia: </span>
              {personalize(lastDecision.outcomeText, playerName)}
            </div>
          )}

          {/* Paso ③ (layer >= 2): Micro-píldora didáctica que entra deslizándose */}
          {layer >= 2 && lastPill && (
            <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 rounded-xl animate-slide-up-fade shadow-sm">
              <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-normal">
                <Lightbulb className={INLINE_ICON_CLASS} aria-hidden="true" /> <span className="font-semibold text-indigo-700 dark:text-indigo-300">Concepto clave:</span> {personalize(lastPill, playerName)}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
