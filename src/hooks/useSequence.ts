import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../lib/motion';

export interface SequenceStep {
  at: number; // Milisegundos desde el inicio de la secuencia
}

export interface UseSequenceOptions {
  key?: string | number;
  initialCompleted?: boolean;
}

export interface UseSequenceReturn {
  currentStep: number;
  isCompleted: boolean;
  skipToEnd: () => void;
}

/**
 * Función pura para determinar el paso activo e idoneidad de finalización
 * según el tiempo transcurrido (elapsedMs).
 */
export function getStepAtTime(
  steps: SequenceStep[],
  elapsedMs: number
): { step: number; isCompleted: boolean } {
  if (steps.length === 0) {
    return { step: 0, isCompleted: true };
  }

  let step = 0;
  for (let i = 0; i < steps.length; i++) {
    if (elapsedMs >= steps[i].at) {
      step = i;
    }
  }

  const isCompleted = step >= steps.length - 1;
  return { step, isCompleted };
}

/**
 * Hook para orquestar secuencias temporizadas por capas (staggered reveal).
 * Si reduced-motion está activo o si initialCompleted es true (por ejemplo, recarga en outcome),
 * se muestra inmediatamente el último paso sin animar.
 */
export function useSequence(
  steps: SequenceStep[],
  options: UseSequenceOptions = {}
): UseSequenceReturn {
  const { key, initialCompleted = false } = options;
  const isReducedMotion = useReducedMotion();
  const maxStep = Math.max(0, steps.length - 1);
  // Clave por valor: un array inline nuevo en cada render no debe reiniciar los timers
  const stepTimesKey = steps.map((s) => s.at).join(',');
  const [initialKey] = useState(key);

  const [state, setState] = useState(() => {
    const shouldComplete = isReducedMotion || initialCompleted;
    return {
      key,
      step: shouldComplete ? maxStep : 0,
      isCompleted: shouldComplete || steps.length <= 1,
    };
  });

  // Si cambia la clave durante el render, reiniciamos la secuencia (patrón recomendado por React)
  if (state.key !== key) {
    const isInitialKey = key === initialKey;
    const shouldComplete = isReducedMotion || (isInitialKey && initialCompleted);
    setState({
      key,
      step: shouldComplete ? maxStep : 0,
      isCompleted: shouldComplete || steps.length <= 1,
    });
  }

  const skipToEnd = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: maxStep,
      isCompleted: true,
    }));
  }, [maxStep]);

  useEffect(() => {
    // Si ya está completada o reducida, no programamos temporizadores
    if (state.isCompleted || isReducedMotion) {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const stepTimes = stepTimesKey.split(',').map(Number);

    // Programar cada paso futuro a partir de su tiempo 'at'
    stepTimes.forEach((at, idx) => {
      if (idx === 0) return; // Paso 0 ya está activo al inicio
      const timer = setTimeout(() => {
        setState((prev) => {
          // Solo actualizamos si seguimos en la misma clave
          if (prev.key !== key) return prev;
          const nextStep = Math.max(prev.step, idx);
          return {
            ...prev,
            step: nextStep,
            isCompleted: nextStep >= maxStep,
          };
        });
      }, at);
      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [key, state.isCompleted, isReducedMotion, maxStep, stepTimesKey]);

  return {
    currentStep: isReducedMotion ? maxStep : state.step,
    isCompleted: isReducedMotion ? true : state.isCompleted,
    skipToEnd,
  };
}
