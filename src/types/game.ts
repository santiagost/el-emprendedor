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

export interface GameOption {
    text: string;
    impactPreview: ImpactPreview;
    effects: Partial<Metrics>;
    addTags?: Tag[];
    removeTags?: Tag[];
    learningPill?: string;
    scheduledEvent?: {
        eventId: string;
        delayTurns: number;
    };
}

export interface EventConditions {
    tags?: Tag[];          // Tags requeridos
    forbiddenTags?: Tag[]; // Tags que NO debe tener
}

export interface GameEvent {
    id: string;
    phaseId: PhaseId;
    title: string;
    description: string;
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

export interface GameState {
    currentTurn: number;
    maxTurns: number;
    phaseId: PhaseId;
    metrics: Metrics;
    activeTags: Tag[];
    history: string[]; // ids de eeventos jugados
    status: GameStatus;
    lastPill: string | null;
    pendingEvents: PendingEvent[];
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

export type GameStep = 'decision' | 'outcome' | 'ended'