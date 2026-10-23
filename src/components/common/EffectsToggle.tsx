import { Clapperboard } from 'lucide-react';
import IconButton from './IconButton';

interface EffectsToggleProps {
  fxEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

export default function EffectsToggle({ fxEnabled, onToggle, className = '' }: EffectsToggleProps) {
  return (
    <IconButton
      onClick={onToggle}
      title={
        fxEnabled
          ? 'Efectos y animaciones: Activados (clic para modo accesible sin movimiento)'
          : 'Efectos y animaciones: Desactivados (clic para activar)'
      }
      aria-label={fxEnabled ? 'Desactivar efectos y animaciones' : 'Activar efectos y animaciones'}
      tone={
        fxEnabled
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-600 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
      }
      className={className}
    >
      <div className="relative">
        <Clapperboard
          className={`w-4 h-4 transition-transform duration-200 ${
            fxEnabled ? 'scale-100' : 'scale-90 opacity-60'
          }`}
        />
        {!fxEnabled && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        )}
      </div>
      <span className="sr-only">
        {fxEnabled ? 'Efectos activados' : 'Efectos reducidos'}
      </span>
    </IconButton>
  );
}
