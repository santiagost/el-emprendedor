import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { splitPivots, type Outlook } from '../../../game/endReport';
import type { Retrospective, Verdict } from '../../../game/retrospective';
import { VerdictBadge } from './Verdict';

interface KeyMomentCardProps {
  retrospective: Retrospective;
  outlook: Outlook | null;
  lost: boolean;
}

const LABEL = 'text-xs font-extrabold uppercase tracking-wider';

export default function KeyMomentCard({ retrospective, outlook, lost }: KeyMomentCardProps) {
  const { totals, pivots, projectionText, disclaimer } = retrospective;
  const [showOthers, setShowOthers] = useState(false);
  if (totals.total === 0) return null;
  const { main, others } = splitPivots(pivots);

  return (
    <section aria-labelledby="momento-clave" className="space-y-3.5">
      <div className="space-y-1">
        <h3 id="momento-clave" className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {main ? 'El momento que pudo cambiar tu final' : 'Tus decisiones frente a las alternativas'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {main
            ? lost
              ? 'Con lo que sabés ahora, este fue el momento donde más podías cambiar el rumbo.'
              : 'Con lo que sabés ahora, esta fue la decisión donde más margen tenías.'
            : 'Comparé cada decisión con la otra opción que tenías.'}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1.5">
          {(['good', 'reasonable', 'could_be_better'] as Verdict[]).map((v) =>
            totals[v] > 0 ? (
              <span key={v} className="inline-flex items-center gap-1.5">
                <VerdictBadge verdict={v} />
                <span className="text-xs font-black tabular-nums text-slate-700 dark:text-slate-200">×{totals[v]}</span>
              </span>
            ) : null
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-start">
          {main && (
            <div className="flex-1 min-w-0 grid grid-cols-[24px_minmax(0,1fr)] gap-x-2.5">
              {/* Turno y título */}
              <div className="flex flex-col items-center">
                <span className="shrink-0 w-[22px] h-[22px] rounded-full bg-[#0052CC] dark:bg-blue-500 border-[5px] border-blue-100 dark:border-blue-950" aria-hidden="true" />
                <span className="flex-1 w-0.5 bg-[#0052CC] dark:bg-blue-500" aria-hidden="true" />
              </div>
              <div className="pb-3.5 min-w-0">
                <p className={`${LABEL} text-[#0047B3] dark:text-blue-300`}>Turno {main.turn}</p>
                <p className="text-base font-extrabold leading-snug text-slate-900 dark:text-slate-100">{main.eventTitle}</p>
              </div>

              {/* Lo que elegiste */}
              <div className="ml-[11px] border-l-2 border-[#0052CC] dark:border-blue-500 relative" aria-hidden="true">
                <span className="absolute left-0 top-7 w-3 border-t-2 border-[#0052CC] dark:border-blue-500" />
              </div>
              <div className="pb-3.5 min-w-0">
                <div className="p-3 rounded-xl border-2 border-[#0052CC] dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10 space-y-1">
                  <p className={`${LABEL} text-[#0047B3] dark:text-blue-300`}>Lo que elegiste</p>
                  <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">{main.chosenText}</p>
                </div>
              </div>

              {/* El otro camino */}
              <div className="ml-[11px] w-3 h-7 border-l-2 border-b-2 border-dashed border-slate-400 dark:border-slate-500 rounded-bl-[10px] box-content" aria-hidden="true" />
              <div className="min-w-0">
                <div className="p-3 rounded-xl border-2 border-dashed border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-950/50 space-y-1">
                  <p className={`${LABEL} text-slate-600 dark:text-slate-300`}>El otro camino</p>
                  <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">{main.altText}</p>
                  {outlook && (
                    <span className="inline-flex mt-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                      {outlook.altBenefit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="lg:flex-1 min-w-0 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <p className={`${LABEL} text-slate-600 dark:text-slate-400`}>Tu final probable</p>
            {outlook ? (
              <>
                <p className="text-3xl font-black leading-tight tracking-tight text-[#0047B3] dark:text-blue-300">{outlook.big}</p>
                <p className="text-sm leading-snug text-slate-800 dark:text-slate-200">{outlook.small}</p>
              </>
            ) : (
              <p className="text-sm leading-snug text-slate-800 dark:text-slate-200">{projectionText}</p>
            )}
            <p className="text-xs leading-snug text-slate-600 dark:text-slate-400">{disclaimer}</p>
          </div>
        </div>

        {main?.lesson && (
          <p className="pt-4 border-t border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="font-extrabold text-slate-900 dark:text-slate-100">Lo que se aprende:</strong> {main.lesson}
          </p>
        )}

        {others.length > 0 && (
          <div className="space-y-3">
            <button
              type="button"
              aria-expanded={showOthers}
              onClick={() => setShowOthers((v) => !v)}
              className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>
                {showOthers
                  ? others.length === 1 ? 'Ocultar el otro momento' : 'Ocultar los otros momentos'
                  : others.length === 1 ? 'Ver el otro momento clave' : `Ver los otros ${others.length} momentos clave`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showOthers ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {showOthers && (
              <ul className="space-y-2.5">
                {others.map((p) => (
                  <li key={p.analysis.logIndex} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-1.5">
                    <p className={`${LABEL} text-[#0047B3] dark:text-blue-300`}>
                      Turno {p.turn} · {p.eventTitle}
                    </p>
                    <p className="text-sm leading-snug text-slate-900 dark:text-slate-100">
                      <strong className="font-extrabold">Elegiste:</strong> {p.chosenText}
                    </p>
                    <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">
                      <strong className="font-extrabold text-slate-900 dark:text-slate-100">Otro camino:</strong> {p.altText}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
