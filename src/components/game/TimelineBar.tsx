import { PHASES } from '../../game/phases';

interface TimelineBarProps {
  currentTurn: number;
  maxTurns: number;
}

export default function TimelineBar({ currentTurn, maxTurns }: TimelineBarProps) {
  return (
    <div className="w-full space-y-1 sm:space-y-1.5 py-0.5 sm:py-1">
      {/* 15 barras / segmentos de turno */}
      <div className="flex gap-1 sm:gap-1.5 w-full items-center">
        {Array.from({ length: maxTurns }).map((_, index) => {
          const turn = index + 1;
          const isCompleted = turn < currentTurn;
          const isCurrent = turn === currentTurn;

          let barStyle = 'bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700/60';
          if (isCompleted) {
            barStyle = 'bg-[#0052CC] border-[#0052CC] dark:bg-blue-600 dark:border-blue-500';
          } else if (isCurrent) {
            barStyle = 'bg-amber-400 border-amber-400 ring-2 ring-amber-400/50 animate-pulse';
          }

          return (
            <div
              key={turn}
              title={`Turno ${turn}`}
              className={`h-1.5 sm:h-2 flex-1 rounded-full border transition-all duration-300 ${barStyle}`}
            />
          );
        })}
      </div>

      {/* Rótulos de fases simplificados */}
      <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-400 font-medium px-0.5">
        {PHASES.map((phase) => {
          const isPhaseActive = currentTurn >= phase.fromTurn && currentTurn <= phase.toTurn;
          const isPhaseCompleted = currentTurn > phase.toTurn;

          let phaseTextColor = 'text-slate-400 dark:text-slate-500';
          if (isPhaseActive) {
            phaseTextColor = 'text-[#0052CC] dark:text-blue-400 font-bold';
          } else if (isPhaseCompleted) {
            phaseTextColor = 'text-slate-600 dark:text-slate-400';
          }

          return (
            <span key={phase.id} className={phaseTextColor}>
              F{phase.id}<span className="hidden sm:inline">: {phase.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
