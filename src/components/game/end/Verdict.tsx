import type { Metrics } from '../../../types/game';
import { METRIC_LABELS, METRIC_ORDER } from './metricLabels';
import { VERDICT_LABELS, type Verdict } from '../../../game/retrospective';
import { Check, Minus, X, type LucideIcon } from 'lucide-react';
import { INLINE_ICON_CLASS } from '../../common/iconStyles';

const VERDICT_STYLES: Record<Verdict, { Icon: LucideIcon; badge: string }> = {
  good: {
    Icon: Check,
    badge: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300',
  },
  reasonable: {
    Icon: Minus,
    badge: 'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300',
  },
  could_be_better: {
    Icon: X,
    badge: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 text-amber-700 dark:text-amber-300',
  },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const style = VERDICT_STYLES[verdict];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold ${style.badge}`}>
      <style.Icon className={INLINE_ICON_CLASS} aria-hidden="true" />
      {VERDICT_LABELS[verdict]}
    </span>
  );
}

export function DeltaBadges({ net }: { net: Metrics }) {
  const shown = METRIC_ORDER.filter((k) => net[k] !== 0);
  if (shown.length === 0) return <span className="text-[11px] text-slate-500 dark:text-slate-400">Sin efecto directo</span>;
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
