import type { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Colores de fondo, borde, texto y hover según el estado (activado, apagado, tema). */
  tone: string;
}

/** Botón cuadrado de solo ícono, como los interruptores de sonido, efectos y tema. */
export default function IconButton({ tone, className = '', type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 border shadow-sm ${tone} ${className}`}
      {...props}
    />
  );
}
