import { RotateCcw } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

interface ExitConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmación antes de abandonar la partida y volver a Setup. */
export default function ExitConfirmModal({ onConfirm, onCancel }: ExitConfirmModalProps) {
  return (
    <Modal
      onClose={onCancel}
      labelledBy="salir-titulo"
      panelClassName="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
        <RotateCcw className="w-5 h-5" />
      </div>
      <div className="space-y-1.5">
        <h3 id="salir-titulo" className="text-base font-bold text-slate-900 dark:text-slate-100">
          ¿Abandonar partida actual?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Se perderá el progreso de esta trayectoria y volverás a la pantalla de configuración para elegir perfil y financiamiento.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Sí, salir
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Seguir jugando
        </Button>
      </div>
    </Modal>
  );
}
