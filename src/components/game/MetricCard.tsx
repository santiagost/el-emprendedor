import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Sparkles } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: 'capital' | 'reputacion' | 'bienestar';
}

export default function MetricCard({ label, value, icon: Icon, variant }: MetricCardProps) {
  const isMax = value >= 100;
  const isCritical = value <= 25;

  // Variantes temáticas (Stitch: Capital Esmeralda, Reputación Cobalto, Bienestar Ámbar)
  const variantStyles = {
    capital: {
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-[#0F9D58] dark:bg-emerald-500',
      iconText: 'text-[#0F9D58] dark:text-emerald-400',
    },
    reputacion: {
      text: 'text-[#1B68D2] dark:text-blue-400',
      bar: 'bg-[#1B68D2] dark:bg-blue-500',
      iconText: 'text-[#1B68D2] dark:text-blue-400',
    },
    bienestar: {
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-[#FF9800] dark:bg-amber-400',
      iconText: 'text-[#FF9800] dark:text-amber-400',
    },
  }[variant];

  // Configuración de estado especial
  let cardClasses =
    'relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-300';
  let valueClasses = 'text-xs sm:text-sm font-extrabold flex items-center justify-center';
  let barClasses = 'h-full transition-all duration-500 rounded-full';

  if (isMax) {
    // Estado Dorado al Máximo (100%)
    cardClasses +=
      ' metric-max-glow scale-[1.03] z-10 bg-gradient-to-b from-amber-50 to-amber-100/50 dark:from-amber-950/60 dark:via-slate-900 dark:to-slate-950 border-amber-400 text-amber-700 dark:text-amber-300 shadow-md shadow-amber-500/20';
    valueClasses = 'text-xs sm:text-sm font-black text-amber-600 dark:text-amber-300 tracking-tight flex items-center gap-0.5';
    barClasses = 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]';
  } else if (isCritical) {
    // Estado Crítico / Alerta Peligro (<= 25%)
    cardClasses +=
      ' metric-danger-blink bg-rose-50 dark:bg-rose-950/90 border-rose-500 text-rose-700 dark:text-rose-300 shadow-lg shadow-rose-950/30 dark:shadow-rose-950/70 z-10';
    valueClasses = 'text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 tracking-tight flex items-center gap-1';
    barClasses = 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]';
  } else {
    // Normal
    cardClasses += ' bg-white dark:bg-[#0B1E33] border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700';
    valueClasses += ` ${variantStyles.text}`;
    barClasses += ` ${variantStyles.bar}`;
  }

  return (
    <div className={cardClasses}>
      {/* Badge de estado superior */}
      <div className="w-full flex items-center justify-between text-[10px] font-semibold mb-1">
        <span className="flex items-center text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[9px] sm:text-[10px] font-bold">
          <Icon className={`w-3.5 h-3.5 mr-1 shrink-0 ${isMax ? 'text-amber-500 dark:text-amber-400' : isCritical ? 'text-rose-600 dark:text-rose-400' : variantStyles.iconText}`} />
          {label}
        </span>

        {isMax && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[8px] font-bold uppercase tracking-wider border border-amber-400/50">
            <Sparkles className="w-2.5 h-2.5" /> MÁX
          </span>
        )}

        {isCritical && (
          <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-600/20 dark:bg-rose-600/30 text-rose-700 dark:text-rose-200 text-[8px] font-extrabold uppercase tracking-wider border border-rose-500 animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" /> CRÍTICO
          </span>
        )}
      </div>

      {/* Valor numérico */}
      <div className="my-0.5">
        <span className={valueClasses}>
          {value}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 sm:h-2 rounded-full overflow-hidden mt-1 border border-slate-200 dark:border-slate-700/40">
        <div
          className={barClasses}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
