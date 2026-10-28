import { Gamepad2 } from 'lucide-react';
import type { GameOption } from '../../types/game';
import { hasPlayableMinigame } from '../../game/minigames/performance';
import ImpactBadges from './ImpactBadges';

interface OptionListProps {
  options: GameOption[];
  /** Texto en condicional bajo el título de cada opción (mismo orden que `options`); vacío = sin texto. */
  hints: string[];
  /** La coreografía de la interrupción todavía está en pantalla: las opciones ocupan su lugar pero no se ven. */
  hidden: boolean;
  /** La carta acaba de revelarse: las opciones entran escalonadas. */
  justRevealed: boolean;
  disabled: boolean;
  /** Fases avanzadas: cada opción muestra la tendencia que el jugador intuye (a veces falla). */
  showIntuition?: boolean;
  onPick: (optionIndex: number) => void;
}

/** Alternativas del dilema, debajo de la carta (se eligen con clic o con las teclas 1, 2 y 3). */
export default function OptionList({ options, hints, hidden, justRevealed, disabled, showIntuition = false, onPick }: OptionListProps) {
  return (
    <div className={`space-y-3 ${hidden ? 'invisible' : ''}`}>
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">¿Qué hacés?</p>
        <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 font-mono">
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
          className={`${justRevealed ? 'stage-option-in ' : ''}option-card w-full text-left p-4 sm:p-5 bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-night-raised dark:hover:bg-night-raised-hover dark:active:bg-night-raised-press border-2 border-slate-200 dark:border-slate-700/70 hover:border-brand-cobalt dark:hover:border-indigo-500 rounded-2xl group shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-start gap-3.5 sm:gap-4`}
        >
          <span className="option-key flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800 font-display text-base sm:text-xl font-extrabold tabular-nums text-brand-cobalt dark:text-indigo-300 group-hover:bg-brand-cobalt dark:group-hover:bg-indigo-600 group-hover:text-white">
            {idx + 1}
          </span>
          <span className="min-w-0 flex-1 space-y-1.5">
            <span className="block text-base sm:text-lg font-bold leading-snug text-brand-navy dark:text-slate-100">
              {option.text}
            </span>
            {hints[idx] && (
              <span className="block text-sm leading-relaxed italic text-slate-600 dark:text-slate-300">
                {hints[idx]}
              </span>
            )}
            {showIntuition && (
              <span className="flex items-center gap-2 pt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tu intuición:
                <ImpactBadges impactPreview={option.impactPreview} size="md" />
              </span>
            )}
            {hasPlayableMinigame(option.minigame) && (
              <span className="flex items-center gap-1.5 pt-1 text-xs font-semibold uppercase tracking-wider text-brand-cobalt dark:text-indigo-300">
                <Gamepad2 className="w-3.5 h-3.5" aria-hidden="true" />
                Minijuego: tu ejecución mejora o empeora el resultado
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
