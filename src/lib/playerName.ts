import { sanitizePlayerName } from './personalize';

const PLAYER_NAME_STORAGE_KEY = 'el_emprendedor_player_name';

/**
 * Nombre que el jugador pidió recordar para futuras partidas (undefined si no hay).
 */
export function loadRememberedName(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return sanitizePlayerName(localStorage.getItem(PLAYER_NAME_STORAGE_KEY));
  } catch {
    return undefined;
  }
}

export function rememberName(name: string): void {
  try {
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name);
  } catch {
    // ignore
  }
}

export function forgetName(): void {
  try {
    localStorage.removeItem(PLAYER_NAME_STORAGE_KEY);
  } catch {
    // ignore
  }
}
