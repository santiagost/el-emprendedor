import PitchGame from './PitchGame';
import CrunchGame from './CrunchGame';
import NegotiationGame from './NegotiationGame';
import type { MinigameSpec, Performance } from '../../../types/game';

interface MinigameStageProps {
  spec: MinigameSpec;
  /** Semilla reproducible de esta decisión (evento + turno). */
  seed: number;
  /** Reputación actual: define el margen de la negociación. */
  reputation: number;
  onResolve: (performance: Performance) => void;
  /** Saltar equivale a 'good': el resultado normal de la opción. */
  onSkip: () => void;
}

/** Elige el minijuego según `spec.kind`. Los tipos sin implementar no llegan acá: hasPlayableMinigame los filtra. */
export default function MinigameStage({ spec, seed, reputation, onResolve, onSkip }: MinigameStageProps) {
  switch (spec.kind) {
    case 'timing':
      return <PitchGame seed={seed} difficulty={spec.difficulty} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    case 'tapping':
      return <CrunchGame seed={seed} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    case 'balance':
      return <NegotiationGame seed={seed} reputation={reputation} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    default:
      return null;
  }
}
