import { useState } from 'react';
import { useReducedMotion } from '../../lib/motion';

interface FloatingDeltaProps {
  delta?: number;
  /** Clases de color de la métrica para las subidas; las bajas van en coral punteado. */
  upClassName?: string;
  delayMs?: number;
  onComplete?: () => void;
}

export default function FloatingDelta({ delta, upClassName = '', delayMs = 0, onComplete }: FloatingDeltaProps) {
  const isReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  if (delta === undefined || delta === 0 || !visible) {
    return null;
  }

  // Si reduced motion está activo, omitimos la animación flotante para no distraer
  if (isReducedMotion) {
    return null;
  }

  const isPositive = delta > 0;
  const sign = isPositive ? '+' : '';
  const colorClasses = isPositive
    ? `bg-white/95 dark:bg-night-surface/95 border-current/40 ${upClassName}`
    : 'text-metric-peligro border-dashed border-metric-peligro bg-white/95 dark:bg-night-surface/95';

  return (
    <div
      style={delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
      onAnimationEnd={() => {
        setVisible(false);
        onComplete?.();
      }}
      className={`absolute -top-3.5 right-2 z-20 pointer-events-none animate-float-delta inline-flex items-center px-1.5 py-0.5 rounded-md border text-xs sm:text-sm font-black tracking-tight shadow-md backdrop-blur-xs select-none ${colorClasses}`}
    >
      {sign}{delta}
    </div>
  );
}
