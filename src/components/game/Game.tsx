import { useState, useEffect } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useTheme } from '../../hooks/useTheme';
import type { Archetype, Financing } from '../../types/game';
import { DollarSign, Award, Heart, ArrowRight, RotateCcw, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import ImpactBadges from './ImpactBadges';
import EndGameReport from './EndGameReport';
import MetricCard from './MetricCard';
import TimelineBar from './TimelineBar';
import CompanyStatusCard from './CompanyStatusCard';
import IncomingAlertModal from './IncomingAlertModal';
import ThemeToggle from '../common/ThemeToggle';
import { PHASES } from '../../game/phases';

interface GameProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  onResetToSetup?: () => void;
}

const renderDeltaBadge = (value: number | undefined, label: string, color: string) => {
  if (value === undefined || value === 0) return null;
  const isPositive = value > 0;
  const sign = isPositive ? '+' : '';
  const textColor = isPositive ? color : 'text-rose-600 dark:text-rose-400';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 ${textColor} border border-slate-200 dark:border-slate-700/60`}>
      {sign}{value} {label}
    </span>
  );
};

export default function Game({ arquetipo, financiamiento, onResetToSetup }: GameProps) {
  const { theme, toggleTheme } = useTheme();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [seenAlertForEventId, setSeenAlertForEventId] = useState<string | null>(null);

  const {
    gameState,
    currentEvent,
    step,
    decide,
    advance,
    restartGame,
  } = useGameEngine(arquetipo, financiamiento);

  const {
    metrics,
    status,
    currentTurn,
    maxTurns,
    lastPill,
    lastDecision,
    phaseId,
  } = gameState;

  const currentPhase = PHASES.find((p) => p.id === phaseId) ?? PHASES[0];

  // Chequeo de alerta animada para interrupciones (Crisis o Imprevistos)
  const isInterruption = currentEvent?.kind === 'crisis' || currentEvent?.kind === 'unforeseen';
  const showIncomingAlert = Boolean(
    isInterruption &&
    currentEvent &&
    step === 'decision' &&
    seenAlertForEventId !== currentEvent.id
  );

  // Atajos de teclado en Desktop (1, 2, 3 para elegir opción; Espacio/Enter para avanzar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitConfirm || showIncomingAlert) return;

      if (step === 'decision' && currentEvent && status === 'playing') {
        if (e.key === '1' && currentEvent.options[0]) {
          decide(0, currentTurn);
        } else if (e.key === '2' && currentEvent.options[1]) {
          decide(1, currentTurn);
        } else if (e.key === '3' && currentEvent.options[2]) {
          decide(2, currentTurn);
        }
      } else if (step === 'outcome') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          advance();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentEvent, status, currentTurn, showExitConfirm, showIncomingAlert, decide, advance]);

  // Si la partida terminó y estamos en el paso final
  if (step === 'ended') {
    return (
      <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-start">
        <EndGameReport
          gameState={gameState}
          arquetipo={arquetipo}
          financiamiento={financiamiento}
          onRestart={() => {
            setSeenAlertForEventId(null);
            restartGame();
          }}
          onResetToSetup={onResetToSetup ?? restartGame}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </main>
    );
  }

  const isGameOverOrVictory = status !== 'playing';

  return (
    <main className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col min-h-screen justify-between relative">
      {/* Alerta de animación entrante previa a la decisión (Punto Crisis / Imprevisto) */}
      {showIncomingAlert && currentEvent && (
        <IncomingAlertModal
          event={currentEvent}
          onDismiss={() => setSeenAlertForEventId(currentEvent.id)}
        />
      )}

      {/* Header Fijo con Blur (Sticky Top si hay scroll) */}
      <header className="sticky top-0 z-30 bg-[#F4F7FB]/90 dark:bg-[#071322]/90 backdrop-blur-md pt-3 pb-3 border-b border-slate-200 dark:border-slate-800/80 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-slate-800 dark:text-slate-200 font-bold tracking-wide">
              TURNO {currentTurn} / {maxTurns}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="uppercase tracking-widest text-[#0052CC] dark:text-indigo-400 font-bold text-[11px] sm:text-xs">
              Fase {phaseId}: {currentPhase.label}
            </span>
            <span className="hidden md:inline-block text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden md:inline-block text-slate-600 dark:text-slate-400 font-normal">
              {arquetipo.titulo} • {financiamiento.titulo}
            </span>
          </div>

          {/* Botones de acción del header: ThemeToggle y Reiniciar */}
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              title="Cambiar estrategia / Volver al inicio"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-[11px] font-medium shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Línea de tiempo visual de 15 turnos */}
        <TimelineBar currentTurn={currentTurn} maxTurns={maxTurns} />

        {/* Panel de Métricas Vitales (con dorado al 100% y titileo al peligro <= 25%) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
          <MetricCard
            label="Capital"
            value={metrics.capital}
            icon={DollarSign}
            variant="capital"
          />
          <MetricCard
            label="Reputación"
            value={metrics.reputacion}
            icon={Award}
            variant="reputacion"
          />
          <MetricCard
            label="Bienestar"
            value={metrics.bienestar}
            icon={Heart}
            variant="bienestar"
          />
        </div>
      </header>

      {/* Contenido Principal Adaptable a Desktop (Grid de 2 Columnas en lg:) */}
      <div className="w-full my-auto py-6 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        {/* Columna Izquierda: Tarjeta del Dilema + Estado de la Empresa */}
        <div className="lg:col-span-7 space-y-5">
          {currentEvent && (
            <div className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 rounded-2xl shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors">
              <div>
                {/* Header del tipo de evento */}
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  {currentEvent.kind === 'crisis' ? (
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/70 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" /> Crisis Operativa • Turno {currentTurn}
                    </span>
                  ) : currentEvent.kind === 'unforeseen' ? (
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/70 animate-pulse">
                      <Zap className="w-3.5 h-3.5" /> Suceso Imprevisto • Turno {currentTurn}
                    </span>
                  ) : (
                    <span className="text-[#0052CC] dark:text-indigo-400 font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-indigo-950/50 border border-blue-200 dark:border-indigo-800/50">
                      Dilema del Turno {currentTurn}
                    </span>
                  )}

                  {step === 'outcome' && (
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Decisión Registrada
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2.5 leading-snug">
                  {currentEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentEvent.description}
                </p>
              </div>

              {/* Panel de Resultado (D2) */}
              {step === 'outcome' && (
                <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200">
                  {/* Opción seleccionada */}
                  {lastDecision && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                        Elegiste:{' '}
                        <span className="text-slate-900 dark:text-slate-100 normal-case font-medium">
                          "{lastDecision.optionText}"
                        </span>
                      </p>

                      {/* Deltas de la decisión */}
                      <div className="flex flex-wrap gap-1.5">
                        {renderDeltaBadge(lastDecision.effects.capital, 'Capital', 'text-emerald-600 dark:text-emerald-400')}
                        {renderDeltaBadge(lastDecision.effects.reputacion, 'Reputación', 'text-[#0052CC] dark:text-blue-400')}
                        {renderDeltaBadge(lastDecision.effects.bienestar, 'Bienestar', 'text-amber-600 dark:text-amber-400')}
                      </div>
                    </div>
                  )}

                  {/* Texto de consecuencia narrativa personalizada */}
                  {lastDecision?.outcomeText && (
                    <div className="p-3.5 bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/70 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Consecuencia: </span>
                      {lastDecision.outcomeText}
                    </div>
                  )}

                  {/* Micro-píldora didáctica */}
                  {lastPill && (
                    <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 rounded-xl">
                      <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-normal">
                        💡 <span className="font-semibold text-indigo-700 dark:text-indigo-300">Concepto clave:</span> {lastPill}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tarjeta de Estado de Empresa y Rasgos Pasivos (llena espacio en desktop) */}
          <CompanyStatusCard
            arquetipo={arquetipo}
            financiamiento={financiamiento}
            activeTags={gameState.activeTags}
          />
        </div>

        {/* Columna Derecha: Alternativas de Decisión o Botón Siguiente */}
        <div className="lg:col-span-5 space-y-4 pt-4 lg:pt-0">
          {/* Opciones de Decisión (Paso: decision) */}
          {status === 'playing' && currentEvent && step === 'decision' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Alternativas Disponibles:
                </p>
                <span className="hidden sm:inline-block text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Atajos: [1], [2], [3]
                </span>
              </div>

              {currentEvent.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => decide(idx, currentTurn)}
                  className="w-full text-left p-4 bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#0E243A] dark:hover:bg-[#14304D] dark:active:bg-[#18395B] border border-slate-200 dark:border-slate-700/70 hover:border-[#0052CC]/50 dark:hover:border-indigo-500/60 rounded-xl transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2.5 group shadow-sm hover:shadow-[#0052CC]/10 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/50"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-400 group-hover:bg-[#0052CC] dark:group-hover:bg-indigo-600 group-hover:text-white group-hover:border-[#0052CC] dark:group-hover:border-indigo-500 transition-colors">
                      {idx + 1}
                    </span>
                    <div className="leading-snug text-slate-800 dark:text-slate-200 group-hover:text-[#0A2540] dark:group-hover:text-white flex-1 font-medium">
                      {option.text}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                      Tendencia esperada:
                    </span>
                    <ImpactBadges impactPreview={option.impactPreview} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Panel de Outcome / Botón Siguiente (Paso: outcome) */}
          {step === 'outcome' && (
            <div className="space-y-3">
              <div className="p-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-xl text-left space-y-2 shadow-sm">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                  Decisión procesada con éxito.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Las consecuencias sobre el capital, reputación y bienestar ya fueron calculadas. Presioná para continuar tu camino emprendedor.
                </p>
              </div>

              <button
                type="button"
                onClick={advance}
                className="w-full py-4 px-4 bg-[#0A2540] hover:bg-[#0052CC] active:bg-[#081c30] dark:bg-[#0052CC] dark:hover:bg-[#0047b3] text-white font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0052CC]/25 group"
              >
                <span>
                  {isGameOverOrVictory
                    ? 'Ver Desenlace Final'
                    : isInterruption
                    ? 'Continuar al Siguiente Turno'
                    : 'Siguiente Turno'}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
                Presioná <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Espacio</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Enter</kbd> para avanzar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para salir o reiniciar (Punto 6) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                ¿Abandonar partida actual?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Se perderá el progreso de esta trayectoria y volverás a la pantalla de configuración para elegir perfil y financiamiento.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Seguir jugando
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  setSeenAlertForEventId(null);
                  if (onResetToSetup) {
                    onResetToSetup();
                  } else {
                    restartGame();
                  }
                }}
                className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md shadow-rose-600/20"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
