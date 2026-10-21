import type { Archetype, Financing } from './types/game';
import { useState } from 'react';
import Setup from './components/setup/Setup';
import Game from './components/game/Game';
import { SAVED_GAME_STORAGE_KEY, loadSavedProfile } from './game/savedSession';

export default function App() {

  // Si hay una partida en curso guardada, se retoma directo sin pasar por Setup
  const [savedProfile] = useState(() => loadSavedProfile());
  const [setupComplete, setSetupComplete] = useState(savedProfile !== null);
  const [arquetipo, setArquetipo] = useState<Archetype | null>(savedProfile?.arquetipo ?? null);
  const [financiamiento, setFinanciamiento] = useState<Financing | null>(savedProfile?.financiamiento ?? null);

  const handleSetupComplete = (selectedArquetipo: Archetype, selectedFinanciamiento: Financing) => {
    setArquetipo(selectedArquetipo);
    setFinanciamiento(selectedFinanciamiento);
    setSetupComplete(true);
  };

  const handleResetToSetup = () => {
    try {
      localStorage.removeItem(SAVED_GAME_STORAGE_KEY);
    } catch {
      // ignore
    }
    setSetupComplete(false);
    setArquetipo(null);
    setFinanciamiento(null);
  };

  if (!setupComplete || !arquetipo || !financiamiento) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  return (
    <Game
      arquetipo={arquetipo}
      financiamiento={financiamiento}
      onResetToSetup={handleResetToSetup}
    />
  );
}