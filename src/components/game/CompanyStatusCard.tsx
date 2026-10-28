import type { Archetype, Financing } from '../../types/game';
import type { Tag } from '../../data/tags';
import { buildCompanyStory } from '../../game/companyStory';
import CompanyStory from './CompanyStory';
import Vitrina, { PuntoDePartida } from './Vitrina';
import { Building2 } from 'lucide-react';
import Card from '../common/Card';

interface CompanyStatusCardProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  activeTags: Tag[];
}

/** Mi empresa: relato del estado actual, punto de partida y vitrina de reconocimientos. */
export default function CompanyStatusCard({ arquetipo, financiamiento, activeTags }: CompanyStatusCardProps) {
  const story = buildCompanyStory(activeTags, 4);

  return (
    <Card className="p-4 space-y-4 transition-colors">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Mi empresa</h3>
      </div>

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
