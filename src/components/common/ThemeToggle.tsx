import { Sun, Moon } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';
import IconButton from './IconButton';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ theme, onToggle, className = '' }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <IconButton
      onClick={onToggle}
      title={isDark ? 'Cambiar a modo claro (Aula Live)' : 'Cambiar a modo oscuro (Noche)'}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      tone={
        isDark
          ? 'bg-slate-900 border-slate-700/80 text-amber-300 hover:bg-slate-800 hover:border-slate-600'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      }
      className={className}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
      <span className="sr-only">
        {isDark ? 'Modo claro' : 'Modo oscuro'}
      </span>
    </IconButton>
  );
}
