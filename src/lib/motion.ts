import { useState, useEffect } from 'react';

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
 * Guarda la preferencia de efectos del usuario y despacha un evento para reactividad.
 */
export const setFxEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('el_emprendedor_fx_enabled', enabled ? 'true' : 'false');
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
  const [reduced, setReduced] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduced(prefersReducedMotion());
    };

    update();

    if (mediaQuery) {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', update);
      } else if ('addListener' in mediaQuery) {
        // Soporte para navegadores más antiguos
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
