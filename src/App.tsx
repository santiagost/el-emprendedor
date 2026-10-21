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
  // Nombre de la sesión: se usa para la partida nueva y para precargar Setup al volver
  const [playerName, setPlayerName] = useState<string | undefined>(undefined);

  const handleSetupComplete = (selectedArquetipo: Archetype, selectedFinanciamiento: Financing, name?: string) => {
    setPlayerName(name);
    setArquetipo(selectedArquetipo);
    setFinanciamiento(selectedFinanciamiento);
    setSetupComplete(true);
  };

  const handleResetToSetup = (currentName?: string) => {
    setPlayerName(currentName);
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
    return <Setup onComplete={handleSetupComplete} initialName={playerName} />;
  }

  return (
    <Game
      arquetipo={arquetipo}
      financiamiento={financiamiento}
      playerName={playerName}
      onResetToSetup={handleResetToSetup}
    />
  );
}