import { useState, useEffect } from 'react';

/**
 * Sincroniza la clase `.reduced-motion` en `<html>` para que las reglas CSS
 * desactiven animaciones y parpadeos automáticamente.
 */
export const syncReducedMotionClass = (): boolean => {
  if (typeof document === 'undefined') return false;
  const isReduced = prefersReducedMotion();
  if (isReduced) {
    document.documentElement.classList.add('reduced-motion');
  } else {
    document.documentElement.classList.remove('reduced-motion');
  }
  return isReduced;
};

/**
 * Verifica si los efectos visuales y hápticos están habilitados en la app.
 */
export const isFxEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('el_emprendedor_fx_enabled');
    if (stored !== null) return stored === 'true';
  } catch {
    // ignore
  }
  return true;
};

/**
 * Guarda la preferencia de efectos del usuario, actualiza el DOM y despacha un evento.
 */
export const setFxEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('el_emprendedor_fx_enabled', enabled ? 'true' : 'false');
    syncReducedMotionClass();
    window.dispatchEvent(new CustomEvent('el_emprendedor_fx_change', { detail: enabled }));
  } catch {
    // ignore
  }
};

/**
 * Determina si se debe reducir o desactivar el movimiento:
 * Ya sea porque el sistema operativo tiene prefers-reduced-motion activo
 * o porque el usuario apagó los efectos en la app.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (!isFxEnabled()) return true;
  try {
    return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  } catch {
    return false;
  }
};

/**
 * Hook de React para suscribirse en tiempo real a cambios en prefers-reduced-motion
 * o al toggle de efectos de la app.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    syncReducedMotionClass();
    return prefersReducedMotion();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => {
      const isRed = syncReducedMotionClass();
      setReduced(isRed);
    };

    update();

    if (mediaQuery) {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', update);
      } else if ('addListener' in mediaQuery) {
        (mediaQuery as { addListener: (cb: () => void) => void }).addListener(update);
      }
    }

    window.addEventListener('storage', update);
    window.addEventListener('el_emprendedor_fx_change', update);

    return () => {
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', update);
        } else if ('removeListener' in mediaQuery) {
          (mediaQuery as { removeListener: (cb: () => void) => void }).removeListener(update);
        }
      }
      window.removeEventListener('storage', update);
      window.removeEventListener('el_emprendedor_fx_change', update);
    };
  }, []);

  return reduced;
}

/**
 * Hook de React para controlar el toggle interactivo de Efectos (on/off).
 */
export function useEffectsToggle(): {
  fxEnabled: boolean;
  toggleFx: () => void;
  isReducedMotion: boolean;
} {
  const isReducedMotion = useReducedMotion();
  const [fxEnabled, setFxState] = useState<boolean>(() => isFxEnabled());

  useEffect(() => {
    const update = () => {
      setFxState(isFxEnabled());
    };
    window.addEventListener('storage', update);
    window.addEventListener('el_emprendedor_fx_change', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('el_emprendedor_fx_change', update);
    };
  }, []);

  const toggleFx = () => {
    const next = !fxEnabled;
    setFxEnabled(next);
    setFxState(next);
  };

  return { fxEnabled, toggleFx, isReducedMotion };
}

// Sincronizar al cargar el módulo en el cliente
if (typeof document !== 'undefined') {
  syncReducedMotionClass();
}
