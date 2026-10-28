import type { LucideIcon } from 'lucide-react';
import { Clapperboard, Moon, RotateCcw, Sun, Volume2, VolumeX } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';
import Modal from '../common/Modal';

interface GameMenuProps {
  theme: Theme;
  onToggleTheme: () => void;
  fxEnabled: boolean;
  onToggleFx: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExit: () => void;
  onClose: () => void;
}

interface MenuRowProps {
  icon: LucideIcon;
  label: string;
  state: string;
  onClick: () => void;
  pressed?: boolean;
}

function MenuRow({ icon: Icon, label, state, onClick, pressed }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="w-full flex items-center gap-3 min-h-12 px-3 rounded-xl text-left text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <Icon className="w-5 h-5 shrink-0 text-slate-500 dark:text-slate-400" />
      <span className="flex-1">{label}</span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{state}</span>
    </button>
  );
}

/** Menú de partida en móvil (A5): sonido, efectos y tema; Reiniciar, que es destructivo, va aparte. */
export default function GameMenu({
  theme,
  onToggleTheme,
  fxEnabled,
  onToggleFx,
  soundEnabled,
  onToggleSound,
  onExit,
  onClose,
}: GameMenuProps) {
  const isDark = theme === 'dark';

  return (
    <Modal
      placement="sheet"
      onClose={onClose}
      label="Opciones de partida"
      className="sm:hidden"
      panelClassName="w-full bg-white dark:bg-night-surface border-t border-slate-200 dark:border-slate-800 rounded-t-2xl p-3 pb-5 space-y-1 shadow-2xl animate-in slide-in-from-bottom duration-200"
    >
      <MenuRow
        icon={soundEnabled ? Volume2 : VolumeX}
        label="Sonido"
        state={soundEnabled ? 'Activado' : 'Apagado'}
        pressed={soundEnabled}
        onClick={onToggleSound}
      />
      <MenuRow
        icon={Clapperboard}
        label="Efectos y animaciones"
        state={fxEnabled ? 'Activados' : 'Reducidos'}
        pressed={fxEnabled}
        onClick={onToggleFx}
      />
      <MenuRow
        icon={isDark ? Sun : Moon}
        label={isDark ? 'Modo claro' : 'Modo oscuro'}
        state={isDark ? 'Ahora: oscuro' : 'Ahora: claro'}
        onClick={onToggleTheme}
      />
      <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            onClose();
            onExit();
          }}
          className="w-full flex items-center gap-3 min-h-12 px-3 rounded-xl text-left text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <RotateCcw className="w-5 h-5 shrink-0" />
          Reiniciar partida
        </button>
      </div>
    </Modal>
  );
}
