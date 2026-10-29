import { type PhaseId } from "../game/phases";
import type { Tag } from "../data/tags";

export interface Metrics {
    capital: number;
    bienestar: number;
    reputacion: number;
}

export type ImpactDirection = "up" | "down" | "neutral";

export interface ImpactPreview {
    capital: ImpactDirection;
    bienestar: ImpactDirection;
    reputacion: ImpactDirection;
}

export type GameEventKind = 'main' | 'crisis' | 'unforeseen' | 'rescue';

export type MinigameKind = 'timing' | 'tapping' | 'balance' | 'roulette';

/** Rendimiento del jugador en un minijuego: tier discreto para que el motor siga siendo puro y testeable. */
export type Performance = 'perfect' | 'good' | 'poor';

export interface MinigameSpec {
    kind: MinigameKind;
    difficulty?: 1 | 2 | 3;
    /** Solo ruleta: desplaza probabilidad de éxito a fallo crítico (positivo = opción más riesgosa, negativo = más segura). */
    riskBias?: number;
    /** Textos del encabezado cuando el minijuego necesita otro contexto que el de su tipo. */
    title?: string;
    rule?: string;
    /** Efectos explícitos para un rendimiento: reemplazan el escalado automático de ese tier (ej. el crunch cuesta Bienestar aun si sale perfecto). */
    effectsByPerformance?: Partial<Record<Performance, Partial<Metrics>>>;
    /** Consecuencia narrativa según el rendimiento; si falta el tier, se usa la de la opción. */
    outcomeTextByPerformance?: Partial<Record<Performance, string>>;
    /** Etiquetas extra según el rendimiento (se suman a las de la opción). */
    tagsByPerformance?: Partial<Record<Performance, { addTags?: Tag[]; removeTags?: Tag[] }>>;
}

/** Desenlace alternativo de una opción: en las fases avanzadas a veces el resultado contradice la tendencia que el jugador intuía. */
export interface OptionSurprise {
    /** Efectos completos que reemplazan a los de la opción (al menos una métrica contradice su tendencia). */
    effects: Partial<Metrics>;
    outcomeText: string;
}

export interface GameOption {
    text: string;
    /** Frase en condicional bajo el título de la opción; se muestra solo si existe. */
    hint?: string;
    impactPreview: ImpactPreview;
    effects: Partial<Metrics>;
    addTags?: Tag[];
    removeTags?: Tag[];
    learningPill?: string;
    outcomeText?: string;
    scheduledEvent?: {
        eventId: string;
        delayTurns: number;
    };
    /** Si está, elegir esta opción dispara un minijuego que modula la ejecución (los efectos base son el rendimiento 'good'). */
    minigame?: MinigameSpec;
    /** Desenlace que puede salir en vez del normal (fases 3 y 4); las opciones con minijuego no lo tienen. */
    surprise?: OptionSurprise;
}

export interface EventConditions {
    tags?: Tag[];          // Tags requeridos
    forbiddenTags?: Tag[]; // Tags que NO debe tener
    archetype?: string[],
    financing?: string[],
    rubro?: string[],
    metrics?: Partial<Record<keyof Metrics, { lt?: number; gt?: number }>>;
    playedBefore?: string[]; // IDs de eventos que ya deben estar en history
}

export interface GameEvent {
    id: string;
    phaseId: PhaseId;
    title: string;
    description: string;
    kind?: GameEventKind;
    weight?: number;
    /** Hito de su fase: sale en el primer turno de la fase, antes que cualquier otro evento. Debe haber uno por fase y rubro. */
    milestone?: true;
    when?: EventConditions;
    requiredTags?: Tag[];  // Compatibilidad con engine.ts actual
    forbiddenTags?: Tag[];
    options: [GameOption, GameOption] | [GameOption, GameOption, GameOption];
}

export type GameStatus =
    | 'playing'
    | 'game_over_capital'
    | 'game_over_bienestar'
    | 'game_over_reputacion'
    | 'victory'
    | 'setup'
    | 'ended_early';

export interface PendingEvent {
    eventId: string;
    triggerTurn: number;
}

export interface DecisionLogEntry {
    turn: number;
    eventId: string;
    eventTitle: string;
    kind?: GameEventKind;
    optionIndex: number;
    optionText: string;
    outcomeText?: string;
    effects: Partial<Metrics>;
    appliedModifiers?: Partial<Metrics>;
    learningPill?: string;
    /** Rendimiento en el minijuego de la opción; solo si la opción tenía uno. */
    performance?: Performance;
    /** El resultado fue el desenlace alternativo de la opción: contradice la tendencia que se veía. */
    surprised?: true;
    /** Métricas resultantes tras esta decisión (con modificadores y clamp). Opcional: guardados viejos no lo tienen. */
    metricsAfter?: Metrics;
}

export interface GameState {
    currentTurn: number;
    maxTurns: number;
    phaseId: PhaseId;
    metrics: Metrics;
    /** Métricas al iniciar la partida (tras arquetipo y financiamiento); base del recorrido de la fase 1. */
    initialMetrics?: Metrics;
    activeTags: Tag[];
    history: string[]; // ids de eventos jugados
    status: GameStatus;
    lastPill: string | null;
    pendingEvents: PendingEvent[];
    decisionLog: DecisionLogEntry[];
    lastDecision?: DecisionLogEntry | null;
    unforeseenEventsPlayed?: number;
    /** Cuántas veces el resultado contradijo la tendencia mostrada; ajusta la probabilidad de las próximas. */
    surprisesPlayed?: number;
    archetypeId?: string;
    financingId?: string;
    /** Rubro de la empresa elegido en Setup; las partidas guardadas antes de que existiera no lo tienen. */
    rubroId?: string;
    /** Ya se usó el rescate de la partida: una métrica puede tocar 0 una vez sin perder; la segunda vez termina. */
    rescueUsed?: boolean;
    /** Métrica que tocó 0 y espera su evento de rescate; se limpia al resolverlo. */
    rescuePending?: keyof Metrics;
    /** Objetivo que el jugador eligió en Setup; las partidas guardadas antes de que existiera no lo tienen. */
    objetivoId?: string;
    /** Nombre opcional del jugador; resuelve el token {nombre} de los textos en el render. */
    playerName?: string;
}

export interface Archetype {
    id: string;
    titulo: string;
    descripcion: string;
    impactPreview: ImpactPreview;
    effects: Partial<Metrics>;
    tags?: Tag[];
}

export interface Rubro {
    id: string;
    titulo: string;
    descripcion: string;
}

/** Cuándo se cumple un objetivo, evaluado al cerrar una partida que no se perdió. */
export type ObjetivoCriterio =
    | { tipo: 'metrica'; metrica: keyof Metrics; minimo: number }
    | { tipo: 'todas'; minimo: number }
    | { tipo: 'salida' };

export interface Objetivo {
    id: string;
    titulo: string;
    /** Planteo en primera persona del objetivo: qué priorizás y qué dejás de lado. */
    descripcion: string;
    criterio: ObjetivoCriterio;
}

export interface Financing {
    id: string;
    titulo: string;
    descripcion: string;
    impactPreview: ImpactPreview;
    effects: Partial<Metrics>;
    tags?: Tag[];
}

export type GameStep = 'decision' | 'outcome' | 'phase_recap' | 'ended'