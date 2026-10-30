/** Las cuatro fases y su nombre. Los turnos que abarca cada una dependen de la duración de la partida: ver phasesFor. */
export const PHASES = [
  { id: 1, label: 'Génesis & Validación' },
  { id: 2, label: 'Tracción & Caja' },
  { id: 3, label: 'Escala & Crisis' },
  { id: 4, label: 'Consolidación & Salida' },
] as const;

export type PhaseId = (typeof PHASES)[number]['id'];

export interface Phase {
  id: PhaseId;
  label: string;
  fromTurn: number;
  toTurn: number;
}

/** Turnos de cada fase según la duración de la partida (partida corta y completa). */
const PHASE_LENGTHS: Record<number, readonly number[]> = {
  10: [2, 2, 3, 3],
  15: [3, 3, 4, 5],
};

/** Duración por defecto: la de las partidas guardadas antes de que existiera la partida corta. */
export const MAX_TURNS = 15;

/** Duraciones que se pueden elegir al empezar: nombre y una línea que dice qué esperar. */
export const GAME_DURATIONS = [
  { turns: 10, label: 'Corta', hint: 'Una versión más ágil: menos años para probar cómo es.' },
  { turns: 15, label: 'Completa', hint: 'El recorrido entero, con tiempo para que tus decisiones pesen.' },
] as const;

export const phasesFor = (maxTurns: number): Phase[] => {
  const lengths = PHASE_LENGTHS[maxTurns];
  if (!lengths) {
    throw new RangeError(`No hay fases definidas para una partida de ${maxTurns} turnos`);
  }
  let fromTurn = 1;
  return PHASES.map((phase, index) => {
    const toTurn = fromTurn + lengths[index] - 1;
    const result = { ...phase, fromTurn, toTurn };
    fromTurn = toTurn + 1;
    return result;
  });
};

export const phaseForTurn = (turn: number, maxTurns: number) =>
  phasesFor(maxTurns).find((p) => turn >= p.fromTurn && turn <= p.toTurn);
