import type { ImpactPreview, Metrics } from '../types/game';
import type { PhaseId } from './phases';

/** Desde esta fase las opciones muestran la tendencia ("tu intuición") y puede fallar. */
export const INTUITION_FIRST_PHASE: PhaseId = 3;

/** Aviso del resumen de la fase anterior a que aparezca la tendencia. */
export const INTUITION_NOTE =
  'De acá en adelante, lo que ya viviste te deja intuir hacia dónde mueve cada decisión tus métricas. Es intuición, no certeza: a veces el resultado te va a sorprender.';

const LABELS: Record<keyof Metrics, string> = { capital: 'Capital', reputacion: 'Reputación', bienestar: 'Bienestar' };
const KEYS = ['capital', 'reputacion', 'bienestar'] as const;

/** Línea que explica en qué se equivocó la intuición, comparando la tendencia mostrada con el efecto real; null si coinciden. */
export function intuitionMissMessage(expected: ImpactPreview, effects: Partial<Metrics>): string | null {
  for (const key of KEYS) {
    const value = effects[key] ?? 0;
    const label = LABELS[key];
    const trend = expected[key];
    if (trend === 'up' && value < 0) return `Esta vez tu intuición falló: esperabas ganar ${label}, pero perdiste.`;
    if (trend === 'down' && value > 0) return `Esta vez tu intuición falló: esperabas perder ${label}, pero ganaste.`;
    if (trend === 'neutral' && value !== 0) {
      return `Esta vez tu intuición falló: no esperabas que ${label} se moviera, pero ${value > 0 ? 'subió' : 'bajó'}.`;
    }
  }
  return null;
}
