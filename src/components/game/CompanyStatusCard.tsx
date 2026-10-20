import { useState } from 'react';
import type { Archetype, Financing, Metrics } from '../../types/game';
import { TAGS, type Tag } from '../../data/tags';
import { Building2, ChevronDown, ChevronUp, Layers, Tag as TagIcon } from 'lucide-react';

interface CompanyStatusCardProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  activeTags: Tag[];
}

export default function CompanyStatusCard({
  arquetipo,
  financiamiento,
  activeTags,
}: CompanyStatusCardProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-indigo-950/70 border border-blue-200 dark:border-indigo-800/60 flex items-center justify-center text-[#0052CC] dark:text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
              Estado de la Empresa
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              ADN estratégico y rasgos pasivos activos
            </p>
          </div>
        </div>

        {/* Toggle para móviles */}
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="lg:hidden flex items-center gap-1 text-[11px] font-semibold text-[#0052CC] dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <span>{activeTags.length} rasgos</span>
          {isOpenMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Perfil y Financiamiento */}
      <div className="grid grid-cols-2 gap-2 text-left">
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

      {/* Rasgos y Tags Activos (siempre visible en desktop, colapsable en mobile) */}
      <div className={`space-y-2 ${isOpenMobile ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            Efectos Pasivos en Operación ({activeTags.length}):
          </span>
          {activeTags.length > 0 && (
            <span className="text-[#0052CC] dark:text-blue-400 font-semibold">Impactan cada turno</span>
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
