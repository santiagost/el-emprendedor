import { DollarSign, Award, Heart, RotateCcw, Building2 } from 'lucide-react';
import type { Archetype, Financing, Metrics } from '../../types/game';
import type { Theme } from '../../hooks/useTheme';
import type { HudDeltas } from '../../hooks/useOutcomeReveal';
import type { StageTone } from '../../game/stage';
import { PHASES, type PhaseId } from '../../game/phases';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import EffectsToggle from '../common/EffectsToggle';
import SoundToggle from '../common/SoundToggle';
import MetricCard from './MetricCard';
import TimelineBar from './TimelineBar';

interface GameHeaderProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  currentTurn: number;
  maxTurns: number;
  phaseId: PhaseId;
  /** Fase recién cerrada mientras se muestra su resumen (B1). */
  recapPhaseId?: PhaseId;
  /** Tono de la interrupción en escena: el HUD se tiñe mientras dura (A1). */
  stageTone?: StageTone;
  metrics: Metrics;
  deltas: HudDeltas;
  isCalculating: boolean;
  theme: Theme;
  onToggleTheme: () => void;
  fxEnabled: boolean;
  onToggleFx: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCompany: () => void;
  onExit: () => void;
}

/** Encabezado fijo de la partida: turno y fase, herramientas, línea de turnos y métricas vitales. */
export default function GameHeader({
  arquetipo,
  financiamiento,
  currentTurn,
  maxTurns,
  phaseId,
  recapPhaseId,
  stageTone,
  metrics,
  deltas,
  isCalculating,
  theme,
  onToggleTheme,
  fxEnabled,
  onToggleFx,
  soundEnabled,
  onToggleSound,
  onOpenCompany,
  onExit,
}: GameHeaderProps) {
  const currentPhase = PHASES.find((p) => p.id === phaseId) ?? PHASES[0];

  return (
    <header className={`stage-hud ${stageTone ? `is-${stageTone}` : ''} sticky top-0 z-30 bg-brand-canvas/90 dark:bg-night-canvas/90 backdrop-blur-md pt-2 sm:pt-3 pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-800/80 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors shadow-sm space-y-2 sm:space-y-3`}>
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {recapPhaseId ? (
            <span className="uppercase tracking-widest text-amber-600 dark:text-amber-300 font-bold text-2xs sm:text-xs">
              Fase {recapPhaseId} completada
            </span>
          ) : (
            <>
              <span className="text-slate-800 dark:text-slate-200 font-bold tracking-wide">
                TURNO {currentTurn} / {maxTurns}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="uppercase tracking-widest text-brand-cobalt dark:text-indigo-400 font-bold text-2xs sm:text-xs">
                Fase {phaseId}<span className="hidden sm:inline">: {currentPhase.label}</span>
              </span>
            </>
          )}
          <span className="hidden md:inline-block text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden md:inline-block text-slate-600 dark:text-slate-400 font-normal">
            {arquetipo.titulo} • {financiamiento.titulo}
          </span>
        </div>

        {/* Botones de acción del header: Mi empresa (pantallas chicas), sonido, efectos, tema y Reiniciar */}
        <div className="flex items-center gap-2">
          <Button
            variant="toolbar"
            onClick={onOpenCompany}
            title="Mi empresa"
            aria-label="Abrir panel Mi empresa"
            className="lg:hidden"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden min-[420px]:inline">Mi empresa</span>
          </Button>
          <SoundToggle soundEnabled={soundEnabled} onToggle={onToggleSound} />
          <EffectsToggle fxEnabled={fxEnabled} onToggle={onToggleFx} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Button
            variant="toolbar"
            onClick={onExit}
            title="Cambiar estrategia / Volver al inicio"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
        </div>
      </div>

      {/* Línea de tiempo visual de 15 turnos */}
      <TimelineBar currentTurn={currentTurn} maxTurns={maxTurns} milestonePhaseId={recapPhaseId} />

      {/* Panel de Métricas Vitales (con dorado al 100%, pulso y deltas flotantes) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:pt-1">
        <MetricCard
          label="Capital"
          value={metrics.capital}
          icon={DollarSign}
          variant="capital"
          delta={deltas.capital}
          deltaKey={deltas.key}
          delayMs={0}
          isCalculating={isCalculating}
        />
        <MetricCard
          label="Reputación"
          value={metrics.reputacion}
          icon={Award}
          variant="reputacion"
          delta={deltas.reputacion}
          deltaKey={deltas.key}
          delayMs={150}
          isCalculating={isCalculating}
        />
        <MetricCard
          label="Bienestar"
          value={metrics.bienestar}
          icon={Heart}
          variant="bienestar"
          delta={deltas.bienestar}
          deltaKey={deltas.key}
          delayMs={300}
          isCalculating={isCalculating}
        />
      </div>
    </header>
  );
}
