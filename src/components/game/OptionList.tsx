import { Gamepad2 } from 'lucide-react';
import type { GameOption } from '../../types/game';
import { hasPlayableMinigame } from '../../game/minigames/performance';
import ImpactBadges from './ImpactBadges';

interface OptionListProps {
  options: GameOption[];
  /** La coreografía de la interrupción todavía está en pantalla: las opciones ocupan su lugar pero no se ven. */
  hidden: boolean;
  /** La carta acaba de revelarse: las opciones entran escalonadas. */
  justRevealed: boolean;
  disabled: boolean;
  onPick: (optionIndex: number) => void;
}

/** Alternativas del dilema, debajo de la carta (se eligen con clic o con las teclas 1, 2 y 3). */
export default function OptionList({ options, hidden, justRevealed, disabled, onPick }: OptionListProps) {
  return (
    <div className={`space-y-3 ${hidden ? 'invisible' : ''}`}>
      <div className="flex items-center justify-between px-1">
        <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Alternativas Disponibles:
        </p>
        <span className="hidden sm:inline-block text-3xs text-slate-400 dark:text-slate-500 font-mono">
          Atajos: [1], [2], [3]
        </span>
      </div>

      {options.map((option, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onPick(idx)}
          style={justRevealed ? { animationDelay: `${250 + idx * 80}ms` } : undefined}
          className={`${justRevealed ? 'stage-option-in ' : ''}option-card w-full text-left p-4 bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-night-raised dark:hover:bg-night-raised-hover dark:active:bg-night-raised-press border border-slate-200 dark:border-slate-700/70 hover:border-brand-cobalt/50 dark:hover:border-indigo-500/60 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2.5 group shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-start gap-2.5">
            <span className="option-key flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-3xs font-mono text-slate-600 dark:text-slate-400 group-hover:bg-brand-cobalt dark:group-hover:bg-indigo-600 group-hover:text-white group-hover:border-brand-cobalt dark:group-hover:border-indigo-500">
              {idx + 1}
            </span>
            <div className="leading-snug text-slate-800 dark:text-slate-200 group-hover:text-brand-navy dark:group-hover:text-white flex-1 font-medium">
              {option.text}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <span className="text-3xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              Tendencia esperada:
            </span>
            <ImpactBadges impactPreview={option.impactPreview} />
          </div>
          {hasPlayableMinigame(option.minigame) && (
            <p className="flex items-center gap-1.5 text-3xs font-semibold uppercase tracking-wider text-brand-cobalt dark:text-indigo-300">
              <Gamepad2 className="w-3.5 h-3.5" aria-hidden="true" />
              Minijuego: tu ejecución mejora o empeora el resultado
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
