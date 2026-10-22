import canvasConfetti from 'canvas-confetti';
import { prefersReducedMotion } from './motion';
import { playSound } from './sound';

export type ConfettiKind = 'gold' | 'victory' | 'default';

/**
 * Dispara háptica (vibración en dispositivos móviles soportados).
 * Respeta reduced-motion desactivándose automáticamente.
 */
export const vibrate = (ms: number | number[] = 50): void => {
  if (prefersReducedMotion()) return;
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      // Ignorar restricciones de contexto o permisos
    }
  }
};

/**
 * Dispara confeti visual según la ocasión.
 * Respeta reduced-motion omitiendo el efecto.
 */
export const confetti = (kind: ConfettiKind = 'default'): void => {
  // El sonido de hito es independiente del movimiento: suena aunque no haya confeti
  playSound(kind === 'default' ? 'phase' : 'milestone');
  // A4: el hito también vibra (vibrate ya respeta reduced motion)
  vibrate(kind === 'victory' ? [120, 60, 120, 60, 240] : kind === 'gold' ? [60, 40, 60] : 40);
  if (prefersReducedMotion()) return;

  try {
    if (kind === 'gold') {
      canvasConfetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FFFFFF'],
        disableForReducedMotion: true,
      });
    } else if (kind === 'victory') {
      canvasConfetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#0052CC', '#0F9D58', '#FF9800', '#F59E0B', '#3B82F6'],
        disableForReducedMotion: true,
      });
    } else {
      canvasConfetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        disableForReducedMotion: true,
      });
    }
  } catch {
    // Canvas context fallback seguro
  }
};
