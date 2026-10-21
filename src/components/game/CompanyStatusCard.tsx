import type { Archetype, Financing, Metrics } from '../../types/game';
import { TAGS, type Tag } from '../../data/tags';
import { Building2, Landmark, Layers, PanelLeftClose, PanelLeftOpen, Tag as TagIcon, UserRound } from 'lucide-react';

interface CompanyStatusCardProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  activeTags: Tag[];
  /** Panel lateral de escritorio: solo íconos (56 px). */
  collapsed?: boolean;
  /** Si se pasa, se muestra el botón de colapsar/expandir (solo panel de escritorio). */
  onToggleCollapse?: () => void;
}

export default function CompanyStatusCard({
  arquetipo,
  financiamiento,
  activeTags,
  collapsed = false,
  onToggleCollapse,
}: CompanyStatusCardProps) {
  if (collapsed) {
    const iconBox =
      'w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 flex items-center justify-center text-slate-600 dark:text-slate-300';
    return (
      <div className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800/90 rounded-2xl py-2.5 flex flex-col items-center gap-2 shadow-sm transition-colors">
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Expandir Mi empresa"
            aria-label="Expandir panel Mi empresa"
            aria-expanded={false}
            className={`${iconBox} hover:text-[#0052CC] dark:hover:text-blue-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors`}
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
        <div className={iconBox} title={`Perfil: ${arquetipo.titulo}`}>
          <UserRound className="w-4 h-4" />
        </div>
        <div className={iconBox} title={`Financiamiento: ${financiamiento.titulo}`}>
          <Landmark className="w-4 h-4" />
        </div>
        <div className={`${iconBox} relative`} title={`${activeTags.length} efectos pasivos activos`}>
          <Layers className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#0052CC] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
            {activeTags.length}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 space-y-3.5 shadow-sm transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-indigo-950/70 border border-blue-200 dark:border-indigo-800/60 flex items-center justify-center text-[#0052CC] dark:text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Mi empresa
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              ADN y rasgos pasivos
            </p>
          </div>
        </div>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Colapsar Mi empresa"
            aria-label="Colapsar panel Mi empresa"
            aria-expanded={true}
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#0052CC] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Perfil y Financiamiento */}
      <div className="grid grid-cols-1 gap-2 text-left">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 space-y-0.5">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
            Perfil de Fundador
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            {arquetipo.titulo}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/70 space-y-0.5">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
            Financiamiento
          </span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            {financiamiento.titulo}
          </p>
        </div>
      </div>

      {/* Rasgos y Tags Activos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            Efectos pasivos ({activeTags.length})
          </span>
          {activeTags.length > 0 && (
            <span className="text-[#0052CC] dark:text-blue-400 font-semibold normal-case tracking-normal">Cada turno</span>
          )}
        </div>

        {activeTags.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic py-1">
            No acumulaste rasgos pasivos aún. Se desbloquearán según tus elecciones.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeTags.map((tag) => {
              const tagConfig = TAGS[tag];
              if (!tagConfig) return null;

              const mods = (tagConfig.modifiers ?? {}) as Partial<Metrics>;
              const hasMod = mods && (mods.capital || mods.bienestar || mods.reputacion);

              const isHarmful =
                (mods.capital ?? 0) < 0 ||
                (mods.bienestar ?? 0) < 0 ||
                (mods.reputacion ?? 0) < 0;

              return (
                <div
                  key={tag}
                  title={
                    hasMod
                      ? `Modificador por turno: ${mods.capital ? `Cap: ${mods.capital} ` : ''}${mods.bienestar ? `Bien: ${mods.bienestar} ` : ''}${mods.reputacion ? `Rep: ${mods.reputacion} ` : ''}`
                      : 'Rasgo de identidad empresarial'
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                    isHarmful
                      ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300'
                      : hasMod
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-950/60 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  <TagIcon className="w-2.5 h-2.5 opacity-70" />
                  <span>{tagConfig.label}</span>
                  {hasMod && (
                    <span className="text-[10px] opacity-80 font-bold ml-0.5">
                      {mods.capital ? `${mods.capital > 0 ? '+' : ''}${mods.capital} Cap ` : ''}
                      {mods.bienestar ? `${mods.bienestar > 0 ? '+' : ''}${mods.bienestar} Bien ` : ''}
                      {mods.reputacion ? `${mods.reputacion > 0 ? '+' : ''}${mods.reputacion} Rep ` : ''}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
