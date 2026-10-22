import { Zap } from 'lucide-react';
import type { GameEventKind } from '../../types/game';
import { INLINE_ICON_CLASS } from './iconStyles';

/** Rayo delante del título de un imprevisto. */
export function EventKindIcon({ kind }: { kind?: GameEventKind }) {
  if (kind !== 'unforeseen') return null;
  return <Zap className={`${INLINE_ICON_CLASS} mr-2`} aria-hidden="true" />;
}
