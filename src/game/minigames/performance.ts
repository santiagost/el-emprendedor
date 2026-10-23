import type { MinigameKind, MinigameSpec, Performance } from '../../types/game';

/** Minijuegos con implementación. Una opción con un tipo que no esté acá se juega como una opción común. */
const AVAILABLE_KINDS: readonly MinigameKind[] = ['timing', 'tapping', 'balance', 'roulette'];

export const hasPlayableMinigame = (spec: MinigameSpec | undefined): spec is MinigameSpec =>
  Boolean(spec && AVAILABLE_KINDS.includes(spec.kind));

export const PERFORMANCE_LABEL: Record<Performance, string> = {
  perfect: 'Ejecución perfecta',
  good: 'Ejecución sólida',
  poor: 'Ejecución floja',
};

/** Frase corta del efecto del rendimiento sobre el resultado, para mostrar junto a los deltas. */
export const PERFORMANCE_HINT: Record<Performance, string> = {
  perfect: 'Los efectos positivos rinden más y los costos pesan menos.',
  good: 'Resultado esperado.',
  poor: 'Los efectos positivos rinden menos y los costos pesan más.',
};

/** Hash estable de un texto a entero de 32 bits: semilla reproducible por decisión (evento + turno). */
export function seedFromText(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h | 0;
}
