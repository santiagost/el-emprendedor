import type { DecisionLogEntry, GameState, GameStatus, Metrics } from '../types/game';
import type { Tag } from '../data/tags';
import { phasesFor, type PhaseId } from './phases';
import type { PhaseRecap } from './recap';
import { METRIC_NAMES, type PivotMoment, type Retrospective, type Verdict } from './retrospective';
import { personalize } from '../lib/personalize';

/** Tono del final: el componente lo traduce a colores. */
export type EpilogueTone = 'good' | 'info' | 'warn' | 'bad' | 'neutral';

export interface Epilogue {
  title: string;
  subtitle: string;
  description: string;
  tone: EpilogueTone;
}

/** Título y relato del final según cómo terminó la partida y qué tags quedaron activos. */
export function buildEpilogue(status: GameStatus, activeTags: Tag[]): Epilogue {
  if (status === 'victory') {
    if (activeTags.includes('salida_exitosa_venta')) {
      return {
        title: 'El Unicornio Adquirido',
        subtitle: 'Venta exitosa a un gigante corporativo',
        description:
          'Vendiste tu empresa por millones a un conglomerado internacional. Monetizaste con creces el valor creado, aunque tu creación ahora responderá a nuevos dueños.',
        tone: 'good',
      };
    }
    if (activeTags.includes('lifestyle_business')) {
      return {
        title: 'El Negocio Sostenible (Lifestyle Business)',
        subtitle: 'Rentabilidad, autonomía y calidad de vida',
        description:
          'No construiste una corporación titánica, pero tenés un negocio sólido, predecible y altamente rentable que opera sin depender de tus horas de sueño.',
        tone: 'info',
      };
    }
    if (activeTags.includes('expansion_global')) {
      return {
        title: 'La Expansión Global',
        subtitle: 'Presencia internacional consolidada',
        description:
          'Llevaste la bandera de tu empresa a nuevos mercados en el mundo. Superaste la barrera local y jugás de igual a igual en las grandes ligas.',
        tone: 'info',
      };
    }
    if (activeTags.includes('equity_diluido') && !activeTags.includes('autonomia_estrategica')) {
      return {
        title: 'El Fundador Desplazado',
        subtitle: 'Empresa millonaria, control ajeno',
        description:
          'Tu empresa vale una fortuna, pero el directorio y los inversores externos se quedaron con el control y te desplazaron de tu rol de CEO. Una lección de dilución.',
        tone: 'warn',
      };
    }
    return {
      title: 'Empresa Consolidada',
      subtitle: 'Maduración completa de negocio',
      description:
        'Superaste con temple todas las fases de maduración con caja, reputación y bienestar intactos. Construiste una verdadera compañía.',
      tone: 'good',
    };
  }

  if (status === 'game_over_capital') {
    return {
      title: 'Quiebra de Liquidez (Lección Forzosa)',
      subtitle: 'Caja agotada antes de consolidar el modelo',
      description:
        'Te quedaste sin liquidez y la empresa cayó en insolvencia. "El 80% de los emprendedores exitosos fracasó en su primer intento. Volvé a intentarlo con lo aprendido."',
      tone: 'bad',
    };
  }

  if (status === 'game_over_bienestar') {
    return {
      title: 'Colapso por Burnout',
      subtitle: 'El equipo y tu salud no dieron más',
      description:
        'Las horas extras infinitas y la deuda operativa pasaron factura. La salud del fundador y el clima del equipo colapsaron. Sin personas no hay negocio.',
      tone: 'bad',
    };
  }

  if (status === 'game_over_reputacion') {
    return {
      title: 'Crisis Terminal de Reputación',
      subtitle: 'Pérdida absoluta de credibilidad',
      description:
        'Perdiste toda confianza de tus clientes, proveedores e inversores. En el mundo de los negocios, la reputación tarda años en construirse y segundos en destruirse.',
      tone: 'bad',
    };
  }

  return {
    title: 'Trayectoria Completada',
    subtitle: 'Fin del recorrido disponible',
    description:
      'Has completado todos los acontecimientos posibles para las condiciones y el perfil seleccionado en esta partida.',
    tone: 'neutral',
  };
}

export interface WhyLine {
  /** Lo que decidió el final, en una frase corta. */
  strong: string;
  /** El resto de la foto: cómo cerraron las demás métricas. */
  rest: string;
}

const METRIC_KEYS: (keyof Metrics)[] = ['capital', 'reputacion', 'bienestar'];
const METRIC_SUBJECT: Record<keyof Metrics, string> = { capital: 'El capital', reputacion: 'La reputación', bienestar: 'El bienestar' };
const METRIC_LOWER: Record<keyof Metrics, string> = { capital: 'capital', reputacion: 'reputación', bienestar: 'bienestar' };
const OVER_STATUS: Partial<Record<GameStatus, keyof Metrics>> = {
  game_over_capital: 'capital',
  game_over_reputacion: 'reputacion',
  game_over_bienestar: 'bienestar',
};

const lastTurnOf = (state: GameState): number => state.decisionLog[state.decisionLog.length - 1]?.turn ?? state.currentTurn;

/** El porqué del final, junto al resultado. */
export function buildWhyLine(state: GameState): WhyLine {
  const { metrics, status, maxTurns } = state;
  const turn = lastTurnOf(state);
  const summary = METRIC_KEYS.map((k) => `${METRIC_LOWER[k]} ${metrics[k]}%`);
  const rescued = state.decisionLog.some((e) => e.kind === 'rescue');

  if (status === 'victory') {
    if (state.decisionLog[state.decisionLog.length - 1]?.endsGame) {
      return {
        strong: `Cerraste tu historia en el año ${turn} de ${maxTurns}, antes del final del recorrido.`,
        rest: `Te fuiste con ${summary[0]}, ${summary[1]} y ${summary[2]}.${rescued ? ' Para llegar usaste tu único rescate.' : ''}`,
      };
    }
    const floor = Math.floor(Math.min(...METRIC_KEYS.map((k) => metrics[k])) / 5) * 5;
    return {
      strong: floor >= 60 ? `Las tres métricas cerraron arriba de ${floor}.` : 'Llegaste al final con las tres métricas en pie.',
      rest: `Llegaste al año ${turn} con ${summary[0]}, ${summary[1]} y ${summary[2]}.${rescued ? ' Para llegar usaste tu único rescate.' : ''}`,
    };
  }

  const failed = OVER_STATUS[status];
  if (failed) {
    const others = METRIC_KEYS.filter((k) => k !== failed);
    return {
      strong: `${METRIC_SUBJECT[failed]} llegó a ${metrics[failed]}% en el año ${turn} de ${maxTurns}.`,
      rest: `Las otras dos métricas cerraron así: ${METRIC_LOWER[others[0]]} ${metrics[others[0]]}% y ${METRIC_LOWER[others[1]]} ${metrics[others[1]]}%.${rescued ? ' Ya habías usado tu único rescate.' : ''}`,
    };
  }

  return {
    strong: `Se agotaron los eventos disponibles en el año ${turn}.`,
    rest: `Cerraste con ${summary[0]}, ${summary[1]} y ${summary[2]}.`,
  };
}

export interface MetricCurve {
  key: keyof Metrics;
  /** [inicio, tras cada decisión]. */
  series: number[];
  start: number;
  end: number;
  delta: number;
}

export interface PhaseSlot {
  phaseId: PhaseId;
  /** Cantidad de decisiones de la fase: es el ancho relativo de su tramo en la curva. */
  count: number;
}

export interface MetricCurves {
  curves: MetricCurve[];
  /** Fases con al menos una decisión, en orden. */
  slots: PhaseSlot[];
  /** Posiciones de la serie donde termina cada fase (menos la última): las líneas que separan las fases. */
  breaks: number[];
  decisions: number;
}

/** Curva de cada métrica durante toda la partida. null si el guardado no trae el recorrido (partidas viejas). */
export function buildMetricCurves(state: GameState): MetricCurves | null {
  const { decisionLog, initialMetrics } = state;
  if (decisionLog.length === 0 || !initialMetrics || decisionLog.some((e) => !e.metricsAfter)) return null;

  const curves = METRIC_KEYS.map((key) => {
    const series = [initialMetrics[key], ...decisionLog.map((e) => (e.metricsAfter as Metrics)[key])];
    return { key, series, start: series[0], end: series[series.length - 1], delta: series[series.length - 1] - series[0] };
  });

  const slots: PhaseSlot[] = phasesFor(state.maxTurns).map((p) => ({
    phaseId: p.id,
    count: decisionLog.filter((e) => e.turn >= p.fromTurn && e.turn <= p.toTurn).length,
  })).filter((s) => s.count > 0);

  const breaks: number[] = [];
  slots.slice(0, -1).reduce((acc, s) => {
    const next = acc + s.count;
    breaks.push(next);
    return next;
  }, 0);

  return { curves, slots, breaks, decisions: decisionLog.length };
}

export type PhaseStatus = 'completed' | 'cut' | 'incomplete' | 'not_reached';

export interface TimelineDecision {
  logIndex: number;
  turn: number;
  kind: DecisionLogEntry['kind'];
  title: string;
  option: string;
  outcome?: string;
  learning?: string;
  verdict?: Verdict;
}

export interface TimelinePhase {
  phaseId: PhaseId;
  label: string;
  fromTurn: number;
  toTurn: number;
  status: PhaseStatus;
  recap: PhaseRecap | null;
  decisions: TimelineDecision[];
}

/** Quita el emoji con el que arrancan los títulos de crisis e imprevistos: el tipo ya se muestra aparte. */
const cleanTitle = (title: string): string => title.replace(/^[^\p{L}\p{N}«¿¡"]+/u, '');

/**
 * La línea de tiempo del final: una entrada por fase con su resumen y sus decisiones.
 * Si perdiste, la fase donde caíste queda marcada ("cut") y las siguientes quedan como "no alcanzadas".
 */
export function buildTimeline(
  state: GameState,
  journey: PhaseRecap[],
  verdictByLogIndex: Map<number, Verdict>,
  playerName?: string
): TimelinePhase[] {
  const gameOver = state.status.startsWith('game_over');
  const phases = phasesFor(state.maxTurns);
  const reached = phases.filter((p) => journey.some((j) => j.phaseId === p.id));
  const lastReachedId = reached[reached.length - 1]?.id;

  return phases.map((phase) => {
    const recap = journey.find((j) => j.phaseId === phase.id) ?? null;
    const decisions: TimelineDecision[] = [];
    state.decisionLog.forEach((entry, logIndex) => {
      if (entry.turn < phase.fromTurn || entry.turn > phase.toTurn) return;
      decisions.push({
        logIndex,
        turn: entry.turn,
        kind: entry.kind,
        title: personalize(cleanTitle(entry.eventTitle), playerName),
        option: personalize(entry.optionText, playerName),
        outcome: entry.outcomeText ? personalize(entry.outcomeText, playerName) : undefined,
        learning: entry.learningPill ? personalize(entry.learningPill, playerName) : undefined,
        verdict: verdictByLogIndex.get(logIndex),
      });
    });

    let status: PhaseStatus = 'completed';
    if (!recap) status = 'not_reached';
    else if (gameOver && phase.id === lastReachedId) status = 'cut';
    else if (recap.partial && !(state.status === 'victory' && phase.id === lastReachedId)) status = 'incomplete';

    return { phaseId: phase.id, label: phase.label, fromTurn: phase.fromTurn, toTurn: phase.toTurn, status, recap, decisions };
  });
}

/** El momento clave es el de mayor ganancia posible; el resto queda como secundarios. */
export function splitPivots(pivots: PivotMoment[]): { main: PivotMoment | null; others: PivotMoment[] } {
  if (pivots.length === 0) return { main: null, others: [] };
  const main = pivots.reduce((top, p) => (p.gain > top.gain ? p : top), pivots[0]);
  return { main, others: pivots.filter((p) => p !== main) };
}

export interface Outlook {
  /** Dato grande del recuadro "Tu final probable": un rango de métrica (victoria) o de turnos (derrota). */
  big: string;
  small: string;
  /** Lo que habría mejorado el otro camino, en una frase corta. */
  altBenefit: string;
}

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

/** Los textos cortos del recuadro "Tu final probable", armados con la misma proyección que la retrospectiva. */
export function buildOutlook(state: GameState, retrospective: Retrospective): Outlook | null {
  const { projection } = retrospective;
  if (!projection) return null;

  const target = projection.targetMetric;
  const name = METRIC_NAMES[target].name;
  const altBenefit = `Habría cuidado mejor ${name}`;
  const lastTurn = lastTurnOf(state);

  if (state.status.startsWith('game_over') && projection.extraTurns) {
    const [lo, hi] = projection.extraTurns;
    if (hi <= 0) {
      return {
        big: 'Casi igual',
        small: `${capitalize(METRIC_LOWER[target])} habría aguantado un poco más, pero probablemente el final no cambiaba. Caíste en el año ${lastTurn}.`,
        altBenefit,
      };
    }
    const from = lastTurn + lo;
    const to = lastTurn + hi;
    return {
      big: from === to ? `Año ${from}` : `Año ${from} a ${to}`,
      small: `Hasta dónde habrías llegado con los otros caminos. Caíste en el año ${lastTurn}.`,
      altBenefit,
    };
  }

  return {
    big: projection.low === projection.high ? `${projection.low}` : `${projection.low} a ${projection.high}`,
    small: `${capitalize(METRIC_LOWER[target])} probable con los otros caminos. Terminaste en ${projection.actual}.`,
    altBenefit,
  };
}
