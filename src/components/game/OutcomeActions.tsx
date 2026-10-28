import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

interface OutcomeActionsProps {
  isRevealing: boolean;
  /** Terminó la secuencia del resultado por capas: se puede avanzar. */
  isCompleted: boolean;
  nextLabel: string;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * Debajo de la carta, después de decidir: "Procesando…", "Saltar animación" o el botón para avanzar.
 * En móvil queda fijo abajo, en la zona del pulgar (A2); el espaciador evita que tape el final de la carta.
 */
export default function OutcomeActions({ isRevealing, isCompleted, nextLabel, onNext, onSkip }: OutcomeActionsProps) {
  return (
    <>
      <div aria-hidden="true" className="h-24 sm:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-brand-canvas/95 dark:bg-night-canvas/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 sm:static sm:z-auto sm:p-0 sm:bg-transparent sm:dark:bg-transparent sm:backdrop-blur-none sm:border-0 space-y-3">
        {isRevealing ? (
          <div className="p-4 bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-xl text-center space-y-1 animate-in fade-in duration-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 animate-pulse">
              Procesando decisión…
            </p>
          </div>
        ) : isCompleted ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            <Button size="lg" onClick={onNext} className="w-full shadow-lg shadow-brand-cobalt/25 group">
              <span>{nextLabel}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Presioná <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Espacio</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Enter</kbd> para avanzar
            </p>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={onSkip}
            className="w-full py-3.5 px-4 text-xs sm:text-sm rounded-xl shadow-sm"
          >
            <span>Saltar animación</span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">(Espacio)</span>
          </Button>
        )}
      </div>
    </>
  );
}
