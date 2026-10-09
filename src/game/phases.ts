export const PHASES= [
    {id: 1, label: 'Génesis & Validación', fromTurn: 1, toTurn: 3 },
  { id: 2, label: 'Tracción & Caja',      fromTurn: 4, toTurn: 6 },
  { id: 3, label: 'Escala & Crisis',      fromTurn: 7, toTurn: 10 },
  { id: 4, label: 'Consolidación & Salida', fromTurn: 11, toTurn: 15 },
] as const;

export const MAX_TURNS = PHASES.at(-1)!.toTurn;
export type Phase = (typeof PHASES)[number];
export type PhaseId = Phase['id'];

export const phaseForTurn = (turn: number) => 
    PHASES.find(p => turn >= p.fromTurn && turn <= p.toTurn);