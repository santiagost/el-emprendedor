import { fase1Events } from "./fase1";
import { fase2Events } from "./fase2";
import { fase3Events } from "./fase3";
import { fase4Events } from "./fase4";
import type { GameEvent } from "../../types/game";

export const GAME_EVENTS: GameEvent[] = [
    ...fase1Events,
    ...fase2Events,
    ...fase3Events,
    ...fase4Events,
];

export * from './builders'