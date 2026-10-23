import { Award, DollarSign, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Metrics } from '../../../types/game';
import type { MetricCurves } from '../../../game/endReport';
import Sparkline from './Sparkline';
import { METRIC_LABELS, METRIC_ORDER } from './metricLabels';
import Card from '../../common/Card';

const UI: Record<keyof Metrics, { icon: LucideIcon; stroke: string; text: string }> = {
  capital: { icon: DollarSign, stroke: '#0F9D58', text: 'text-emerald-700 dark:text-emerald-400' },
  reputacion: { icon: Award, stroke: '#1B68D2', text: 'text-metric-reputacion dark:text-blue-400' },
  bienestar: { icon: Heart, stroke: '#FF9800', text: 'text-amber-700 dark:text-amber-400' },
};

interface EndMetricsPanelProps {
  metrics: Metrics;
  curves: MetricCurves | null;
}

export default function EndMetricsPanel({ metrics, curves }: EndMetricsPanelProps) {
  const total = curves?.decisions ?? 0;
  const labels = (curves?.slots ?? []).map((slot, i, all) => {
    const before = all.slice(0, i).reduce((sum, s) => sum + s.count, 0);
    return { phaseId: slot.phaseId, left: ((before + slot.count / 2) / total) * 100 };
  });

  return (
    <Card
      as="section"
      aria-label="Cómo se movieron tus métricas"
      className="p-4 sm:p-5 flex flex-col gap-4 h-full"
    >
      <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Cómo se movieron tus métricas</h3>
      <div className="flex-1 flex flex-col justify-around gap-5">
        {METRIC_ORDER.map((key) => {
          const { icon: Icon, stroke, text } = UI[key];
          const curve = curves?.curves.find((c) => c.key === key);
          const delta = curve?.delta ?? 0;
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${text}`}>
                  <Icon className="w-4 h-4" aria-hidden="true" /> {METRIC_LABELS[key]}
                </span>
                <span className="flex items-baseline gap-2">
                  {curve && Math.abs(delta) >= 4 && (
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        delta > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {delta > 0 ? '+' : ''}
                      {delta}
                    </span>
                  )}
                  <span className="text-lg font-black tabular-nums text-slate-900 dark:text-slate-100">{metrics[key]}%</span>
                </span>
              </div>
              {curve && <Sparkline values={curve.series} stroke={stroke} label={METRIC_LABELS[key]} breaks={curves?.breaks} />}
            </div>
          );
        })}
      </div>

      {curves && (
        <div className="relative h-4 text-2xs font-semibold text-slate-500 dark:text-slate-400" aria-hidden="true">
          {labels.map((l) => (
            <span key={l.phaseId} className="absolute -translate-x-1/2" style={{ left: `${l.left}%` }}>
              F{l.phaseId}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
