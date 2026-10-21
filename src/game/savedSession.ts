import type { Archetype, Financing } from '../types/game';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';

export const SAVED_GAME_STORAGE_KEY = 'el_emprendedor_saved_game';

export interface SavedProfile {
  arquetipo: Archetype;
  financiamiento: Financing;
}

/**
 * Lee el perfil (arquetipo + financiamiento) de una partida guardada en curso.
 * Devuelve null si no hay guardado, está corrupto, ya terminó o referencia ids que ya no existen.
 */
export function parseSavedProfile(raw: string | null): SavedProfile | null {
  if (!raw) return null;
  try {
    const gameState = JSON.parse(raw)?.gameState;
    if (gameState?.status !== 'playing') return null;

    const arquetipo = ARCHETYPES.find((a) => a.id === gameState.archetypeId);
    const financiamiento = FINANCINGS.find((f) => f.id === gameState.financingId);
    return arquetipo && financiamiento ? { arquetipo, financiamiento } : null;
  } catch {
    return null;
  }
}

/**
 * Perfil de la partida guardada en localStorage, para retomarla al recargar la página.
 */
export function loadSavedProfile(): SavedProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    return parseSavedProfile(localStorage.getItem(SAVED_GAME_STORAGE_KEY));
  } catch {
    return null;
  }
}
