import PitchGame from './PitchGame';
import CrunchGame from './CrunchGame';
import NegotiationGame from './NegotiationGame';
import LaunchGame from './LaunchGame';
import type { Tag } from '../../../data/tags';
import type { MinigameSpec, Performance } from '../../../types/game';

interface MinigameStageProps {
  spec: MinigameSpec;
  /** Semilla reproducible de esta decisión (evento + turno). */
  seed: number;
  /** Reputación actual: define el margen de la negociación. */
  reputation: number;
  /** Tags activos: definen el tamaño de los segmentos de la ruleta. */
  activeTags: readonly Tag[];
  onResolve: (performance: Performance) => void;
  /** Saltar equivale a 'good': el resultado normal de la opción. */
  onSkip: () => void;
}

/** Elige el minijuego según `spec.kind`. Los tipos sin implementar no llegan acá: hasPlayableMinigame los filtra. */
export default function MinigameStage({ spec, seed, reputation, activeTags, onResolve, onSkip }: MinigameStageProps) {
  switch (spec.kind) {
    case 'timing':
      return <PitchGame seed={seed} difficulty={spec.difficulty} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    case 'tapping':
      return <CrunchGame seed={seed} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    case 'balance':
      return <NegotiationGame seed={seed} reputation={reputation} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    case 'roulette':
      return <LaunchGame seed={seed} activeTags={activeTags} riskBias={spec.riskBias} title={spec.title} rule={spec.rule} onResolve={onResolve} onSkip={onSkip} />;
    default:
      return null;
  }
}
