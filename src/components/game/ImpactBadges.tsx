import type { ImpactPreview, ImpactDirection } from '../../types/game';
import { DollarSign, Award, Heart } from 'lucide-react';

interface ImpactBadgesProps {
  impactPreview: ImpactPreview;
  size?: 'sm' | 'md';
  /** Dice el impacto con palabras ("Capital baja") en lugar de solo ícono y flecha (Setup, A4). */
  withWords?: boolean;
}

const renderArrow = (direction: ImpactDirection) => {
  if (direction === 'up') return '↑';
  if (direction === 'down') return '↓';
  return '→';
};

const DIRECTION_WORDS: Record<ImpactDirection, string> = {
  up: 'sube',
  down: 'baja',
  neutral: 'se mantiene',
};

const getColorClass = (direction: ImpactDirection, activeColor: string) => {
  if (direction === 'up') return activeColor;
  if (direction === 'down') return 'text-metric-peligro';
  return 'text-slate-500 dark:text-slate-400';
};

const METRICS = [
  { key: 'capital', label: 'Capital', icon: DollarSign, color: 'text-metric-capital' },
  { key: 'reputacion', label: 'Reputación', icon: Award, color: 'text-metric-reputacion' },
  { key: 'bienestar', label: 'Bienestar', icon: Heart, color: 'text-metric-bienestar' },
] as const;

export default function ImpactBadges({ impactPreview, size = 'sm', withWords = false }: ImpactBadgesProps) {
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (withWords) {
    return (
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        {METRICS.map(({ key, label, icon: Icon, color }) => {
          const direction = impactPreview[key];
          return (
            <span
              key={key}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${direction === 'down' ? 'border-dashed border-current' : 'border-current/30'} ${getColorClass(direction, color)}`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {label} {DIRECTION_WORDS[direction]}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-semibold font-mono">
      {METRICS.map(({ key, label, icon: Icon, color }) => (
        <span
          key={key}
          title={`${label}: ${impactPreview[key]}`}
          className={`inline-flex items-center gap-0.5 ${getColorClass(impactPreview[key], color)}`}
        >
          <Icon className={iconClass} />
          {renderArrow(impactPreview[key])}
        </span>
      ))}
    </div>
  );
}
