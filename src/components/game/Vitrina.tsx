import { AlertTriangle, Lock, Trophy } from 'lucide-react';
import type { Archetype, Financing } from '../../types/game';
import type { Tag } from '../../data/tags';
import { ESTANTES, RECONOCIMIENTOS, buildVitrina, tituloDe, type Estante } from '../../game/reconocimientos';
import { CHOICE_ICONS } from '../setup/choiceIcons';

/** Cada estante toma el color de la métrica que más empuja; el contorno no es lo único que dice qué es (hay nombre e ícono). */
const ESTANTE_UI: Record<Estante, { dot: string; ring: string; icon: string }> = {
  negocio: { dot: 'bg-metric-capital', ring: 'outline-metric-capital', icon: 'text-metric-capital' },
  mercado: { dot: 'bg-metric-reputacion', ring: 'outline-metric-reputacion', icon: 'text-metric-reputacion' },
  equipo: { dot: 'bg-metric-bienestar', ring: 'outline-metric-bienestar', icon: 'text-metric-bienestar' },
};

const MEDAL = 'flex shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-night-card shadow-[inset_0_2px_0_rgba(255,255,255,0.08),0_3px_6px_rgba(2,6,23,0.25)]';

interface VitrinaProps {
  activeTags: readonly Tag[];
  /** `panel`: columna "Mi empresa" (máximo 3 frentes). `final`: informe, con todo a la vista. */
  variant?: 'panel' | 'final';
}

/** Estantes con los trofeos ganados y los lugares vacíos, más los frentes abiertos. Sin cifras ni efectos. */
export default function Vitrina({ activeTags, variant = 'panel' }: VitrinaProps) {
  const vitrina = buildVitrina(activeTags);
  const isFinal = variant === 'final';
  const medal = isFinal ? 'w-12 h-12' : 'w-11 h-11';
  const maxFrentes = isFinal ? vitrina.frentes.length : 3;
  const frentes = vitrina.frentes.slice(0, maxFrentes);
  const hiddenFrentes = vitrina.frentes.length - frentes.length;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="font-display text-base font-extrabold text-slate-900 dark:text-slate-100">{isFinal ? 'Tu vitrina' : 'Vitrina'}</h4>
        <span className="text-sm font-bold tabular-nums text-slate-700 dark:text-slate-200">
          {vitrina.ganados} <span className="font-medium text-slate-500 dark:text-slate-400">de {vitrina.total}</span>
        </span>
      </div>

      {isFinal && vitrina.hito && <HitoDeSalida tag={vitrina.hito} />}

      <div className={isFinal ? 'grid gap-5 lg:grid-cols-3 lg:gap-6' : 'space-y-4'}>
      {vitrina.estantes.map((estante) => {
        const ui = ESTANTE_UI[estante.id];
        const label = ESTANTES.find((e) => e.id === estante.id)?.label;
        return (
          <section key={estante.id} aria-label={`Estante ${label}`} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-sm ${ui.dot}`} aria-hidden="true" />
                {label}
              </span>
              <span className="tabular-nums font-semibold text-slate-500 dark:text-slate-400">
                {estante.ganados.length}/{estante.total}
              </span>
            </div>
            <ul className="grid grid-cols-5 gap-1 px-0.5 pb-2.5 border-b-[5px] border-slate-200 dark:border-[#1E2A3F] rounded-b-[3px]">
              {estante.ganados.map((tag) => {
                const r = RECONOCIMIENTOS[tag];
                if (r.tipo !== 'trofeo') return null;
                const Icon = r.icono;
                return (
                  <li key={tag} className="flex flex-col items-center gap-1.5 py-1 text-center">
                    <span className={`${MEDAL} ${medal} outline outline-2 ${ui.ring} ${ui.icon}`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold leading-tight text-slate-700 dark:text-slate-200">{r.titulo}</span>
                  </li>
                );
              })}
              {Array.from({ length: estante.vacios }, (_, i) => (
                <li key={`vacio-${i}`} aria-label="Reconocimiento por ganar" className="flex flex-col items-center py-1">
                  <span
                    className={`${medal} flex items-center justify-center rounded-full border-[1.5px] border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500`}
                  >
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      </div>

      {frentes.length > 0 && (
        <div className="space-y-2 pt-3.5 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{isFinal ? 'Frentes que quedaron abiertos' : 'Frentes abiertos'}</span>
          <ul className={isFinal ? 'flex flex-wrap gap-2' : 'space-y-2'}>
            {frentes.map((tag) => (
              <li
                key={tag}
                className={`flex items-center gap-2.5 min-h-10 px-3 rounded-[10px] border-[1.5px] border-dashed border-metric-peligro text-sm font-semibold text-slate-800 dark:text-slate-100 ${
                  isFinal ? 'rounded-full' : ''
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-metric-peligro" aria-hidden="true" />
                {tituloDe(tag)}
              </li>
            ))}
          </ul>
          {hiddenFrentes > 0 && <p className="text-xs text-slate-500 dark:text-slate-400">y {hiddenFrentes} más que también pesan</p>}
        </div>
      )}
    </div>
  );
}

/** Cómo se cerró la historia: el hito de salida, grande, arriba de los estantes del informe. */
export function HitoDeSalida({ tag }: { tag: Tag }) {
  const r = RECONOCIMIENTOS[tag];
  if (r.tipo !== 'hito') return null;
  const Icon = r.icono;
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-5 rounded-2xl bg-slate-100 dark:bg-night-card text-center w-full max-w-md mx-auto">
      <span className="flex w-20 h-20 items-center justify-center rounded-full bg-white dark:bg-night-canvas outline outline-[3px] outline-amber-500 dark:outline-amber-300 text-amber-600 dark:text-amber-300 shadow-[0_0_0_8px_rgba(251,191,36,0.12)]">
        <Icon className="w-9 h-9" aria-hidden="true" />
      </span>
      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
        <Trophy className="w-3.5 h-3.5" aria-hidden="true" /> Hito de salida
      </span>
      <span className="font-display text-2xl font-extrabold leading-none text-slate-900 dark:text-slate-100">{r.titulo}</span>
    </div>
  );
}

interface PuntoDePartidaProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  activeTags: readonly Tag[];
}

/** Fila "Tu punto de partida": perfil, financiamiento y lo que el perfil trae de herencia. */
export function PuntoDePartida({ arquetipo, financiamiento, activeTags }: PuntoDePartidaProps) {
  const herencia = buildVitrina(activeTags).herencia;
  const fichas = [
    { key: arquetipo.id, titulo: arquetipo.titulo, Icon: CHOICE_ICONS[arquetipo.id] },
    { key: financiamiento.id, titulo: financiamiento.titulo, Icon: CHOICE_ICONS[financiamiento.id] },
    ...herencia.map((tag) => {
      const r = RECONOCIMIENTOS[tag];
      return { key: tag, titulo: r.titulo, Icon: r.tipo === 'herencia' ? r.icono : undefined };
    }),
  ];

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Tu punto de partida</span>
      <ul className="flex flex-wrap gap-1.5">
        {fichas.map(({ key, titulo, Icon }) => (
          <li
            key={key}
            className="inline-flex items-center gap-2 h-8 pl-1 pr-3 rounded-full bg-slate-100 dark:bg-night-card text-xs font-semibold text-slate-800 dark:text-slate-100"
          >
            <span className="flex w-6 h-6 items-center justify-center rounded-full bg-white dark:bg-night-canvas text-slate-500 dark:text-slate-400">
              {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
            </span>
            {titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}
