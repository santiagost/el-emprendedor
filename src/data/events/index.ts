import { fase1Events } from "./fase1";
import { fase2Events } from "./fase2";
import { fase3Events } from "./fase3";
import { fase4Events } from "./fase4";
import { crisisEvents } from "./crisis";
import { unforeseenEvents } from "./unforeseen";
import type { GameEvent } from "../../types/game";

export const MAIN_EVENTS: GameEvent[] = [
    ...fase1Events,
    ...fase2Events,
    ...fase3Events,
    ...fase4Events,
];

export const CRISIS_EVENTS: GameEvent[] = crisisEvents;
export const UNFORESEEN_EVENTS: GameEvent[] = unforeseenEvents;

export const GAME_EVENTS: GameEvent[] = [
    ...MAIN_EVENTS,
    ...CRISIS_EVENTS,
    ...UNFORESEEN_EVENTS,
];

export * from './builders';
export * from './crisis';
export * from './unforeseen';