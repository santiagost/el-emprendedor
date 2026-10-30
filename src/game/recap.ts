import type { DecisionLogEntry, GameState, Metrics } from '../types/game';
import { PHASES, phasesFor, type PhaseId } from './phases';
import { personalize } from '../lib/personalize';

export type TrendId =
  | 'quema_naves'
  | 'querido_pero_justo'
  | 'equilibrista'
  | 'cuesta_arriba'
  | 'sostenible'
  | 'rumbo_abierto';

export interface Trend {
  id: TrendId;
  label: string;
}

export interface PhaseRecap {
  phaseId: PhaseId;
  trend: Trend;
  /** Frase corta del perfil de la fase (con el nombre resuelto). */
  headline: string;
  /** 1-3 párrafos tras el titular: decisión clave e interrupciones, y mirada hacia adelante (nivel de las métricas solo si no hay recorrido). */
  paragraphs: string[];
  /** Recorrido de las métricas dentro de la fase: [inicio, tras cada decisión]. null si faltan datos. */
  series: Metrics[] | null;
  /** Variación neta de cada métrica en la fase. null si faltan datos. */
  deltas: Metrics | null;
  /** Decisión de la fase que más movió las métricas (texto completo, con el nombre resuelto). */
  keyDecision: { turn: number; text: string; metric: keyof Metrics; value: number } | null;
  /** Crisis e imprevistos que enfrentó el jugador en la fase. */
  interruptions: { crises: number; unforeseen: number };
  /** Métricas al cerrar la fase. */
  endMetrics: Metrics;
  /** La fase terminó antes de completarse (fin de partida). */
  partial: boolean;
}

const HIGH = 60;
const LOW = 40;
const MAX_OPTION_CHARS = 80;

const TRENDS: Record<TrendId, Trend> = {
  quema_naves: { id: 'quema_naves', label: 'El que quema las naves' },
  querido_pero_justo: { id: 'querido_pero_justo', label: 'Querido, pero justo' },
  equilibrista: { id: 'equilibrista', label: 'Equilibrista' },
  cuesta_arriba: { id: 'cuesta_arriba', label: 'Cuesta arriba' },
  sostenible: { id: 'sostenible', label: 'Sostenible… por ahora' },
  rumbo_abierto: { id: 'rumbo_abierto', label: 'Rumbo abierto' },
};

/**
 * Perfil de tendencia por reglas sobre las métricas al cierre de la fase.
 * El orden importa: primero los casos globales, después los cruces entre métricas.
 */
export function classifyTrend(m: Metrics): Trend {
  if (m.capital >= HIGH && m.reputacion >= HIGH && m.bienestar >= HIGH) return TRENDS.equilibrista;
  if (m.capital < LOW && m.reputacion < LOW && m.bienestar < LOW) return TRENDS.cuesta_arriba;
  if (m.capital >= HIGH && m.bienestar < LOW) return TRENDS.quema_naves;
  if (m.reputacion >= HIGH && m.capital < LOW) return TRENDS.querido_pero_justo;
  if (m.bienestar >= HIGH && m.capital < LOW) return TRENDS.sostenible;
  return TRENDS.rumbo_abierto;
}

// Bancos de texto por perfil: 3 variantes cada uno. {nombre} sigue la convención de personalize().
// El perfil sale del NIVEL al cierre, no del movimiento: los textos no deben decir que algo subió o bajó.
export const HEADLINES: Record<TrendId, [string, string, string]> = {
  quema_naves: [
    '{nombre}, la caja respira, pero tu cuerpo ya lo está pagando.',
    'Hay plata en caja y poca energía para disfrutarla, {nombre}.',
    'Tenés caja, pero la estás pagando con tu energía.',
  ],
  querido_pero_justo: [
    'El mercado te respeta, aunque la caja pide aire.',
    '{nombre}, tu nombre vale más que tu saldo por ahora.',
    'Tenés la confianza del mercado, pero la liquidez está ajustada.',
  ],
  equilibrista: [
    '{nombre}, vas sosteniendo las tres patas de la mesa.',
    'Ninguna métrica se te escapa: avanzás con equilibrio.',
    'Caja, reputación y bienestar: las tres están en buen nivel.',
  ],
  cuesta_arriba: [
    '{nombre}, fue un tramo cuesta arriba: las tres métricas están bajas.',
    'Todo pesa a la vez y, aun así, seguís en pie.',
    'La fase fue dura, pero todavía hay margen para dar vuelta la historia.',
  ],
  sostenible: [
    'Estás bien por dentro, pero la caja todavía no acompaña.',
    '{nombre}, el equipo está sano; falta que el negocio lo esté también.',
    'El clima y la energía están bien, pero el capital está corto.',
  ],
  rumbo_abierto: [
    '{nombre}, la fase no marcó un perfil claro: todavía podés inclinar la balanza.',
    'Terminaste la fase sin extremos: nada sobra y nada está al límite.',
    'Sin extremos a la vista, lo que viene depende de tus próximas apuestas.',
  ],
};

export const OUTLOOKS: Record<TrendId, [string, string, string]> = {
  quema_naves: [
    'Si el bienestar no se recupera, tarde o temprano va a cobrar su factura. Conviene delegar o descansar antes de que una crisis lo decida por vos.',
    'Lo que viene va a pedirte límites: la caja ya te da margen para cuidar al equipo y a vos mismo.',
    'Sostener este ritmo es caro. Usá el colchón de capital para invertir en tu energía y en la del equipo.',
  ],
  querido_pero_justo: [
    'La próxima tarea es convertir esa confianza en ingresos antes de que la caja se vuelva un problema.',
    'Con el mercado de tu lado, es buen momento para cobrar mejor o cuidar costos, sin gastar la reputación que construiste.',
    'La reputación abre puertas, pero no paga sueldos: buscá que el próximo tramo sume liquidez.',
  ],
  equilibrista: [
    'Con este equilibrio podés animarte a apuestas más audaces, pero cuidá no jugártelo todo en un solo golpe.',
    'Lo difícil ahora es sostenerlo: cada decisión grande puede inclinar la balanza hacia algún lado.',
    'Es un buen punto de partida para crecer. Elegí con cuidado dónde vas a gastar esa estabilidad.',
  ],
  cuesta_arriba: [
    'Elegí una prioridad y estabilizala primero: querer recuperar todo a la vez suele salir caro.',
    'Una buena decisión por mes alcanza para empezar a remontar. No hace falta resolverlo todo ya.',
    'Cuidá lo que está más cerca del límite: una crisis ahora tendría muy poco margen para absorberse.',
  ],
  sostenible: [
    'El equipo aguanta, pero el negocio necesita ingresos. Buscá el próximo salto de caja sin romper lo que cuidaste.',
    'Tu energía es un activo: usala para ordenar la caja antes de que la falta de recursos te obligue a decidir apurado.',
    'Cuidar a las personas es una base sólida; ahora toca hacerla rentable.',
  ],
  rumbo_abierto: [
    'Todavía no hay una tendencia fija. Las próximas apuestas van a definir qué clase de empresa estás construyendo.',
    'Con un balance mixto, cada decisión pesa: vale la pena mirar qué métrica está más cerca del límite.',
    'El camino sigue abierto. Decidí qué querés priorizar antes de que lo decida una crisis.',
  ],
};

const METRIC_LABEL: Record<keyof Metrics, { name: string; to: string; feminine: boolean }> = {
  capital: { name: 'el capital', to: 'al capital', feminine: false },
  reputacion: { name: 'la reputación', to: 'a la reputación', feminine: true },
  bienestar: { name: 'el bienestar', to: 'al bienestar', feminine: false },
};

const METRIC_KEYS: (keyof Metrics)[] = ['capital', 'reputacion', 'bienestar'];

const hashString = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/**
 * Variante determinista: base estable de la partida (su primera decisión) + número de fase,
 * así las fases 1, 2 y 3 reciben variantes consecutivas y distintas dentro de un mismo perfil.
 * No usa el RNG del juego, para no alterar su secuencia ni cambiar al recargar.
 */
const pickVariantIndex = (log: DecisionLogEntry[], phaseId: PhaseId, size: number): number => {
  const first = log[0];
  const base = hashString(first ? `${first.eventId}:${first.optionIndex}` : 'sin-decisiones');
  return (base + phaseId) % size;
};

const levelWord = (value: number, feminine: boolean): string => {
  const base = value >= HIGH ? 'alt' : value < LOW ? 'baj' : 'medi';
  return `${base}${feminine ? 'a' : 'o'}`;
};

const joinList = (items: string[]): string =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

const truncate = (text: string, max: number): string => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:]+$/, '')}…`;
};

const netEffect = (entry: DecisionLogEntry): Record<keyof Metrics, number> => ({
  capital: (entry.effects.capital ?? 0) + (entry.appliedModifiers?.capital ?? 0),
  reputacion: (entry.effects.reputacion ?? 0) + (entry.appliedModifiers?.reputacion ?? 0),
  bienestar: (entry.effects.bienestar ?? 0) + (entry.appliedModifiers?.bienestar ?? 0),
});

/** Decisión de la fase con mayor movimiento total (suma de |efecto neto|). */
const mostImpactful = (entries: DecisionLogEntry[]): { entry: DecisionLogEntry; metric: keyof Metrics; value: number } | null => {
  let best: { entry: DecisionLogEntry; score: number } | null = null;
  for (const entry of entries) {
    const net = netEffect(entry);
    const score = METRIC_KEYS.reduce((sum, k) => sum + Math.abs(net[k]), 0);
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  if (!best) return null;
  const net = netEffect(best.entry);
  const metric = METRIC_KEYS.reduce((top, k) => (Math.abs(net[k]) > Math.abs(net[top]) ? k : top), METRIC_KEYS[0]);
  return { entry: best.entry, metric, value: net[metric] };
};

/** Recorrido [inicio, tras cada decisión] de la fase, o null si el guardado no trae esos datos. */
const buildSeries = (state: GameState, phaseId: PhaseId, entries: DecisionLogEntry[]): Metrics[] | null => {
  if (entries.some((e) => !e.metricsAfter)) return null;

  const firstIndex = state.decisionLog.indexOf(entries[0]);
  let start: Metrics | undefined;
  if (firstIndex > 0) start = state.decisionLog[firstIndex - 1].metricsAfter;
  else if (phaseId === PHASES[0].id) start = state.initialMetrics;
  if (!start) return null;

  return [start, ...entries.map((e) => e.metricsAfter as Metrics)];
};

const entriesOfPhase = (state: GameState, phaseId: PhaseId): DecisionLogEntry[] => {
  const phase = phasesFor(state.maxTurns).find((p) => p.id === phaseId);
  if (!phase) return [];
  return state.decisionLog.filter((e) => e.turn >= phase.fromTurn && e.turn <= phase.toTurn);
};

/**
 * Resumen determinista y local de una fase. Función pura: no usa IA ni el RNG del juego.
 * Funciona con la partida en curso o terminada, con o sin nombre, y con fases sin decisiones.
 */
export function buildPhaseRecap(state: GameState, phaseId: PhaseId, playerName?: string): PhaseRecap {
  const phases = phasesFor(state.maxTurns);
  const phase = phases.find((p) => p.id === phaseId) ?? phases[0];
  const entries = entriesOfPhase(state, phaseId);
  const last = entries[entries.length - 1];
  const endMetrics: Metrics = last?.metricsAfter ?? state.metrics;
  const trend = classifyTrend(endMetrics);
  const p = (text: string) => personalize(text, playerName);

  const variant = pickVariantIndex(state.decisionLog, phaseId, 3);
  const headline = p(HEADLINES[trend.id][variant]);
  const partial = !last || last.turn < phase.toTurn;

  if (entries.length === 0) {
    return {
      phaseId,
      trend,
      headline,
      paragraphs: [p('{nombre}, en esta fase todavía no tomaste decisiones.')],
      series: null,
      deltas: null,
      keyDecision: null,
      interruptions: { crises: 0, unforeseen: 0 },
      endMetrics,
      partial: true,
    };
  }

  const series = buildSeries(state, phaseId, entries);
  const deltas: Metrics | null = series
    ? {
        capital: endMetrics.capital - series[0].capital,
        reputacion: endMetrics.reputacion - series[0].reputacion,
        bienestar: endMetrics.bienestar - series[0].bienestar,
      }
    : null;

  // Con curvas a la vista no se repiten los números en palabras. Solo un guardado viejo, sin
  // recorrido, abre con el nivel actual de las métricas.
  const levelOf = (k: keyof Metrics) => `${METRIC_LABEL[k].name} ${levelWord(endMetrics[k], METRIC_LABEL[k].feminine)}`;
  const levels = `Hoy ${METRIC_LABEL.capital.name} está ${levelWord(endMetrics.capital, false)}, ${levelOf('reputacion')} y ${levelOf('bienestar')}.`;
  const lead = series ? [] : [levels];

  // Decisión clave + interrupciones de la fase
  const story: string[] = [];
  const pivotal = mostImpactful(entries);
  if (pivotal) {
    const text = truncate(personalize(pivotal.entry.optionText, playerName), MAX_OPTION_CHARS);
    const verb = pivotal.value > 0 ? 'impulsó' : 'castigó';
    story.push(
      `La decisión que más movió la aguja fue «${text}» (mes ${pivotal.entry.turn}), que ${verb} sobre todo ${METRIC_LABEL[pivotal.metric].to}.`
    );
  }

  const crises = entries.filter((e) => e.kind === 'crisis').length;
  const unforeseen = entries.filter((e) => e.kind === 'unforeseen').length;
  const interruptions: string[] = [];
  if (crises > 0) interruptions.push(`${crises} crisis`);
  if (unforeseen > 0) interruptions.push(`${unforeseen} ${unforeseen === 1 ? 'imprevisto' : 'imprevistos'}`);
  if (interruptions.length > 0) story.push(`En el camino tuviste que enfrentar ${joinList(interruptions)}.`);

  return {
    phaseId,
    trend,
    headline,
    paragraphs: [...lead, ...(story.length > 0 ? [story.join(' ')] : []), p(OUTLOOKS[trend.id][variant])],
    series,
    deltas,
    keyDecision: pivotal
      ? { turn: pivotal.entry.turn, text: personalize(pivotal.entry.optionText, playerName), metric: pivotal.metric, value: pivotal.value }
      : null,
    interruptions: { crises, unforeseen },
    endMetrics,
    partial,
  };
}

/** Un resumen por cada fase con decisiones, para el bloque "Tu recorrido" del informe final. */
export function buildJourney(state: GameState, playerName?: string): PhaseRecap[] {
  return PHASES.filter((ph) => entriesOfPhase(state, ph.id).length > 0).map((ph) =>
    buildPhaseRecap(state, ph.id, playerName)
  );
}
