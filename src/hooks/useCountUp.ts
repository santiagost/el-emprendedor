import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/motion';

/**
 * Curva de aceleración suave hacia el valor final: 1 - (1 - t)^3.
 */
export const easeOutCubic = (t: number): number =>
  1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);

/**
 * Calcula el valor interpolado redondeado para un instante temporal dado.
 */
export const interpolateCount = (
  startValue: number,
  targetValue: number,
  elapsed: number,
  duration: number
): number => {
  if (duration <= 0) return targetValue;
  const progress = Math.min(1, Math.max(0, elapsed / duration));
  const eased = easeOutCubic(progress);
  return Math.round(startValue + (targetValue - startValue) * eased);
};

/**
 * Interpola un valor numérico con requestAnimationFrame y curva easeOutCubic.
 * Si prefersReducedMotion() está activo, salta inmediatamente al valor objetivo.
 *
 * @param targetValue Valor al que se desea llegar.
 * @param duration Duración de la interpolación en ms (por defecto 700ms).
 * @param delay Retardo antes de comenzar la interpolación en ms (por defecto 0ms).
 */
export function useCountUp(
  targetValue: number,
  duration: number = 700,
  delay: number = 0
): number {
  const isReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const currentRef = useRef<number>(targetValue);
  const rafIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isReducedMotion) {
      currentRef.current = targetValue;
      return;
    }

    if (currentRef.current === targetValue) {
      return;
    }

    const startValue = currentRef.current;

    const startAnimation = () => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const nextVal = interpolateCount(startValue, targetValue, elapsed, duration);

        currentRef.current = nextVal;
        setDisplayValue(nextVal);

        if (elapsed < duration) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          currentRef.current = targetValue;
          setDisplayValue(targetValue);
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    };

    if (delay > 0) {
      timeoutIdRef.current = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [targetValue, duration, delay, isReducedMotion]);

  return isReducedMotion ? targetValue : displayValue;
}
