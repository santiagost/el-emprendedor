import type { Archetype, Financing } from './types/game';
import { useState } from 'react';
import Setup from './components/setup/Setup';
import Game from './components/game/Game';

export default function App() {

  const [setupComplete, setSetupComplete] = useState(false);
  const [arquetipo, setArquetipo] = useState<Archetype | null>(null);
  const [financiamiento, setFinanciamiento] = useState<Financing | null>(null);

  const handleSetupComplete = (selectedArquetipo: Archetype, selectedFinanciamiento: Financing) => {
    setArquetipo(selectedArquetipo);
    setFinanciamiento(selectedFinanciamiento);
    setSetupComplete(true);
  };

  if (!setupComplete || !arquetipo || !financiamiento) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  return (
    <Game arquetipo={arquetipo} financiamiento={financiamiento} />
  );
}