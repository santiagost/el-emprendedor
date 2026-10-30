import { X } from 'lucide-react';
import type { Archetype, Financing, Objetivo } from '../../types/game';
import type { Tag } from '../../data/tags';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CompanyStatusCard from './CompanyStatusCard';

interface CompanyDrawerProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  activeTags: Tag[];
  objetivo?: Objetivo;
  onClose: () => void;
}

/** Panel "Mi empresa" para pantallas menores a lg (A7): entra desde la izquierda. */
export default function CompanyDrawer({ arquetipo, financiamiento, activeTags, objetivo, onClose }: CompanyDrawerProps) {
  return (
    <Modal
      placement="left"
      onClose={onClose}
      label="Mi empresa"
      className="lg:hidden"
      panelClassName="w-[88vw] max-w-sm h-full overflow-y-auto bg-brand-canvas dark:bg-night-canvas p-4 space-y-3 shadow-2xl animate-in slide-in-from-left duration-200"
    >
      <div className="flex justify-end">
        <Button variant="toolbar" onClick={onClose} aria-label="Cerrar panel Mi empresa">
          <X className="w-3.5 h-3.5" /> Cerrar
        </Button>
      </div>
      <CompanyStatusCard arquetipo={arquetipo} financiamiento={financiamiento} activeTags={activeTags} objetivo={objetivo} />
    </Modal>
  );
}
