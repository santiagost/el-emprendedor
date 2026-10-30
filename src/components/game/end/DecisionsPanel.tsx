import { Lightbulb, X } from 'lucide-react';
import type { TimelineDecision, TimelinePhase } from '../../../game/endReport';
import { VerdictBadge } from './Verdict';
import { INLINE_ICON_CLASS } from '../../common/iconStyles';

const KIND_LABEL: Record<string, { text: string; cls: string }> = {
  crisis: { text: 'Crisis', cls: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/70' },
  unforeseen: { text: 'Imprevisto', cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/70' },
};

export function DecisionList({ decisions }: { decisions: TimelineDecision[] }) {
  return (
    <ol className="space-y-2.5">
      {decisions.map((d) => {
        const kind = d.kind ? KIND_LABEL[d.kind] : undefined;
        return (
          <li key={d.logIndex} className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/60 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold">
              <span className="text-brand-cobalt dark:text-indigo-400 font-bold">Año {d.turn}</span>
              {kind && <span className={`px-1.5 py-0.5 rounded-md border text-xs font-bold ${kind.cls}`}>{kind.text}</span>}
              <span className="text-slate-800 dark:text-slate-200 min-w-0">{d.title}</span>
            </div>
            {d.verdict && <VerdictBadge verdict={d.verdict} />}
            <p className="text-sm text-slate-800 dark:text-slate-200">«{d.option}»</p>
            {d.outcome && <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{d.outcome}</p>}
            {d.learning && <p className="text-xs text-indigo-800 dark:text-indigo-300/90 italic leading-snug"><Lightbulb className={INLINE_ICON_CLASS} aria-hidden="true" /> {d.learning}</p>}
          </li>
        );
      })}
    </ol>
  );
}

interface PanelHeaderProps {
  phase: TimelinePhase;
  onClose: () => void;
  closeRef?: React.Ref<HTMLButtonElement>;
}

export function PanelHeader({ phase, onClose, closeRef }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h4 id={`decisiones-fase-${phase.phaseId}`} className="text-sm font-bold text-slate-900 dark:text-slate-100">
        Fase {phase.phaseId}: {phase.label}
        <span className="ml-2 font-medium text-slate-600 dark:text-slate-400">
          {phase.decisions.length} {phase.decisions.length === 1 ? 'decisión' : 'decisiones'}
        </span>
      </h4>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={`Cerrar decisiones de la fase ${phase.phaseId}`}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
      >
        <X className="w-4 h-4" aria-hidden="true" /> Cerrar
      </button>
    </div>
  );
}
