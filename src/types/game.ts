import { type PhaseId } from "../game/phases";

export interface Metrics {
    capital: number;
    bienestar: number;
    reputacion: number;
}

export interface GameOption {
    text: string;
    impactPreview: {
        capital: "up" | "down" | "neutral";
        bienestar: "up" | "down" | "neutral";
        reputacion: "up" | "down" | "neutral";
    };
    effects: Partial<Metrics>;
    addTags?: string[];
    removeTags?: string[];
    learningPill?: string;
}

export interface GameEvent {
    id: string;
    phaseId: PhaseId;
    title: string;
    description: string;
    requiredTags?: string[];
    forbiddenTags?: string[];
    options: [GameOption, GameOption] | [GameOption, GameOption, GameOption];
    weight?: number;
}

export type GameStatus = 'playing' | 'game_over_capital' | 'game_over_bienestar' | 'game_over_reputacion' | 'victory' | 'setup';

export interface GameState {
    currentTurn: number;
    maxTurns: number;
    phaseId: PhaseId;
    metrics: Metrics;
    activeTags: string[];
    history: string[]; // ids de eeventos jugados
    status: GameStatus;
    lastPill: string | null;
}

export interface Archetype{
    id: string;
    titulo: string;
    descripcion: string;
    impactPreview: {
        capital: "up" | "down" | "neutral";
        bienestar: "up" | "down" | "neutral";
        reputacion: "up" | "down" | "neutral";
    };
    effects: Partial<Metrics>;
    tags?: string[];
}

export interface Financing{
    id: string;
    titulo: string;
    descripcion: string;
    impactPreview: {
        capital: "up" | "down" | "neutral";
        bienestar: "up" | "down" | "neutral";
        reputacion: "up" | "down" | "neutral";
    };
    effects: Partial<Metrics>;
    tags?: string[];
}