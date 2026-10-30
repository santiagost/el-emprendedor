import type { Archetype, Financing, Objetivo } from '../../types/game';
import type { Tag } from '../../data/tags';
import { buildCompanyStory } from '../../game/companyStory';
import CompanyStory from './CompanyStory';
import Vitrina, { PuntoDePartida } from './Vitrina';
import { Building2, Target } from 'lucide-react';
import Card from '../common/Card';

interface CompanyStatusCardProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  activeTags: Tag[];
  /** Objetivo elegido al empezar; las partidas guardadas antes de que existiera no lo tienen. */
  objetivo?: Objetivo;
}

/** Mi empresa: relato del estado actual, punto de partida y vitrina de reconocimientos. */
export default function CompanyStatusCard({ arquetipo, financiamiento, activeTags, objetivo }: CompanyStatusCardProps) {
  const story = buildCompanyStory(activeTags, 4);

  return (
    <Card className="p-4 space-y-4 transition-colors">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Mi empresa</h3>
      </div>

      {/* Lo que elegiste lograr al empezar */}
      {objetivo && (
        <div className="space-y-1.5 rounded-xl bg-slate-50 dark:bg-night-canvas p-3">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Target className="w-3.5 h-3.5" aria-hidden="true" /> Tu objetivo
          </span>
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{objetivo.titulo}</p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{objetivo.descripcion}</p>
        </div>
      )}

      {/* Relato del estado actual */}
      {story.length > 0 && <CompanyStory segments={story} className="text-sm" />}

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <PuntoDePartida arquetipo={arquetipo} financiamiento={financiamiento} activeTags={activeTags} />
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <Vitrina activeTags={activeTags} />
      </div>
    </Card>
  );
}
