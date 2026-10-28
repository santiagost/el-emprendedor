import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CircleStar } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';
import FloatingDelta from './FloatingDelta';

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: 'capital' | 'reputacion' | 'bienestar';
  delta?: number;
  deltaKey?: number | string;
  delayMs?: number;
  isCalculating?: boolean;
  /** `tile`: tarjeta del HUD superior (móvil y tablet). `row`: fila del tablero lateral en escritorio (B2), cifra primero. */
  layout?: 'tile' | 'row';
}

export default function MetricCard({
  label,
  value,
  icon: Icon,
  variant,
  delta,
  deltaKey,
  delayMs = 0,
  isCalculating = false,
  layout = 'tile',
}: MetricCardProps) {
  const isRow = layout === 'row';
  const animatedValue = useCountUp(value, 700, delayMs);
  const isMax = value >= 100;
  const isCritical = value <= 25;
  const StateIcon = isMax ? CircleStar : AlertTriangle;
  // Rótulos de estado: en el tile angosto del móvil solo quedan para lectores de pantalla
  const badgeVisibility = isRow ? '' : 'max-sm:sr-only ';

  // Estado para la barra fantasma (trail al recibir reducciones)
  const [ghostValue, setGhostValue] = useState<number>(value);
  const [prevValue, setPrevValue] = useState<number>(value);

  // Sincronización durante render cuando cambia value
  if (value !== prevValue) {
    setPrevValue(value);
    if (value < prevValue) {
      // Mantiene la barra fantasma en el valor previo más alto
      setGhostValue(prevValue);
    } else {
      // Si sube, la barra fantasma acompaña de inmediato
      setGhostValue(value);
    }
  }

  // Después del retardo (delayMs + 400ms), la barra fantasma se contrae hacia el nuevo valor
  useEffect(() => {
    if (ghostValue > value) {
      const timer = setTimeout(() => {
        setGhostValue(value);
      }, delayMs + 400);
      return () => clearTimeout(timer);
    }
  }, [value, ghostValue, delayMs]);

  // Pulso de borde al recibir un delta (asíncrono vía timers para evitar cascading renders)
  const [pulse, setPulse] = useState<'positive' | 'negative' | null>(null);

  useEffect(() => {
    if (delta === undefined || delta === 0) return;
    const type = delta > 0 ? 'positive' : 'negative';

    const startTimer = setTimeout(() => {
      setPulse(type);
    }, delayMs);

    const endTimer = setTimeout(() => {
      setPulse(null);
    }, delayMs + 400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [deltaKey, delta, delayMs]);

  // Un color por métrica (tokens metric-*, que ya cambian entre claro y oscuro)
  const variantStyles = {
    capital: {
      text: 'text-metric-capital',
      bar: 'bg-metric-capital',
      iconText: 'text-metric-capital',
    },
    reputacion: {
      text: 'text-metric-reputacion',
      bar: 'bg-metric-reputacion',
      iconText: 'text-metric-reputacion',
    },
    bienestar: {
      text: 'text-metric-bienestar',
      bar: 'bg-metric-bienestar',
      iconText: 'text-metric-bienestar',
    },
  }[variant];

  // Configuración de estado especial
  let cardClasses = isRow
    ? 'relative flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300'
    : 'relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-300';
  let valueClasses = 'font-display text-xs sm:text-sm font-extrabold flex items-center justify-center tabular-nums';
  let barClasses = 'h-full rounded-full';

  if (pulse === 'positive') {
    cardClasses += ' metric-pulse-positive';
  } else if (pulse === 'negative') {
    cardClasses += ' metric-pulse-negative';
  }

  if (isMax) {
    // Estado Dorado al Máximo (100%)
    cardClasses +=
      ' metric-max-glow scale-[1.03] z-10 bg-gradient-to-b from-amber-50 to-amber-100/50 dark:from-amber-950/60 dark:via-slate-900 dark:to-slate-950 border-amber-400 text-amber-700 dark:text-amber-300 shadow-md shadow-amber-500/20';
    valueClasses = 'font-display text-xs sm:text-sm font-black text-amber-600 dark:text-amber-300 tracking-tight flex items-center gap-0.5 tabular-nums';
    barClasses += ' bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]';
  } else if (isCritical) {
    // Estado Crítico / Alerta Peligro (<= 25%)
    cardClasses +=
      ' metric-danger-blink bg-rose-50 dark:bg-rose-950/90 border-rose-500 text-rose-700 dark:text-rose-300 shadow-lg shadow-rose-950/30 dark:shadow-rose-950/70 z-10';
    valueClasses = 'font-display text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 tracking-tight flex items-center gap-1 tabular-nums';
    barClasses += ' bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]';
  } else {
    // Normal
    cardClasses += ' bg-white dark:bg-night-surface border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700';
    valueClasses += ` ${variantStyles.text}`;
    barClasses += ` ${variantStyles.bar}`;
  }

  if (isRow) valueClasses = valueClasses.replace('text-xs sm:text-sm', 'text-3xl leading-none');

  if (isCalculating) {
    cardClasses += ' ring-2 ring-indigo-500/40 border-indigo-400/60 dark:border-indigo-500/60 transition-all';
  }

  return (
    <div className={cardClasses}>
      {/* Delta flotante animado con su respectivo stagger */}
      <FloatingDelta key={deltaKey} delta={delta} upClassName={variantStyles.text} delayMs={delayMs} />

      <div className={isRow ? 'flex-1 min-w-0 space-y-2' : 'contents'}>
      {/* Badge de estado superior */}
      <div className="w-full flex items-center justify-between text-xs font-semibold mb-1">
        <span className="flex min-w-0 items-center text-slate-500 dark:text-slate-400 uppercase tracking-wider max-sm:tracking-normal text-xs font-bold">
          {/* En las fichas angostas del móvil no entra el rótulo de estado: el ícono de la métrica pasa a ser el del estado */}
          {!isRow && (isMax || isCritical) && !isCalculating && (
            <StateIcon className={`sm:hidden w-3.5 h-3.5 mr-1 shrink-0 ${isMax ? 'text-amber-500 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`} />
          )}
          <Icon
            className={`${!isRow && (isMax || isCritical) && !isCalculating ? 'hidden sm:block ' : ''}w-3.5 h-3.5 mr-1 shrink-0 ${
              isCalculating
                ? 'animate-pulse text-indigo-500 dark:text-indigo-400'
                : isMax
                ? 'text-amber-500 dark:text-amber-400'
                : isCritical
                ? 'text-rose-600 dark:text-rose-400'
                : variantStyles.iconText
            }`}
          />
          {label}
        </span>

        {isCalculating ? (
          <span className={`${badgeVisibility}flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider animate-pulse`}>
            Calculando…
          </span>
        ) : isMax ? (
          <span className={`${badgeVisibility}flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/50`}>
            <CircleStar className="w-2.5 h-2.5" /> MÁX
          </span>
        ) : isCritical ? (
          <span className={`${badgeVisibility}flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-600/20 dark:bg-rose-600/30 text-rose-700 dark:text-rose-200 text-xs font-extrabold uppercase tracking-wider border border-rose-500 animate-pulse`}>
            <AlertTriangle className="w-2.5 h-2.5" /> CRÍTICO
          </span>
        ) : null}
      </div>

      {/* Valor numérico con interpolación useCountUp (en fila va a la derecha, después de la barra) */}
      {!isRow && (
        <div className="my-0.5">
          <span className={valueClasses}>
            {animatedValue}%
          </span>
        </div>
      )}

      {/* Barra de progreso con capa fantasma (ghost bar) */}
      <div className="relative w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 sm:h-2 rounded-full overflow-hidden mt-1 border border-slate-200 dark:border-slate-700/40">
        {/* Barra fantasma para registrar reducciones de métrica */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-rose-400/60 dark:bg-rose-500/50 transition-all duration-500 ease-out"
          style={{
            width: `${Math.max(0, Math.min(100, ghostValue))}%`,
          }}
        />

        {/* Barra de valor activa sincronizada con animatedValue */}
        <div
          className={`relative ${barClasses}`}
          style={{ width: `${Math.max(0, Math.min(100, animatedValue))}%` }}
        />
      </div>
      </div>

      {isRow && (
        <span className={valueClasses}>
          {animatedValue}%
        </span>
      )}
    </div>
  );
}
