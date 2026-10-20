import { useState } from 'react';
import { useReducedMotion } from '../../lib/motion';

interface FloatingDeltaProps {
  delta?: number;
  delayMs?: number;
  onComplete?: () => void;
}

export default function FloatingDelta({ delta, delayMs = 0, onComplete }: FloatingDeltaProps) {
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
    ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/80 shadow-emerald-500/20'
    : 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/80 shadow-rose-500/20';

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
