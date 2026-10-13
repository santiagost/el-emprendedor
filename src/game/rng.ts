export interface RNG {
  next(): number;
  nextFloat(min: number, max: number): number;
  nextInt(min: number, max: number): number;
  nextBool(probability?: number): boolean;
  pick<T>(items: readonly T[]): T;
  pickWeighted<T>(items: readonly T[], getWeight: (item: T) => number): T;
  shuffle<T>(items: readonly T[]): T[];
  getState(): number;
  setState(state: number): void;
}

export function createRng(initialSeed: number): RNG {
  let s = Math.floor(initialSeed) | 0;

  // Algoritmo base Mulberry32
  const next = (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const nextFloat = (min: number, max: number): number => {
    return min + next() * (max - min);
  };

  const nextInt = (min: number, max: number): number => {
    return Math.floor(next() * (max - min + 1)) + min;
  };

  const nextBool = (probability = 0.5): boolean => {
    return next() < probability;
  };

  const pick = <T>(items: readonly T[]): T => {
    if (items.length === 0) throw new Error('No se puede elegir de un array vacío');
    return items[Math.floor(next() * items.length)];
  };

  const pickWeighted = <T>(items: readonly T[], getWeight: (item: T) => number): T => {
    if (items.length === 0) throw new Error('No se puede elegir de un array vacío');

    const totalWeight = items.reduce((sum, item) => sum + Math.max(0, getWeight(item)), 0);
    if (totalWeight <= 0) throw new Error('El peso total debe ser mayor que 0');

    let roll = next() * totalWeight;
    for (const item of items) {
      const weight = Math.max(0, getWeight(item));
      if (roll < weight) return item;
      roll -= weight;
    }

    return items[items.length - 1];
  };

  const shuffle = <T>(items: readonly T[]): T[] => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return {
    next,
    nextFloat,
    nextInt,
    nextBool,
    pick,
    pickWeighted,
    shuffle,
    getState: () => s,
    setState: (state: number) => { s = state | 0; },
  };
}