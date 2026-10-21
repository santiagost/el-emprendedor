import type { DecisionLogEntry, Metrics } from '../types/game';

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

/**
 * Determina el tiempo de suspenso (en ms) antes de revelar las consecuencias de una decisión.
 * - Modo reduced-motion: 0 ms (salto instantáneo).
 * - Crisis o imprevistos: 1000 ms.
 * - Eventos normales: 350 ms.
 */
export function getRevealingDuration(kind?: string, isReducedMotion?: boolean): number {
  if (isReducedMotion) {
    return 0;
  }
  if (kind === 'crisis' || kind === 'unforeseen') {
    return 1000;
  }
  return 350;
}

/**
 * Efecto neto aproximado de una decisión: efecto de la opción + modificadores pasivos de tags.
 * Se usa como respaldo cuando no hay delta real medido (por ejemplo, al recargar en pleno outcome).
 * No contempla el clamp a 0-100, por eso el delta real tiene prioridad cuando existe.
 */
export function netDecisionEffect(entry: DecisionLogEntry): MetricDeltas {
  const sum = (key: keyof Metrics) => {
    const total = (entry.effects[key] ?? 0) + (entry.appliedModifiers?.[key] ?? 0);
    return total !== 0 ? total : undefined;
  };

  return {
    capital: sum('capital'),
    reputacion: sum('reputacion'),
    bienestar: sum('bienestar'),
  };
}

const STRESS_CALM_AT = 70;
const STRESS_MAX_AT = 15;

/**
 * Nivel de estrés visual (0-1) según la métrica más baja.
 * - min(metrics) >= 70 → 0
 * - min(metrics) <= 15 → 1
 * - Interpolación lineal en el medio.
 */
export function stressLevel(metrics: Metrics): number {
  const lowest = Math.min(metrics.capital, metrics.reputacion, metrics.bienestar);
  if (lowest >= STRESS_CALM_AT) return 0;
  if (lowest <= STRESS_MAX_AT) return 1;
  return (STRESS_CALM_AT - lowest) / (STRESS_CALM_AT - STRESS_MAX_AT);
}
