import type { GameState, Metrics, Objetivo } from '../types/game';
import type { Tag } from '../data/tags';
import { OBJETIVOS } from '../data/objetivos';
import { METRIC_NAMES } from './retrospective';

/** Tags con los que se cierra una salida de la empresa (venta, negocio sostenible, expansión). */
export const EXIT_TAGS: Tag[] = ['salida_exitosa_venta', 'lifestyle_business', 'expansion_global'];

export interface ObjectiveResult {
  objetivo: Objetivo;
  met: boolean;
  /** Cómo quedó respecto de la meta, en una frase. */
  detail: string;
}

const METRIC_KEYS: (keyof Metrics)[] = ['capital', 'reputacion', 'bienestar'];

/**
 * Si el jugador cumplió el objetivo que eligió. null si la partida no tiene objetivo (guardados anteriores,
 * o un id que ya no existe) o si todavía se está jugando.
 * Perder la partida es no cumplir; un fin anticipado por falta de eventos se evalúa con lo que quedó.
 */
export function evaluateObjective(state: GameState): ObjectiveResult | null {
  const objetivo = OBJETIVOS.find((o) => o.id === state.objetivoId);
  if (!objetivo || state.status === 'playing' || state.status === 'setup') return null;

  const { criterio } = objetivo;
  const { metrics, activeTags } = state;

  if (state.status.startsWith('game_over')) {
    return { objetivo, met: false, detail: 'La empresa no llegó al final, así que el objetivo quedó sin cumplir.' };
  }

  if (criterio.tipo === 'salida') {
    const met = activeTags.some((t) => EXIT_TAGS.includes(t));
    return {
      objetivo,
      met,
      detail: met
        ? 'Cerraste la partida con una salida para tu empresa.'
        : 'Llegaste al final sin una salida: ni venta, ni expansión, ni negocio sostenible.',
    };
  }

  if (criterio.tipo === 'metrica') {
    const value = metrics[criterio.metrica];
    const name = METRIC_NAMES[criterio.metrica].name;
    return {
      objetivo,
      met: value >= criterio.minimo,
      detail: `${name.charAt(0).toUpperCase()}${name.slice(1)} cerró en ${value}; la meta era ${criterio.minimo} o más.`,
    };
  }

  const lowest = METRIC_KEYS.reduce((low, key) => (metrics[key] < metrics[low] ? key : low), METRIC_KEYS[0]);
  const name = METRIC_NAMES[lowest].name;
  return {
    objetivo,
    met: metrics[lowest] >= criterio.minimo,
    detail: `Tu métrica más baja fue ${name}, en ${metrics[lowest]}; la meta era ${criterio.minimo} o más en las tres.`,
  };
}
