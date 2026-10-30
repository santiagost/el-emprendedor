import { DollarSign, Award, Heart, RotateCcw, Building2, Ellipsis, Flag } from 'lucide-react';
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
  /** Abre el menú de partida (solo móvil): sonido, efectos, tema y Reiniciar. */
  onOpenMenu: () => void;
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
  onOpenMenu,
  onExit,
}: GameHeaderProps) {
  const currentPhase = PHASES.find((p) => p.id === phaseId) ?? PHASES[0];

  return (
    <header className={`stage-hud ${stageTone ? `is-${stageTone}` : ''} sticky top-0 z-30 bg-brand-canvas/90 dark:bg-night-canvas/90 backdrop-blur-md pt-2 sm:pt-3 pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-800/80 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors space-y-2 sm:space-y-3`}>
      {/* Marca fija arriba a la izquierda, para saber siempre dónde estamos; a la derecha, las herramientas */}
      <div className="flex justify-between items-center">
        <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
          El Emprendedor
        </span>

        {/* Botones de acción del header. Móvil: Mi empresa y menú. Desde sm: Mi empresa (hasta lg), sonido, efectos, tema y Reiniciar */}
        <div className="flex items-center gap-2">
          <Button
            variant="toolbar"
            onClick={onOpenCompany}
            title="Mi empresa"
            aria-label="Abrir panel Mi empresa"
            className="lg:hidden min-h-11 min-w-11 sm:min-h-0 sm:min-w-0"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden min-[420px]:inline">Mi empresa</span>
          </Button>
          <Button
            variant="toolbar"
            onClick={onOpenMenu}
            title="Opciones de partida"
            aria-label="Opciones de partida"
            className="sm:hidden min-h-11 min-w-11"
          >
            <Ellipsis className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Button>
          <div className="hidden sm:flex items-center gap-2">
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
      </div>

      {/* Turno, fase y perfil */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-semibold text-slate-500 dark:text-slate-400">
        {recapPhaseId ? (
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-sm">
            <Flag className="w-4 h-4" aria-hidden="true" /> Fase {recapPhaseId} de {PHASES.length} superada
          </span>
        ) : (
          <>
            <span className="text-slate-800 dark:text-slate-200 font-bold tracking-wide">
              AÑO {currentTurn} / {maxTurns}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="uppercase tracking-widest text-brand-cobalt dark:text-indigo-400 font-bold text-xs">
              Fase {phaseId}<span className="hidden sm:inline">: {currentPhase.label}</span>
            </span>
          </>
        )}
        <span className="hidden md:inline-block text-slate-300 dark:text-slate-700">•</span>
        <span className="hidden md:inline-block text-slate-600 dark:text-slate-400 font-normal">
          {arquetipo.titulo} • {financiamiento.titulo}
        </span>
      </div>

      {/* Línea de tiempo visual de 15 turnos */}
      <TimelineBar currentTurn={currentTurn} maxTurns={maxTurns} milestonePhaseId={recapPhaseId} />

      {/* Métricas vitales (dorado al 100%, pulso y deltas flotantes). En escritorio van en el tablero lateral (B2); en el fin de fase no se muestran: el resumen ya las trae (B3) */}
      {!recapPhaseId && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:pt-1 lg:hidden">
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
      )}
    </header>
  );
}
