import PitchGame from './PitchGame';
import type { MinigameSpec, Performance } from '../../../types/game';

interface MinigameStageProps {
  spec: MinigameSpec;
  /** Semilla reproducible de esta decisión (evento + turno). */
  seed: number;
  onResolve: (performance: Performance) => void;
  /** Saltar equivale a 'good': el resultado normal de la opción. */
  onSkip: () => void;
}

/** Elige el minijuego según `spec.kind`. Un tipo sin implementar se resuelve como 'good' para no trabar la partida. */
export default function MinigameStage({ spec, seed, onResolve, onSkip }: MinigameStageProps) {
  switch (spec.kind) {
    case 'timing':
      return <PitchGame seed={seed} difficulty={spec.difficulty} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    default:
      return null;
  }
}
