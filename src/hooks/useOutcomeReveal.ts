import { useCallback, useEffect, useRef, useState } from 'react';
import type { DecisionLogEntry, GameEventKind, GameStep, Metrics } from '../types/game';
import { computeMetricDeltas, getRevealingDuration, netDecisionEffect, type MetricDeltas } from '../game/ui';
import { useReducedMotion } from '../lib/motion';
import { playSound } from '../lib/sound';
import { confetti, vibrate } from '../lib/fx';

const METRIC_KEYS: (keyof Metrics)[] = ['capital', 'reputacion', 'bienestar'];
/** Caída (en puntos) a partir de la cual la métrica vibra al cambiar. */
const BIG_DROP = -15;

export const decisionIdOf = (entry: DecisionLogEntry) => `${entry.turn}-${entry.eventId}-${entry.optionIndex}`;

export interface HudDeltas extends MetricDeltas {
  key: number;
  decisionId?: string;
}

interface UseOutcomeRevealOptions {
  step: GameStep;
  metrics: Metrics;
  lastDecision: DecisionLogEntry | null | undefined;
  eventKind: GameEventKind | undefined;
}

/**
 * Revelado del impacto de una decisión: suspenso "Calculando…" con el HUD congelado (A4),
 * deltas flotantes con sonido y vibración (A3/A4) y confeti al llegar a 100 por primera vez (A6).
 */
export function useOutcomeReveal({ step, metrics, lastDecision, eventKind }: UseOutcomeRevealOptions) {
  const isReducedMotion = useReducedMotion();
  const [isRevealing, setIsRevealing] = useState(false);
  // Métricas previas a la decisión: el HUD las muestra mientras dura el suspenso
  const [heldMetrics, setHeldMetrics] = useState<Metrics | null>(null);
  const revealingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seguimiento de deltas reales para animaciones de métricas.
  // Se calculan recién cuando termina el suspenso, para no revelar el impacto antes de tiempo.
  const prevMetricsRef = useRef(metrics);
  const deltasPendingRef = useRef(false);
  // Hitos de confeti: una vez por métrica y por partida (las que ya arrancan en 100 no cuentan)
  const celebratedMetricsRef = useRef<Set<keyof Metrics>>(
    new Set(METRIC_KEYS.filter((k) => metrics[k] >= 100))
  );
  const [metricDeltas, setMetricDeltas] = useState<HudDeltas>({ key: 0 });

  useEffect(() => {
    if (step === 'decision') {
      prevMetricsRef.current = metrics;
      deltasPendingRef.current = true;
      return;
    }

    if (step === 'outcome' && !isRevealing && deltasPendingRef.current) {
      deltasPendingRef.current = false;
      const prev = prevMetricsRef.current;
      const deltas = computeMetricDeltas(prev, metrics);

      setMetricDeltas((current) => ({
        ...deltas,
        key: current.key + 1,
        decisionId: lastDecision ? decisionIdOf(lastDecision) : undefined,
      }));
      prevMetricsRef.current = metrics;

      // A3: un tick por métrica que se movió, escalonado como los deltas flotantes (0ms, 150ms, 300ms)
      METRIC_KEYS.forEach((k, i) => {
        const delta = deltas[k];
        if (delta === undefined || delta === 0) return;
        setTimeout(() => {
          playSound(delta > 0 ? 'tickUp' : 'tickDown');
          // A4: una caída fuerte se siente en el dispositivo, además de oírse
          if (delta <= BIG_DROP) vibrate(60);
        }, i * 150);
      });

      // A6: confeti dorado cuando una métrica llega a 100 por primera vez en la partida
      const reachedMax = METRIC_KEYS.filter(
        (k) => metrics[k] >= 100 && prev[k] < 100 && !celebratedMetricsRef.current.has(k)
      );
      if (reachedMax.length > 0) {
        reachedMax.forEach((k) => celebratedMetricsRef.current.add(k));
        confetti('gold');
      }
    }
  }, [step, metrics, isRevealing, lastDecision]);

  useEffect(() => {
    return () => {
      if (revealingTimerRef.current) {
        clearTimeout(revealingTimerRef.current);
      }
    };
  }, []);

  /** Arranca el suspenso; se llama justo antes de aplicar la decisión en el motor. Con reduced motion no hay suspenso. */
  const beginReveal = useCallback(() => {
    const duration = getRevealingDuration(eventKind, isReducedMotion);
    if (duration <= 0) return;
    setHeldMetrics(metrics);
    setIsRevealing(true);
    revealingTimerRef.current = setTimeout(() => {
      setHeldMetrics(null);
      setIsRevealing(false);
    }, duration);
  }, [eventKind, isReducedMotion, metrics]);

  /** Vuelve al estado inicial (reinicio de partida). */
  const reset = useCallback(() => {
    if (revealingTimerRef.current) {
      clearTimeout(revealingTimerRef.current);
    }
    setIsRevealing(false);
    setHeldMetrics(null);
    setMetricDeltas({ key: 0 });
    celebratedMetricsRef.current = new Set();
  }, []);

  // Deltas que muestra el panel "Elegiste": los mismos que el HUD (reales, con modificadores).
  // Si no hay delta medido (recarga en pleno outcome), se usa el efecto neto del log.
  const decisionDeltas: MetricDeltas = !lastDecision
    ? {}
    : metricDeltas.decisionId === decisionIdOf(lastDecision)
    ? metricDeltas
    : netDecisionEffect(lastDecision);

  return {
    isRevealing,
    displayMetrics: heldMetrics ?? metrics,
    metricDeltas,
    decisionDeltas,
    beginReveal,
    reset,
  };
}
