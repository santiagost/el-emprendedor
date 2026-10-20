import type { Metrics } from '../types/game';

export interface MetricDeltas {
  capital?: number;
  reputacion?: number;
  bienestar?: number;
}

/**
 * Calcula la diferencia neta de métricas entre el estado previo y el actual.
 * Omite (undefined) cualquier métrica que no haya sufrido variación (delta === 0).
 */
export function computeMetricDeltas(prev: Metrics, next: Metrics): MetricDeltas {
  const dCap = next.capital - prev.capital;
  const dRep = next.reputacion - prev.reputacion;
  const dBien = next.bienestar - prev.bienestar;

  return {
    capital: dCap !== 0 ? dCap : undefined,
    reputacion: dRep !== 0 ? dRep : undefined,
    bienestar: dBien !== 0 ? dBien : undefined,
  };
}
