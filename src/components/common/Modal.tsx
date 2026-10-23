import { useEffect, useRef, type ReactNode, type RefObject } from 'react';

const PLACEMENTS = {
  /** Ventana centrada (confirmaciones, avisos). */
  center: { root: 'items-center justify-center p-4', backdrop: 'bg-black/70 backdrop-blur-sm' },
  /** Hoja que sube desde abajo en móvil y queda centrada desde sm. */
  sheet: { root: 'items-end sm:items-center justify-center sm:p-6', backdrop: 'bg-black/70 backdrop-blur-sm' },
  /** Panel lateral izquierdo (drawer). Sin blur: el panel entra deslizándose. */
  left: { root: '', backdrop: 'bg-black/60 animate-in fade-in duration-200' },
} as const;

interface ModalProps {
  onClose: () => void;
  placement?: keyof typeof PLACEMENTS;
  /** Id del título del panel; si no hay título visible, usar `label`. */
  labelledBy?: string;
  label?: string;
  /** Elemento que recibe el foco al abrir; por defecto, el panel. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Devolver el foco al elemento que lo tenía al abrir. Apagado por defecto: en el juego Espacio avanza
   * las escenas, y un botón del encabezado con foco volvería a abrir la ventana.
   */
  restoreFocus?: boolean;
  /** Clases extra del contenedor (por ejemplo `lg:hidden`). */
  className?: string;
  /** Clases del panel: fondo, borde, tamaño y animación. */
  panelClassName?: string;
  children: ReactNode;
}

/**
 * Ventana modal: fondo oscuro, se cierra con Escape o tocando afuera y bloquea el scroll de la página.
 */
export default function Modal({
  onClose,
  placement = 'center',
  labelledBy,
  label,
  initialFocusRef,
  restoreFocus = false,
  className = '',
  panelClassName = '',
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Ref al último onClose: el efecto corre una sola vez aunque quien lo usa pase una función nueva en cada render
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (initialFocusRef?.current ?? panelRef.current)?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (restoreFocus) previous?.focus?.();
    };
  }, [initialFocusRef, restoreFocus]);

  const { root, backdrop } = PLACEMENTS[placement];

  return (
    <div className={`fixed inset-0 z-50 flex ${root} ${className}`}>
      <div aria-hidden="true" className={`absolute inset-0 ${backdrop}`} onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        tabIndex={-1}
        className={`relative focus:outline-none ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
