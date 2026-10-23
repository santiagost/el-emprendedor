import { Volume2, VolumeX } from 'lucide-react';
import IconButton from './IconButton';

interface SoundToggleProps {
  soundEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

export default function SoundToggle({ soundEnabled, onToggle, className = '' }: SoundToggleProps) {
  return (
    <IconButton
      onClick={(e) => {
        onToggle();
        // Con el mouse, soltar el foco: si no, Espacio (que avanza las escenas) volvería a activar el botón
        if (e.detail > 0) e.currentTarget.blur();
      }}
      aria-pressed={soundEnabled}
      title={soundEnabled ? 'Sonido: activado (clic para silenciar)' : 'Sonido: apagado (clic para activar)'}
      aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
      tone={
        soundEnabled
          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
      }
      className={className}
    >
      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </IconButton>
  );
}
