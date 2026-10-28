import { AlertTriangle, Check } from 'lucide-react';
import { ESTANTES, RECONOCIMIENTOS, estanteDe, tituloDe, type CambiosVitrina, type Estante } from '../../game/reconocimientos';
import type { Tag } from '../../data/tags';

const ESTANTE_TEXT: Record<Estante, { text: string; ring: string }> = {
  negocio: { text: 'text-metric-capital', ring: 'outline-metric-capital' },
  mercado: { text: 'text-metric-reputacion', ring: 'outline-metric-reputacion' },
  equipo: { text: 'text-metric-bienestar', ring: 'outline-metric-bienestar' },
};

const estanteLabel = (id: Estante) => ESTANTES.find((e) => e.id === id)?.label ?? '';

function Trofeo({ tag, size = 'lg' }: { tag: Tag; size?: 'sm' | 'lg' }) {
  const r = RECONOCIMIENTOS[tag];
  const estante = estanteDe(tag);
  if (r.tipo !== 'trofeo' || !estante) return null;
  const Icon = r.icono;
  const ui = ESTANTE_TEXT[estante];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-night-canvas outline outline-2 ${ui.ring} ${ui.text} ${
        size === 'lg' ? 'w-12 h-12' : 'w-7 h-7 outline-[1.5px]'
      }`}
    >
      <Icon className={size === 'lg' ? 'w-6 h-6' : 'w-3.5 h-3.5'} aria-hidden="true" />
    </span>
  );
}

const MOMENT = 'flex items-center gap-3.5 px-4 py-3 rounded-2xl animate-slide-up-fade';

/** En la carta de resultado: lo que se suma a la vitrina o se abre o cierra con esta decisión. */
export function ResultMoments({ cambios }: { cambios: CambiosVitrina }) {
  return (
    <div className="mx-5 sm:mx-7 mt-5 space-y-2.5">
      {cambios.trofeos.map((tag) => {
        const estante = estanteDe(tag);
        return (
          <div key={tag} className={`${MOMENT} bg-slate-100 dark:bg-night-surface`}>
            <Trofeo tag={tag} />
            <span className="flex flex-col gap-0.5 min-w-0">
              <span className={`text-xs font-bold ${estante ? ESTANTE_TEXT[estante].text : ''}`}>Nuevo reconocimiento</span>
              <span className="font-display text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100">{tituloDe(tag)}</span>
              {estante && <span className="text-sm text-slate-600 dark:text-slate-400">Se suma a tu vitrina · {estanteLabel(estante)}</span>}
            </span>
          </div>
        );
      })}
      {cambios.frentesAbiertos.map((tag) => (
        <div key={tag} className={`${MOMENT} bg-rose-50 dark:bg-[#1E1520]`}>
          <span className="flex w-12 h-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-metric-peligro text-metric-peligro">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-bold text-metric-peligro">Nuevo frente abierto</span>
            <span className="font-display text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100">{tituloDe(tag)}</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">Va a pesar hasta que lo resuelvas</span>
          </span>
        </div>
      ))}
      {cambios.frentesCerrados.map((tag) => (
        <div key={tag} className={`${MOMENT} bg-slate-100 dark:bg-night-surface`}>
          <span className="flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-brand-cobalt/10 dark:bg-blue-400/15 text-brand-cobalt dark:text-blue-300">
            <Check className="w-6 h-6" aria-hidden="true" />
          </span>
          <span className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-bold text-brand-cobalt dark:text-blue-300">Frente cerrado</span>
            <span className="font-display text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100 line-through decoration-2 decoration-slate-400">
              {tituloDe(tag)}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">Ya no te pesa</span>
          </span>
        </div>
      ))}
    </div>
  );
}

interface PhaseChangesProps {
  cambios: CambiosVitrina;
  ganados: number;
  total: number;
}

/** En el resumen de fase: lo que la fase sumó, abrió o cerró en la vitrina, con nombres e íconos. */
export function PhaseChanges({ cambios, ganados, total }: PhaseChangesProps) {
  return (
    <div className="space-y-3 animate-slide-up-fade">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-slate-100">Tu vitrina en esta fase</h3>
        <span className="text-sm font-bold tabular-nums text-slate-700 dark:text-slate-200">
          {ganados} <span className="font-medium text-slate-500 dark:text-slate-400">de {total} en total</span>
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {cambios.trofeos.map((tag) => (
          <li key={tag} className="inline-flex items-center gap-2 h-9 pl-1 pr-3.5 rounded-full bg-slate-100 dark:bg-night-card text-sm font-semibold text-slate-800 dark:text-slate-100">
            <Trofeo tag={tag} size="sm" />
            {tituloDe(tag)}
          </li>
        ))}
        {cambios.frentesAbiertos.map((tag) => (
          <li key={tag} className="inline-flex items-center gap-2 h-9 px-3 rounded-full border-[1.5px] border-dashed border-metric-peligro text-sm font-semibold text-slate-800 dark:text-slate-100">
            <AlertTriangle className="w-4 h-4 text-metric-peligro" aria-hidden="true" />
            {tituloDe(tag)}
          </li>
        ))}
        {cambios.frentesCerrados.map((tag) => (
          <li key={tag} className="inline-flex items-center gap-2 h-9 px-3 rounded-full bg-brand-cobalt/10 dark:bg-blue-400/15 text-sm font-semibold text-brand-cobalt dark:text-blue-300">
            <Check className="w-4 h-4" aria-hidden="true" />
            <span className="line-through decoration-2">{tituloDe(tag)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
