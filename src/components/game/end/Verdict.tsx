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
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-xs font-bold ${style.badge}`}>
      <style.Icon className={INLINE_ICON_CLASS} aria-hidden="true" />
      {VERDICT_LABELS[verdict]}
    </span>
  );
}
