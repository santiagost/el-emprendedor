import type { Archetype, Financing, Metrics } from '../../types/game';
import { TAGS, type Tag } from '../../data/tags';
import { buildCompanyStory } from '../../game/companyStory';
import CompanyStory from './CompanyStory';
import { Building2, Repeat } from 'lucide-react';
import Card from '../common/Card';

interface CompanyStatusCardProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  activeTags: Tag[];
}

/** Cifras de un efecto pasivo: cada una con el color de su métrica, las bajas en coral. */
const MOD_UI: { key: keyof Metrics; short: string; up: string }[] = [
  { key: 'capital', short: 'Cap.', up: 'text-metric-capital' },
  { key: 'reputacion', short: 'Rep.', up: 'text-metric-reputacion' },
  { key: 'bienestar', short: 'Bien.', up: 'text-metric-bienestar' },
];

/** Mi empresa: perfil, financiamiento, relato del estado actual y efectos pasivos. */
export default function CompanyStatusCard({ arquetipo, financiamiento, activeTags }: CompanyStatusCardProps) {
  const story = buildCompanyStory(activeTags, 4);

  return (
    <Card className="p-4 space-y-3.5 transition-colors">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Mi empresa</h3>
      </div>

      {/* Perfil y Financiamiento */}
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
        <dt className="text-slate-500 dark:text-slate-400">Perfil</dt>
        <dd className="font-semibold text-slate-800 dark:text-slate-200 truncate">{arquetipo.titulo}</dd>
        <dt className="text-slate-500 dark:text-slate-400">Financiamiento</dt>
        <dd className="font-semibold text-slate-800 dark:text-slate-200 truncate">{financiamiento.titulo}</dd>
      </dl>

      {/* Relato del estado actual */}
      {story.length > 0 && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <CompanyStory segments={story} className="text-sm" />
        </div>
      )}

      {/* Efectos pasivos */}
      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-baseline justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Repeat className="w-4 h-4" aria-hidden="true" />
            Efectos activos ({activeTags.length})
          </span>
          {activeTags.length > 0 && <span className="text-xs text-slate-500 dark:text-slate-400">se aplican cada turno</span>}
        </div>

        {activeTags.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic py-1">
            No acumulaste rasgos pasivos aún. Se desbloquearán según tus elecciones.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {activeTags.map((tag) => {
              const tagConfig = TAGS[tag];
              if (!tagConfig) return null;
              const mods = (tagConfig.modifiers ?? {}) as Partial<Metrics>;
              const figures = MOD_UI.filter(({ key }) => mods[key]);

              return (
                <li
                  key={tag}
                  title={tagConfig.description}
                  className="flex items-center justify-between gap-2 min-h-9 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-night-card text-sm font-semibold text-slate-800 dark:text-slate-100"
                >
                  <span className="min-w-0">{tagConfig.label}</span>
                  {figures.length > 0 ? (
                    <span className="flex shrink-0 gap-2.5 tabular-nums">
                      {figures.map(({ key, short, up }) => {
                        const value = mods[key] as number;
                        return (
                          <span key={key} className={value > 0 ? up : 'text-metric-peligro'}>
                            {value > 0 ? '+' : '−'}
                            {Math.abs(value)} {short}
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs font-normal text-slate-500 dark:text-slate-400">sin efecto numérico</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
