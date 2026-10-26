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

export type GameEventKind = 'main' | 'crisis' | 'unforeseen';

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
}

export interface EventConditions {
    tags?: Tag[];          // Tags requeridos
    forbiddenTags?: Tag[]; // Tags que NO debe tener
    archetype?: string[],
    financing?: string[],
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
    archetypeId?: string;
    financingId?: string;
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

export interface Financing {
    id: string;
    titulo: string;
    descripcion: string;
    impactPreview: ImpactPreview;
    effects: Partial<Metrics>;
    tags?: Tag[];
}

export type GameStep = 'decision' | 'outcome' | 'phase_recap' | 'ended'