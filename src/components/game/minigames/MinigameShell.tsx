import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FastForward, Play } from 'lucide-react';
import { playSound } from '../../../lib/sound';
import { useStoredFlag } from '../../../hooks/useStoredFlag';
import { vibrate } from '../../../lib/fx';
import Button from '../../common/Button';

export const ASSIST_STORAGE_KEY = 'el_emprendedor_minigame_assist';

interface MinigameShellProps {
  title: string;
  /** Regla en una línea. */
  rule: string;
  icon: ReactNode;
  onSkip: () => void;
  /**
   * Se llama con `running` en false hasta que termina la cuenta atrás, y con `assisted` (modo asistido: más margen).
   * El modo asistido se elige antes de empezar y después queda fijo.
   */
  children: (running: boolean, assisted: boolean) => ReactNode;
}

const COUNTDOWN_FROM = 3;
const COUNTDOWN_STEP_MS = 650;

/**
 * Marco común de los minijuegos: título, regla, botón "Empezar", cuenta atrás 3-2-1 y botón "Saltar".
 * El jugador decide cuándo arrancar: puede mirar el tablero y leer la regla antes de la cuenta atrás.
 * Saltar (o Esc) resuelve con el resultado normal: ningún minijuego es obligatorio.
 */
export default function MinigameShell({ title, rule, icon, onSkip, children }: MinigameShellProps) {
  // null = esperando que el jugador toque "Empezar"
  const [count, setCount] = useState<number | null>(null);
  const [assisted, setAssisted] = useStoredFlag(ASSIST_STORAGE_KEY, false);
  const skipRef = useRef(onSkip);
  useEffect(() => {
    skipRef.current = onSkip;
  }, [onSkip]);

  useEffect(() => {
    if (count === null || count <= 0) return;
    playSound('tickUp');
    vibrate(15);
    const id = setTimeout(() => setCount((c) => (c === null ? c : c - 1)), COUNTDOWN_STEP_MS);
    return () => clearTimeout(id);
  }, [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        skipRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const running = count !== null && count <= 0;

  return (
    <section
      aria-label={`Minijuego: ${title}`}
      className="stage-reveal p-4 sm:p-5 bg-white dark:bg-night-raised border border-slate-200 dark:border-slate-700/70 rounded-xl shadow-sm space-y-4"
    >
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-cobalt/10 text-brand-cobalt dark:bg-indigo-500/15 dark:text-indigo-300">
            {icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{rule}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={onSkip}
          className="shrink-0 self-start px-2.5 py-1.5 rounded-lg text-2xs"
        >
          <FastForward className="w-3.5 h-3.5" aria-hidden="true" />
          Saltar (resultado normal)
        </Button>
      </header>

      <div className="relative">
        {children(running, assisted)}
        {count === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/75 dark:bg-night-raised/75">
            <Button
              autoFocus
              onClick={() => {
                playSound('select');
                setCount(COUNTDOWN_FROM);
              }}
              className="px-6 py-3 rounded-xl text-sm shadow-lg shadow-brand-cobalt/25"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Empezar
            </Button>
            <p className="text-2xs text-slate-600 dark:text-slate-300">Mirá el tablero y empezá cuando estés listo.</p>
            <label className="mt-1 flex items-center gap-2 text-2xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input type="checkbox" checked={assisted} onChange={(e) => setAssisted(e.target.checked)} className="accent-brand-cobalt" />
              Modo asistido (más margen)
            </label>
          </div>
        )}
        {count !== null && count > 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 dark:bg-night-raised/80 backdrop-blur-[1px]"
            aria-live="assertive"
          >
            <span key={count} className="stage-stamp text-5xl font-black tabular-nums text-brand-navy dark:text-white">
              {count}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
