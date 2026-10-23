import type { ButtonHTMLAttributes } from 'react';

const BASE = 'inline-flex items-center justify-center transition-colors';

const VARIANTS = {
  /** Acción principal de la pantalla: navy en claro, cobalt en oscuro. */
  primary:
    'gap-2 bg-brand-navy hover:bg-brand-cobalt active:bg-brand-navy-press dark:bg-brand-cobalt dark:hover:bg-brand-cobalt-hover text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50',
  /** Acción alternativa (cambiar perfil, seguir jugando, saltar). */
  secondary:
    'gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold',
  /** Acción destructiva (salir de la partida). */
  danger: 'gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-600/20',
  /** Botón chico de barra de herramientas (Mi empresa, Reiniciar, Cerrar). */
  toolbar:
    'gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 text-2xs font-medium shadow-sm',
} as const;

/** El tamaño fija alto, texto y radio. `toolbar` ya trae el suyo; sin `size`, los pone quien lo usa. */
const SIZES = {
  sm: 'py-2.5 px-3 text-xs rounded-lg',
  md: 'py-3.5 px-4 text-sm rounded-xl',
  lg: 'py-4 px-4 text-sm sm:text-base rounded-xl',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Botón con los colores y estados del juego. `className` suma ancho, sombra o disabled;
 * no debe repetir color, padding ni radio (Tailwind no resuelve clases en conflicto por orden).
 */
export default function Button({ variant = 'primary', size, className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${size ? SIZES[size] : ''} ${className}`}
      {...props}
    />
  );
}
