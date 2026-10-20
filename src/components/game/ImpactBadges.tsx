import type { ImpactPreview, ImpactDirection } from '../../types/game';
import { DollarSign, Award, Heart } from 'lucide-react';

interface ImpactBadgesProps {
  impactPreview: ImpactPreview;
  size?: 'sm' | 'md';
}

const renderArrow = (direction: ImpactDirection) => {
  if (direction === 'up') return '↑';
  if (direction === 'down') return '↓';
  return '→';
};

const getColorClass = (direction: ImpactDirection, activeColor: string) => {
  if (direction === 'up') return activeColor;
  if (direction === 'down') return 'text-rose-600 dark:text-rose-400';
  return 'text-slate-400 dark:text-slate-500';
};

export default function ImpactBadges({ impactPreview, size = 'sm' }: ImpactBadgesProps) {
  const isSm = size === 'sm';
  const textClass = isSm ? 'text-[10px]' : 'text-xs';
  const iconClass = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div className={`flex items-center gap-2 ${textClass} font-semibold font-mono`}>
      <span
        title={`Capital: ${impactPreview.capital}`}
        className={`inline-flex items-center gap-0.5 ${getColorClass(
          impactPreview.capital,
          'text-emerald-600 dark:text-emerald-400'
        )}`}
      >
        <DollarSign className={iconClass} />
        {renderArrow(impactPreview.capital)}
      </span>

      <span
        title={`Reputación: ${impactPreview.reputacion}`}
        className={`inline-flex items-center gap-0.5 ${getColorClass(
          impactPreview.reputacion,
          'text-[#1B68D2] dark:text-blue-400'
        )}`}
      >
        <Award className={iconClass} />
        {renderArrow(impactPreview.reputacion)}
      </span>

      <span
        title={`Bienestar: ${impactPreview.bienestar}`}
        className={`inline-flex items-center gap-0.5 ${getColorClass(
          impactPreview.bienestar,
          'text-amber-500 dark:text-amber-400'
        )}`}
      >
        <Heart className={iconClass} />
        {renderArrow(impactPreview.bienestar)}
      </span>
    </div>
  );
}
