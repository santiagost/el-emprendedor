import type { Metrics } from '../../../types/game';

export const METRIC_LABELS: Record<keyof Metrics, string> = {
  capital: 'Capital',
  reputacion: 'Reputación',
  bienestar: 'Bienestar',
};
export const METRIC_ORDER: (keyof Metrics)[] = ['capital', 'reputacion', 'bienestar'];
