import { phasesFor } from '../../game/phases';

interface TimelineBarProps {
  currentTurn: number;
  maxTurns: number;
  /** Fase recién cerrada (hito): sus segmentos brillan y el turno siguiente espera sin pulsar. */
  milestonePhaseId?: number;
}

export default function TimelineBar({ currentTurn, maxTurns, milestonePhaseId }: TimelineBarProps) {
  const phases = phasesFor(maxTurns);
  const milestone = phases.find((p) => p.id === milestonePhaseId);

  return (
    <div className="w-full flex gap-2 sm:gap-3 py-0.5 sm:py-1">
      {/* Turnos agrupados por fase (3 · 3 · 4 · 5 en la partida completa): cada bloque muestra cuánto falta para el próximo resumen */}
      {phases.map((phase) => {
        const isPhaseActive = !milestone && currentTurn >= phase.fromTurn && currentTurn <= phase.toTurn;
        const isPhaseCompleted = currentTurn > phase.toTurn;
        const turnsInPhase = phase.toTurn - phase.fromTurn + 1;

        let phaseTextColor = 'text-slate-500 dark:text-slate-400';
        if (phase.id === milestone?.id) {
          phaseTextColor = 'text-amber-600 dark:text-amber-300 font-bold';
        } else if (isPhaseActive) {
          phaseTextColor = 'text-brand-cobalt dark:text-blue-400 font-bold';
        } else if (isPhaseCompleted) {
          phaseTextColor = 'text-slate-600 dark:text-slate-300';
        }

        return (
          <div key={phase.id} className="min-w-0 space-y-1 sm:space-y-1.5" style={{ flex: turnsInPhase }}>
            <div className="flex gap-1 w-full items-center">
              {Array.from({ length: turnsInPhase }).map((_, index) => {
                const turn = phase.fromTurn + index;
                const isCompleted = turn < currentTurn;
                const isCurrent = turn === currentTurn;
                const inMilestone = phase.id === milestone?.id;

                let barStyle = 'bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700/60';
                if (inMilestone) {
                  barStyle = 'phase-milestone bg-amber-400 border-amber-300 dark:bg-amber-400 dark:border-amber-300';
                } else if (isCompleted) {
                  barStyle = 'bg-brand-cobalt border-brand-cobalt dark:bg-blue-600 dark:border-blue-500';
                } else if (isCurrent && !milestone) {
                  barStyle = 'bg-amber-400 border-amber-400 ring-2 ring-amber-400/50 animate-pulse';
                }

                return (
                  <div
                    key={turn}
                    title={`Mes ${turn} de ${maxTurns}`}
                    style={inMilestone ? ({ '--i': index } as React.CSSProperties) : undefined}
                    className={`h-1.5 sm:h-2 flex-1 rounded-full border transition-all duration-300 ${barStyle}`}
                  />
                );
              })}
            </div>
            <p className={`truncate text-xs font-medium ${phaseTextColor}`}>
              <span className="sm:hidden">{phase.label.split(' & ')[0]}</span>
              <span className="hidden sm:inline">{phase.label}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
