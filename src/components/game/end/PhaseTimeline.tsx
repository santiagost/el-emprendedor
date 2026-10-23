import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { PhaseStatus, TimelinePhase } from '../../../game/endReport';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { DecisionList, PanelHeader } from './DecisionsPanel';

const STATUS_LABEL: Record<PhaseStatus, string> = {
  completed: 'Completada',
  cut: 'Acá terminó tu camino',
  incomplete: 'Incompleta',
  not_reached: 'No alcanzada',
};

function interruptionsText({ crises, unforeseen }: { crises: number; unforeseen: number }): string {
  const parts = [
    crises > 0 ? `${crises} crisis` : '',
    unforeseen > 0 ? `${unforeseen} ${unforeseen === 1 ? 'imprevisto' : 'imprevistos'}` : '',
  ].filter(Boolean);
  return parts.length ? `Enfrentaste ${parts.join(' y ')}.` : 'Sin interrupciones en esta fase.';
}

/** Ventana fija con scroll propio: se cierra con el botón, tocando afuera o con Escape. */
function DecisionsModal({ phase, onClose }: { phase: TimelinePhase; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`decisiones-fase-${phase.phaseId}`}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col w-full sm:max-w-xl max-h-[88dvh] bg-white dark:bg-night-surface border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <PanelHeader phase={phase} onClose={onClose} closeRef={closeRef} />
        </div>
        <div className="overflow-y-auto overscroll-contain p-4">
          <DecisionList decisions={phase.decisions} />
        </div>
      </div>
    </div>
  );
}

export default function PhaseTimeline({ phases }: { phases: TimelinePhase[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const isWide = useMediaQuery('(min-width: 1024px)');
  const close = useCallback(() => setOpenId(null), []);
  const open = phases.find((p) => p.phaseId === openId && p.decisions.length > 0) ?? null;
  const hasCut = phases.some((p) => p.status === 'cut');

  return (
    <section aria-labelledby="recorrido-fases" className="space-y-4">
      <div className="space-y-1">
        <h3 id="recorrido-fases" className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          Tu recorrido, fase por fase
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tocá una fase para ver sus decisiones y cómo salió cada una.{hasCut ? ' La línea se corta donde cayó tu empresa.' : ''}
        </p>
      </div>

      <ol className="flex flex-col lg:flex-row lg:gap-4">
        {phases.map((p, i) => {
          const reached = p.status !== 'not_reached';
          const cut = p.status === 'cut';
          const last = i === phases.length - 1;
          const selected = open?.phaseId === p.phaseId;
          const dot = cut ? 'bg-rose-600 border-rose-600 dark:bg-rose-400 dark:border-rose-400' : reached ? 'bg-brand-cobalt border-brand-cobalt dark:bg-blue-500 dark:border-blue-500' : 'border-dashed border-slate-400 dark:border-slate-500';
          const line = reached && !cut
            ? 'bg-brand-cobalt dark:bg-blue-500'
            : 'border-slate-300 dark:border-slate-600 border-dashed border-l-2 lg:border-l-0 lg:border-t-2 bg-transparent';
          return (
            <li key={p.phaseId} className="flex-1 min-w-0 grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 lg:grid-cols-1 lg:grid-rows-[auto_1fr] lg:gap-y-3">
              {/* Riel: círculo y línea; vertical en pantallas chicas, horizontal arriba de cada fase en escritorio */}
              <div className="flex flex-col lg:flex-row items-center gap-2 pt-5 lg:pt-0 lg:h-[22px]" aria-hidden="true">
                <span className={`shrink-0 w-4 h-4 rounded-full border-2 ${dot}`} />
                <span className={`${cut ? 'h-6 lg:h-[3px]' : 'flex-1 lg:h-[3px]'} lg:flex-1 w-0.5 lg:w-auto rounded-sm ${line} ${last && !cut ? 'invisible lg:visible' : ''}`} />
                {cut && (
                  <span className="shrink-0 w-[22px] h-[22px] rounded-full bg-rose-600 dark:bg-rose-400 text-white dark:text-slate-900 inline-flex items-center justify-center">
                    <X className="w-3 h-3" strokeWidth={3.5} />
                  </span>
                )}
              </div>

              {reached ? (
                <button
                  type="button"
                  aria-expanded={selected}
                  disabled={p.decisions.length === 0}
                  onClick={() => setOpenId(selected ? null : p.phaseId)}
                  className={`mb-4 lg:mb-0 text-left flex flex-col gap-2.5 p-4 rounded-2xl border-2 bg-white dark:bg-night-surface shadow-sm transition-colors ${
                    selected ? 'border-brand-cobalt dark:border-blue-400' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="space-y-0.5">
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-brand-cobalt-hover dark:text-blue-300">
                      Fase {p.phaseId} · Turnos {p.fromTurn} a {p.toTurn}
                    </span>
                    <span className="block text-base font-extrabold leading-tight text-slate-900 dark:text-slate-100">{p.label}</span>
                  </span>
                  {p.recap && (
                    <span className="self-start px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                      {p.recap.trend.label}
                    </span>
                  )}
                  {cut && (
                    <span className="self-start px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-xs font-extrabold text-rose-700 dark:text-rose-300">
                      {STATUS_LABEL.cut}
                    </span>
                  )}
                  {p.status === 'incomplete' && (
                    <span className="self-start px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-xs font-extrabold text-amber-800 dark:text-amber-300">
                      {STATUS_LABEL.incomplete}
                    </span>
                  )}
                  {p.recap && <span className="text-sm leading-snug text-slate-900 dark:text-slate-100">{p.recap.headline}</span>}
                  {p.recap?.keyDecision && (
                    <span className="text-sm leading-snug text-slate-600 dark:text-slate-300">
                      <strong className="font-extrabold text-slate-900 dark:text-slate-100">Decisión clave:</strong> «{p.recap.keyDecision.text}» (turno {p.recap.keyDecision.turn})
                    </span>
                  )}
                  {p.recap && <span className="text-xs text-slate-600 dark:text-slate-400">{interruptionsText(p.recap.interruptions)}</span>}
                  {p.decisions.length > 0 && (
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-brand-cobalt-hover dark:text-blue-300">
                      <span>{selected ? 'Ocultar decisiones' : `Ver ${p.decisions.length} ${p.decisions.length === 1 ? 'decisión' : 'decisiones'}`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${selected && isWide ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </span>
                  )}
                </button>
              ) : (
                <div className="mb-4 lg:mb-0 flex flex-col gap-1.5 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Fase {p.phaseId} · Turnos {p.fromTurn} a {p.toTurn}
                  </span>
                  <span className="text-base font-extrabold leading-tight">{p.label}</span>
                  <span className="text-sm">No llegaste a esta fase.</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {open && isWide && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-night-surface shadow-sm space-y-3 animate-slide-up-fade">
          <PanelHeader phase={open} onClose={close} />
          <DecisionList decisions={open.decisions} />
        </div>
      )}
      {open && !isWide && <DecisionsModal phase={open} onClose={close} />}
    </section>
  );
}
