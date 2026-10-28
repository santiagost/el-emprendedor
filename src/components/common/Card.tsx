import type { HTMLAttributes } from 'react';

const SURFACES = {
  /** Ficha o panel: sin sombra. */
  flat: 'bg-white dark:bg-night-surface rounded-2xl',
  /** Carta del turno: la única pieza con sombra en pantalla. */
  raised: 'bg-white dark:bg-night-card rounded-[20px] shadow-carta',
  /** Carta del resultado final. */
  hero: 'bg-white dark:bg-night-card rounded-[20px] shadow-carta',
} as const;

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'aside';
  shadow?: keyof typeof SURFACES;
}

/**
 * Tarjeta base con borde. `flat` es una ficha o panel (night-surface en oscuro, sin sombra); `raised` y `hero`
 * son la carta (night-card en oscuro, con sombra). `className` suma padding, layout y animación;
 * no debe repetir fondo, borde, radio ni sombra.
 */
export default function Card({ as: Tag = 'div', shadow = 'flat', className = '', ...props }: CardProps) {
  return (
    <Tag
      className={`border border-slate-200 dark:border-slate-800 ${SURFACES[shadow]} ${className}`}
      {...props}
    />
  );
}
