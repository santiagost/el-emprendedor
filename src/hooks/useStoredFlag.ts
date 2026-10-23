import { useState, useCallback } from 'react';

/**
 * Booleano persistido en localStorage (con fallback silencioso si no está disponible).
 */
export function useStoredFlag(storageKey: string, defaultValue = false): [boolean, (next: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) return stored === 'true';
    } catch {
      // ignore
    }
    return defaultValue;
  });

  const update = useCallback(
    (next: boolean) => {
      setValue(next);
      try {
        localStorage.setItem(storageKey, next ? 'true' : 'false');
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  return [value, update];
}
