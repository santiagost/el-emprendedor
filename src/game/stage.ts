import type { GameEvent } from '../types/game';

/**
 * Puesta en escena de las interrupciones (crisis e imprevistos): sello, cintilla y ritmo de la coreografía.
 * Solo capa visual: el motor no la usa. Un evento sin entrada en STAGE_BY_EVENT usa el estilo de su tipo.
 */
export type StageTone = 'crisis' | 'unforeseen' | 'opportunity';

export interface EventStage {
  tone: StageTone;
  /** Palabra del sello (corta, en mayúsculas). */
  stamp: string;
  /** Etiqueta fija de la cintilla. */
  ribbon: string;
  /** Frases del ticker. No adelantan el contenido del evento. */
  ticker: string[];
}

const DEFAULT_STAGE: Record<'crisis' | 'unforeseen', EventStage> = {
  crisis: { tone: 'crisis', stamp: 'CRISIS', ribbon: 'Último momento', ticker: ['Noticia en desarrollo', 'Alerta en la empresa'] },
  unforeseen: { tone: 'unforeseen', stamp: 'IMPREVISTO', ribbon: 'Último momento', ticker: ['Noticia en desarrollo', 'Cambio de planes'] },
};

/** Variantes por evento. Para un evento nuevo alcanza con agregar su id acá (ver docs/EVENTOS.md). */
export const STAGE_BY_EVENT: Record<string, Partial<EventStage>> = {
  crisis_quiebra_inminente: { stamp: 'QUIEBRA', ticker: ['Alerta financiera', 'La caja no responde'] },
  crisis_burnout_extremo: { stamp: 'BURNOUT', ticker: ['El equipo dice basta', 'Alerta interna'] },
  crisis_reputacion_fuga: { stamp: 'DESCONFIANZA', ticker: ['El mercado habla de vos', 'Alerta de reputación'] },
  imp_salto_inflacionario: { stamp: 'INFLACIÓN', ticker: ['Mercados en alerta', 'Los precios se mueven'] },
  imp_caida_servidores: { stamp: 'CAÍDA', ticker: ['Fallas reportadas', 'Sistemas fuera de línea'] },
  imp_corte_cobros: { stamp: 'CORTE', ticker: ['Cajas detenidas', 'Sistema fuera de línea'] },
  imp_caida_agenda: { stamp: 'CAÍDA', ticker: ['Herramientas fuera de línea', 'Clientes esperando'] },
  imp_corte_energia: { stamp: 'APAGÓN', ticker: ['Planta detenida', 'Pedidos en espera'] },
  imp_inspeccion_sorpresa: { stamp: 'INSPECCIÓN', ticker: ['Visita oficial', 'Revisión en curso'] },
  imp_viralizacion_inesperada: {
    tone: 'opportunity',
    stamp: '¡VIRAL!',
    ribbon: 'Tendencia',
    ticker: ['Todos hablan de tu empresa', 'Explosión en redes'],
  },
};

/** Escena de un evento, o null si es un dilema normal (no lleva coreografía). */
export function stageFor(event: Pick<GameEvent, 'id' | 'kind'> | null | undefined): EventStage | null {
  if (!event || (event.kind !== 'crisis' && event.kind !== 'unforeseen')) return null;
  return { ...DEFAULT_STAGE[event.kind], ...STAGE_BY_EVENT[event.id] };
}

export interface StageTimeline {
  /** Inicio (ms) de los actos 1 a 4: cintilla, sello, suspenso y revelación. El acto 0 (corte) arranca en 0. */
  acts: [number, number, number, number];
  /** Desde cuándo se puede saltar con Espacio, Enter o clic. */
  skippableAt: number;
}

/**
 * Ritmo de la coreografía hasta la lectura (acto 4), que dura hasta que el jugador sigue.
 * La crisis llega a la lectura en ~2,3 s; imprevistos y oportunidades, en ~1,8 s.
 * Con reduced motion todo aparece de una vez, sin animar, y se puede saltar desde el inicio.
 */
export function stageTimeline(tone: StageTone, reducedMotion: boolean): StageTimeline {
  if (reducedMotion) return { acts: [0, 0, 0, 1500], skippableAt: 0 };
  if (tone === 'crisis') return { acts: [150, 900, 1300, 2300], skippableAt: 1300 };
  return { acts: [120, 700, 1000, 1800], skippableAt: 1000 };
}

/** Acto activo (0-4) a los `elapsed` ms. */
export function actAt(timeline: StageTimeline, elapsed: number): number {
  return timeline.acts.reduce((act, start, i) => (elapsed >= start ? i + 1 : act), 0);
}
