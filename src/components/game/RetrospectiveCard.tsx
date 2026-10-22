import { GitFork, Lightbulb } from 'lucide-react';
import type { Metrics } from '../../types/game';
import { VERDICT_LABELS, type PivotMoment, type Retrospective, type Verdict } from '../../game/retrospective';

interface RetrospectiveCardProps {
  retrospective: Retrospective;
}

const METRIC_LABELS: Record<keyof Metrics, string> = {
  capital: 'Capital',
  reputacion: 'Reputación',
  bienestar: 'Bienestar',
};
const METRIC_ORDER: (keyof Metrics)[] = ['capital', 'reputacion', 'bienestar'];

const VERDICT_STYLES: Record<Verdict, { symbol: string; badge: string; dot: string }> = {
  good: {
    symbol: '✔',
    badge: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  reasonable: {
    symbol: '≈',
    badge: 'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  could_be_better: {
    symbol: '✖',
    badge: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const style = VERDICT_STYLES[verdict];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold ${style.badge}`}>
      <span aria-hidden="true">{style.symbol}</span>
      {VERDICT_LABELS[verdict]}
    </span>
  );
}

function DeltaBadges({ net }: { net: Metrics }) {
  const shown = METRIC_ORDER.filter((k) => net[k] !== 0);
  if (shown.length === 0) return <span className="text-[11px] text-slate-400">Sin efecto directo</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {shown.map((k) => (
        <span
          key={k}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums ${
            net[k] > 0
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
          }`}
        >
          {METRIC_LABELS[k]} {net[k] > 0 ? '+' : ''}
          {net[k]}
        </span>
      ))}
    </span>
  );
}

function PivotCard({ pivot }: { pivot: PivotMoment }) {
  return (
    <li className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60 space-y-2.5">
      <p className="text-[11px] font-bold text-[#0052CC] dark:text-indigo-400">
        Turno {pivot.turn} · <span className="text-slate-700 dark:text-slate-300">{pivot.eventTitle}</span>
      </p>

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Elegiste</p>
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">«{pivot.chosenText}»</p>
        <DeltaBadges net={pivot.chosenNet} />
      </div>

      <div className="space-y-1 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
        <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
          <GitFork className="w-3 h-3" /> El otro camino
        </p>
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">«{pivot.altText}»</p>
        <DeltaBadges net={pivot.altNet} />
      </div>

      {pivot.scheduleNote && <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{pivot.scheduleNote}</p>}
      {pivot.lesson && (
        <p className="flex items-start gap-1 text-[11px] text-indigo-700 dark:text-indigo-300/90 italic leading-snug">
          <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" /> {pivot.lesson}
        </p>
      )}
    </li>
  );
}

export default function RetrospectiveCard({ retrospective }: RetrospectiveCardProps) {
  const { totals, pivots, projectionText, closing, disclaimer } = retrospective;
  if (totals.total === 0) return null;

  return (
    <section
      aria-label="Tu camino y los caminos no tomados"
      className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm dark:shadow-md transition-colors"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Tu camino y los caminos no tomados
      </h3>

      {/* Balance de decisiones */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {(['good', 'reasonable', 'could_be_better'] as Verdict[]).map((v) =>
            totals[v] > 0 ? (
              <span key={v} className="inline-flex items-center gap-1.5">
                <VerdictBadge verdict={v} />
                <span className="text-xs font-black tabular-nums text-slate-700 dark:text-slate-200">×{totals[v]}</span>
              </span>
            ) : null
          )}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Comparé cada decisión con la otra opción que tenías, teniendo en cuenta qué parte de tu empresa estaba más débil en ese momento.
        </p>
      </div>

      {/* Momentos bisagra */}
      {pivots.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {pivots.length === 1 ? 'El momento que más pesó' : 'Los momentos que más pesaron'}
          </h4>
          <ul className="space-y-2.5">
            {pivots.map((p) => (
              <PivotCard key={p.analysis.logIndex} pivot={p} />
            ))}
          </ul>
        </div>
      )}

      {/* Proyección */}
      <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          Tu final probable con otras decisiones
        </p>
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">{projectionText}</p>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{closing}</p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic leading-snug">{disclaimer}</p>
    </section>
  );
}
