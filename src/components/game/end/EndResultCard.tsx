import { AlertTriangle, CheckCircle2, Flag, Info, RefreshCw, RotateCcw, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Archetype, Financing } from '../../../types/game';
import type { Epilogue, EpilogueTone, WhyLine } from '../../../game/endReport';
import Button from '../../common/Button';
import Card from '../../common/Card';

const TONES: Record<EpilogueTone, { icon: LucideIcon; pill: string; label: string; title: string; why: string }> = {
  good: {
    icon: CheckCircle2,
    label: 'Victoria',
    pill: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-300',
    title: 'text-emerald-700 dark:text-emerald-400',
    why: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100',
  },
  info: {
    icon: CheckCircle2,
    label: 'Victoria',
    pill: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/70 text-blue-800 dark:text-blue-300',
    title: 'text-brand-cobalt dark:text-blue-400',
    why: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100',
  },
  warn: {
    icon: AlertTriangle,
    label: 'Victoria con un costo',
    pill: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300',
    title: 'text-amber-700 dark:text-amber-400',
    why: 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100',
  },
  bad: {
    icon: XCircle,
    label: 'Derrota',
    pill: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70 text-rose-800 dark:text-rose-300',
    title: 'text-rose-700 dark:text-rose-400',
    why: 'bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100',
  },
  neutral: {
    icon: Flag,
    label: 'Fin del recorrido',
    pill: 'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    title: 'text-slate-800 dark:text-slate-200',
    why: 'bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200',
  },
};

interface EndResultCardProps {
  epilogue: Epilogue;
  why: WhyLine;
  arquetipo: Archetype;
  financiamiento: Financing;
  onRestart: () => void;
  onResetToSetup: () => void;
}

export default function EndResultCard({ epilogue, why, arquetipo, financiamiento, onRestart, onResetToSetup }: EndResultCardProps) {
  const tone = TONES[epilogue.tone];
  const Icon = tone.icon;

  return (
    <Card
      as="section"
      shadow="hero"
      aria-label="Resultado de la partida"
      className="p-5 sm:p-8 animate-slide-up-fade"
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-10">
        <div className="flex-1 min-w-0 space-y-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-wider ${tone.pill}`}>
            <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {tone.label}
          </span>
          <div className="space-y-1">
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${tone.title}`}>{epilogue.title}</h2>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-600 dark:text-slate-400 font-semibold">{epilogue.subtitle}</p>
          </div>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">{epilogue.description}</p>
          <div className={`flex items-start gap-3 max-w-2xl p-3.5 rounded-xl ${tone.why}`}>
            <Info className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm sm:text-base leading-snug">
              <strong className="font-extrabold">{why.strong}</strong> {why.rest}
            </p>
          </div>
        </div>

        {/* Lado a lado en pantallas chicas y medias; apilados solo cuando hay una columna aparte */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:w-56 shrink-0">
          <Button size="md" onClick={onRestart} className="shadow-md">
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Reintentar
          </Button>
          <Button variant="secondary" size="md" onClick={onResetToSetup}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Cambiar perfil
          </Button>
        </div>
      </div>

      <p className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
        Perfil: <strong className="text-slate-800 dark:text-slate-200">{arquetipo.titulo}</strong> · Financiamiento:{' '}
        <strong className="text-slate-800 dark:text-slate-200">{financiamiento.titulo}</strong>
      </p>
    </Card>
  );
}
