import type { HTMLAttributes } from 'react';

const SHADOWS = {
  flat: 'shadow-sm',
  raised: 'shadow-sm dark:shadow-xl',
  hero: 'shadow-md dark:shadow-xl',
} as const;

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'aside';
  shadow?: keyof typeof SHADOWS;
}

/**
 * Tarjeta base: fondo blanco (night-surface en oscuro), borde y radio de tarjeta.
 * `className` suma padding, layout y animación; no debe repetir fondo, borde, radio ni sombra.
 */
export default function Card({ as: Tag = 'div', shadow = 'flat', className = '', ...props }: CardProps) {
  return (
    <Tag
      className={`bg-white dark:bg-night-surface border border-slate-200 dark:border-slate-800 rounded-2xl ${SHADOWS[shadow]} ${className}`}
      {...props}
    />
  );
}
