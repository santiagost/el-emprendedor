import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useTheme } from '../../hooks/useTheme';
import { useSequence } from '../../hooks/useSequence';
import { useStoredFlag } from '../../hooks/useStoredFlag';
import type { Archetype, DecisionLogEntry, Financing, Metrics } from '../../types/game';
import { DollarSign, Award, Heart, ArrowRight, RotateCcw, AlertTriangle, Zap, CheckCircle2, Building2, X } from 'lucide-react';
import ImpactBadges from './ImpactBadges';
import EndGameReport from './EndGameReport';
import PhaseRecap from './PhaseRecap';
import MetricCard from './MetricCard';
import TimelineBar from './TimelineBar';
import CompanyStatusCard from './CompanyStatusCard';
import IncomingAlertModal from './IncomingAlertModal';
import ThemeToggle from '../common/ThemeToggle';
import EffectsToggle from '../common/EffectsToggle';
import { useEffectsToggle, useReducedMotion } from '../../lib/motion';
import { PHASES, type PhaseId } from '../../game/phases';
import { buildPhaseRecap } from '../../game/recap';
import { computeMetricDeltas, getRevealingDuration, netDecisionEffect, stressLevel } from '../../game/ui';
import { confetti } from '../../lib/fx';
import { localizeEvent, personalize } from '../../lib/personalize';
import type { SequenceStep } from '../../hooks/useSequence';

// Fuera del componente: una referencia estable evita reiniciar los timers de useSequence
const OUTCOME_STEPS: SequenceStep[] = [
  { at: 0 },    // Paso ①: Selección y deltas
  { at: 700 },  // Paso ②: Consecuencia narrativa
  { at: 1500 }, // Paso ③: Concepto clave
];

const METRIC_KEYS: (keyof Metrics)[] = ['capital', 'reputacion', 'bienestar'];

const decisionIdOf = (entry: DecisionLogEntry) => `${entry.turn}-${entry.eventId}-${entry.optionIndex}`;

interface GameProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  /** Nombre elegido en Setup; en una partida retomada se usa el guardado en la sesión. */
  playerName?: string;
  onResetToSetup?: (currentName?: string) => void;
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

export default function Game({ arquetipo, financiamiento, playerName, onResetToSetup }: GameProps) {
  const { theme, toggleTheme } = useTheme();
  const { fxEnabled, toggleFx } = useEffectsToggle();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [seenAlertForEventId, setSeenAlertForEventId] = useState<string | null>(null);
  // A7: panel lateral "Mi empresa" (colapsable en escritorio, drawer en pantallas chicas)
  const [companyCollapsed, setCompanyCollapsed] = useStoredFlag('el_emprendedor_company_panel_collapsed', false);
  const [showCompanyDrawer, setShowCompanyDrawer] = useState(false);

  const {
    gameState,
    currentEvent,
    step,
    decide,
    advance,
    continueFromRecap,
    restartGame,
  } = useGameEngine(arquetipo, financiamiento, playerName);

  const {
    metrics,
    status,
    currentTurn,
    maxTurns,
    lastPill,
    lastDecision,
    phaseId,
  } = gameState;

  // Estado de suspenso UI antes de revelar el impacto (A4)
  const isReducedMotion = useReducedMotion();
  const [isRevealing, setIsRevealing] = useState(false);
  // Métricas previas a la decisión: el HUD las muestra mientras dura el suspenso
  const [heldMetrics, setHeldMetrics] = useState<Metrics | null>(null);
  const revealingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayMetrics = heldMetrics ?? metrics;

  // Seguimiento de deltas reales para animaciones de métricas.
  // Se calculan recién cuando termina el suspenso, para no revelar el impacto antes de tiempo.
  const prevMetricsRef = useRef(metrics);
  const deltasPendingRef = useRef(false);
  // Hitos de confeti: una vez por métrica y por partida (las que ya arrancan en 100 no cuentan)
  const celebratedMetricsRef = useRef<Set<keyof Metrics>>(
    new Set(METRIC_KEYS.filter((k) => metrics[k] >= 100))
  );
  const [metricDeltas, setMetricDeltas] = useState<{
    capital?: number;
    reputacion?: number;
    bienestar?: number;
    key: number;
    decisionId?: string;
  }>({ key: 0 });

  useEffect(() => {
    if (step === 'decision') {
      prevMetricsRef.current = metrics;
      deltasPendingRef.current = true;
      return;
    }

    if (step === 'outcome' && !isRevealing && deltasPendingRef.current) {
      deltasPendingRef.current = false;
      const prev = prevMetricsRef.current;
      const deltas = computeMetricDeltas(prev, metrics);

      setMetricDeltas((current) => ({
        ...deltas,
        key: current.key + 1,
        decisionId: lastDecision ? decisionIdOf(lastDecision) : undefined,
      }));
      prevMetricsRef.current = metrics;

      // A6: confeti dorado cuando una métrica llega a 100 por primera vez en la partida
      const reachedMax = METRIC_KEYS.filter(
        (k) => metrics[k] >= 100 && prev[k] < 100 && !celebratedMetricsRef.current.has(k)
      );
      if (reachedMax.length > 0) {
        reachedMax.forEach((k) => celebratedMetricsRef.current.add(k));
        confetti('gold');
      }
    }
  }, [step, metrics, isRevealing, lastDecision]);

  const handleDecide = useCallback(
    (optionIndex: number, turn: number) => {
      if (isRevealing || step !== 'decision') return;

      const duration = getRevealingDuration(currentEvent?.kind, isReducedMotion);
      if (duration > 0) {
        setHeldMetrics(metrics);
        setIsRevealing(true);
      }

      // Ejecutar de inmediato en el engine para persistir en localStorage
      decide(optionIndex, turn);

      // Si reduced motion está activo, no hay suspenso (duración 0)
      if (duration <= 0) {
        return;
      }

      revealingTimerRef.current = setTimeout(() => {
        setHeldMetrics(null);
        setIsRevealing(false);
      }, duration);
    },
    [isRevealing, step, decide, currentEvent?.kind, isReducedMotion, metrics]
  );

  const handleRestartGame = () => {
    if (revealingTimerRef.current) {
      clearTimeout(revealingTimerRef.current);
    }
    setIsRevealing(false);
    setHeldMetrics(null);
    setSeenAlertForEventId(null);
    setMetricDeltas({ key: 0 });
    celebratedMetricsRef.current = new Set();
    restartGame();
  };

  useEffect(() => {
    return () => {
      if (revealingTimerRef.current) {
        clearTimeout(revealingTimerRef.current);
      }
    };
  }, []);

  // B1: los textos con {nombre} se resuelven en el render; el motor guarda los textos crudos
  const displayName = gameState.playerName;
  const displayEvent = useMemo(
    () => (currentEvent ? localizeEvent(currentEvent, displayName) : null),
    [currentEvent, displayName]
  );

  // B2: resumen de la fase que acaba de cerrarse (el estado ya avanzó a la siguiente)
  const [initialWasRecap] = useState(() => step === 'phase_recap');
  const phaseRecap = useMemo(
    () => (step === 'phase_recap' ? buildPhaseRecap(gameState, (phaseId - 1) as PhaseId, displayName) : null),
    [step, gameState, phaseId, displayName]
  );

  const currentPhase = PHASES.find((p) => p.id === phaseId) ?? PHASES[0];

  // A6: confeti al pasar a una fase nueva (no al montar ni al reiniciar)
  const prevPhaseRef = useRef(phaseId);
  useEffect(() => {
    if (phaseId > prevPhaseRef.current) {
      confetti('default');
    }
    prevPhaseRef.current = phaseId;
  }, [phaseId]);

  // A6: confeti de victoria al llegar al desenlace final
  const celebratedVictoryRef = useRef(false);
  useEffect(() => {
    if (step === 'ended' && status === 'victory' && !celebratedVictoryRef.current) {
      celebratedVictoryRef.current = true;
      confetti('victory');
    } else if (step !== 'ended') {
      celebratedVictoryRef.current = false;
    }
  }, [step, status]);

  // A5: tinte tonal según el estrés de las métricas visibles
  const stress = stressLevel(displayMetrics);
  const isCalm = stress === 0;
  const isLowWellbeing = displayMetrics.bienestar < 30;

  // Deltas que muestra el panel "Elegiste": los mismos que el HUD (reales, con modificadores).
  // Si no hay delta medido (recarga en pleno outcome), se usa el efecto neto del log.
  const decisionDeltas = !lastDecision
    ? {}
    : metricDeltas.decisionId === decisionIdOf(lastDecision)
    ? metricDeltas
    : netDecisionEffect(lastDecision);

  // Orquestador de la secuencia de capas en outcome (A3)
  const [initialWasOutcome] = useState(() => step === 'outcome');
  const outcomeSequenceKey = isRevealing
    ? 'revealing'
    : lastDecision
    ? `${currentTurn}-${lastDecision.eventId}-${lastDecision.optionIndex}`
    : `turn-${currentTurn}`;

  const outcomeSequence = useSequence(
    OUTCOME_STEPS,
    {
      key: outcomeSequenceKey,
      initialCompleted: initialWasOutcome,
    }
  );

  // Chequeo de alerta animada para interrupciones (Crisis o Imprevistos)
  const isInterruption = currentEvent?.kind === 'crisis' || currentEvent?.kind === 'unforeseen';
  const showIncomingAlert = Boolean(
    isInterruption &&
    currentEvent &&
    step === 'decision' &&
    seenAlertForEventId !== currentEvent.id
  );

  useEffect(() => {
    if (!showCompanyDrawer) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCompanyDrawer(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [showCompanyDrawer]);

  // Atajos de teclado en Desktop (1, 2, 3 para elegir opción; Espacio/Enter para avanzar o saltar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitConfirm || showCompanyDrawer || showIncomingAlert || isRevealing) return;

      if (step === 'decision' && currentEvent && status === 'playing') {
        if (e.key === '1' && currentEvent.options[0]) {
          handleDecide(0, currentTurn);
        } else if (e.key === '2' && currentEvent.options[1]) {
          handleDecide(1, currentTurn);
        } else if (e.key === '3' && currentEvent.options[2]) {
          handleDecide(2, currentTurn);
        }
      } else if (step === 'outcome') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!outcomeSequence.isCompleted) {
            outcomeSequence.skipToEnd();
          } else {
            advance();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentEvent, status, currentTurn, showExitConfirm, showCompanyDrawer, showIncomingAlert, advance, outcomeSequence, isRevealing, handleDecide]);

  if (step === 'phase_recap' && phaseRecap) {
    return <PhaseRecap recap={phaseRecap} initialCompleted={initialWasRecap} onContinue={continueFromRecap} />;
  }

  // Si la partida terminó y estamos en el paso final
  if (step === 'ended') {
    return (
      <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col min-h-screen justify-start">
        <EndGameReport
          gameState={gameState}
          arquetipo={arquetipo}
          financiamiento={financiamiento}
          onRestart={handleRestartGame}
          onResetToSetup={() => (onResetToSetup ? onResetToSetup(displayName) : handleRestartGame())}
          theme={theme}
          onToggleTheme={toggleTheme}
          fxEnabled={fxEnabled}
          onToggleFx={toggleFx}
        />
      </main>
    );
  }

  const isGameOverOrVictory = status !== 'playing';

  return (
    <main
      className="w-full max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col min-h-screen justify-between relative"
      style={{ '--stress': stress } as React.CSSProperties}
    >
      {/* Atmósfera tonal por estrés (A5): tinte + viñeta, o resplandor cálido si todo está sano */}
      <div aria-hidden="true" className="stress-layer stress-tint" />
      <div aria-hidden="true" className="stress-layer stress-vignette" />
      <div aria-hidden="true" className={`stress-layer calm-glow ${isCalm ? 'is-on' : ''}`} />

      {/* Alerta de animación entrante previa a la decisión (Punto Crisis / Imprevisto) */}
      {showIncomingAlert && currentEvent && displayEvent && (
        <IncomingAlertModal
          event={displayEvent}
          onDismiss={() => setSeenAlertForEventId(currentEvent.id)}
        />
      )}

      {/* Header Fijo con Blur (Sticky Top si hay scroll) */}
      <header className="sticky top-0 z-30 bg-[#F4F7FB]/90 dark:bg-[#071322]/90 backdrop-blur-md pt-2 sm:pt-3 pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-800/80 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-colors shadow-sm space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-slate-800 dark:text-slate-200 font-bold tracking-wide">
              TURNO {currentTurn} / {maxTurns}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="uppercase tracking-widest text-[#0052CC] dark:text-indigo-400 font-bold text-[11px] sm:text-xs">
              Fase {phaseId}<span className="hidden sm:inline">: {currentPhase.label}</span>
            </span>
            <span className="hidden md:inline-block text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden md:inline-block text-slate-600 dark:text-slate-400 font-normal">
              {arquetipo.titulo} • {financiamiento.titulo}
            </span>
          </div>

          {/* Botones de acción del header: EffectsToggle, ThemeToggle y Reiniciar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCompanyDrawer(true)}
              title="Mi empresa"
              aria-label="Abrir panel Mi empresa"
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-[11px] font-medium shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden min-[420px]:inline">Mi empresa</span>
            </button>
            <EffectsToggle fxEnabled={fxEnabled} onToggle={toggleFx} />
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

        {/* Panel de Métricas Vitales (con dorado al 100%, pulso y deltas flotantes) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:pt-1">
          <MetricCard
            label="Capital"
            value={displayMetrics.capital}
            icon={DollarSign}
            variant="capital"
            delta={metricDeltas.capital}
            deltaKey={metricDeltas.key}
            delayMs={0}
            isCalculating={isRevealing}
          />
          <MetricCard
            label="Reputación"
            value={displayMetrics.reputacion}
            icon={Award}
            variant="reputacion"
            delta={metricDeltas.reputacion}
            deltaKey={metricDeltas.key}
            delayMs={150}
            isCalculating={isRevealing}
          />
          <MetricCard
            label="Bienestar"
            value={displayMetrics.bienestar}
            icon={Heart}
            variant="bienestar"
            delta={metricDeltas.bienestar}
            deltaKey={metricDeltas.key}
            delayMs={300}
            isCalculating={isRevealing}
          />
        </div>
      </header>

      {/* Contenido Principal (A7): en lg: panel "Mi empresa" | carta + opciones | columna reservada (xl:) */}
      <div
        style={{ '--side-w': companyCollapsed ? '56px' : '260px' } as React.CSSProperties}
        className={`w-full my-auto py-6 lg:grid lg:grid-cols-[var(--side-w)_minmax(0,1fr)] xl:grid-cols-[var(--side-w)_minmax(0,1fr)_var(--side-w)] lg:gap-6 items-start lg:transition-[grid-template-columns] lg:duration-300 stress-content ${isLowWellbeing ? 'is-desaturated' : ''}`}
      >
        {/* Columna izquierda: panel Mi empresa (solo escritorio, sticky bajo el header) */}
        <aside className="hidden lg:block sticky top-60 self-start max-h-[calc(100vh-16rem)] overflow-y-auto overflow-x-hidden">
          <CompanyStatusCard
            arquetipo={arquetipo}
            financiamiento={financiamiento}
            activeTags={gameState.activeTags}
            collapsed={companyCollapsed}
            onToggleCollapse={() => setCompanyCollapsed(!companyCollapsed)}
          />
        </aside>

        {/* Columna central: carta del dilema + opciones juntas */}
        <div className="min-w-0 w-full max-w-[640px] mx-auto space-y-5">
          {currentEvent && displayEvent && (
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

                  {step === 'outcome' && !isRevealing && (
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Decisión Registrada
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2.5 leading-snug">
                  {displayEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {displayEvent.description}
                </p>
              </div>

              {/* Estado de Suspenso / Calculando (A4) */}
              {isRevealing && (
                <div className="mt-5 p-5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 flex flex-col items-center justify-center space-y-2.5 py-6 text-center animate-in fade-in duration-200 shadow-sm">
                  <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {isInterruption ? 'Analizando impacto de la crisis…' : 'Calculando consecuencias…'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Simulando reacción de mercado y métricas vitales
                    </p>
                  </div>
                </div>
              )}

              {/* Panel de Resultado por capas (A3) */}
              {step === 'outcome' && !isRevealing && (
                <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Paso ① (currentStep >= 0): Opción seleccionada y deltas */}
                  {outcomeSequence.currentStep >= 0 && lastDecision && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2 animate-in fade-in duration-200">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                        Elegiste:{' '}
                        <span className="text-slate-900 dark:text-slate-100 normal-case font-medium">
                          "{personalize(lastDecision.optionText, displayName)}"
                        </span>
                      </p>

                      {/* Deltas de la decisión */}
                      <div className="flex flex-wrap gap-1.5">
                        {renderDeltaBadge(decisionDeltas.capital, 'Capital', 'text-emerald-600 dark:text-emerald-400')}
                        {renderDeltaBadge(decisionDeltas.reputacion, 'Reputación', 'text-[#0052CC] dark:text-blue-400')}
                        {renderDeltaBadge(decisionDeltas.bienestar, 'Bienestar', 'text-amber-600 dark:text-amber-400')}
                      </div>
                    </div>
                  )}

                  {/* Paso ② (currentStep >= 1): Texto de consecuencia narrativa personalizada */}
                  {outcomeSequence.currentStep >= 1 && lastDecision?.outcomeText && (
                    <div className="p-3.5 bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/70 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Consecuencia: </span>
                      {personalize(lastDecision.outcomeText, displayName)}
                    </div>
                  )}

                  {/* Paso ③ (currentStep >= 2): Micro-píldora didáctica que entra deslizándose */}
                  {outcomeSequence.currentStep >= 2 && lastPill && (
                    <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 rounded-xl animate-slide-up-fade shadow-sm">
                      <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-normal">
                        💡 <span className="font-semibold text-indigo-700 dark:text-indigo-300">Concepto clave:</span> {personalize(lastPill, displayName)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}


          {/* Alternativas de Decisión o Botón Siguiente, debajo de la carta */}
          <div className="space-y-4">
          {/* Opciones de Decisión (Paso: decision) */}
          {status === 'playing' && displayEvent && step === 'decision' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Alternativas Disponibles:
                </p>
                <span className="hidden sm:inline-block text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Atajos: [1], [2], [3]
                </span>
              </div>

              {displayEvent.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isRevealing}
                  onClick={() => handleDecide(idx, currentTurn)}
                  className="w-full text-left p-4 bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#0E243A] dark:hover:bg-[#14304D] dark:active:bg-[#18395B] border border-slate-200 dark:border-slate-700/70 hover:border-[#0052CC]/50 dark:hover:border-indigo-500/60 rounded-xl transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2.5 group shadow-sm hover:shadow-[#0052CC]/10 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              {isRevealing ? (
                <div className="p-4 bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-xl text-center space-y-1 animate-in fade-in duration-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 animate-pulse">
                    Procesando decisión…
                  </p>
                </div>
              ) : outcomeSequence.isCompleted ? (
                <div className="space-y-3 animate-in fade-in duration-200">
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
              ) : (
                <button
                  type="button"
                  onClick={outcomeSequence.skipToEnd}
                  className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Saltar animación</span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(Espacio)</span>
                </button>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Columna derecha reservada (futuro: avatar / log); mantiene centrada la carta */}
        <div className="hidden xl:block" aria-hidden="true" />
      </div>

      {/* Drawer "Mi empresa" para pantallas menores a lg */}
      {showCompanyDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Mi empresa">
          <div
            className="absolute inset-0 bg-black/60 animate-in fade-in duration-200"
            onClick={() => setShowCompanyDrawer(false)}
          />
          <div className="relative w-[88vw] max-w-sm h-full overflow-y-auto bg-[#F4F7FB] dark:bg-[#071322] p-4 space-y-3 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setShowCompanyDrawer(false)}
              aria-label="Cerrar panel Mi empresa"
              className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <X className="w-3.5 h-3.5" /> Cerrar
            </button>
            <CompanyStatusCard
              arquetipo={arquetipo}
              financiamiento={financiamiento}
              activeTags={gameState.activeTags}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para salir o reiniciar (Punto 6) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
                onClick={() => {
                  setShowExitConfirm(false);
                  setSeenAlertForEventId(null);
                  setMetricDeltas({ key: 0 });
                  if (onResetToSetup) {
                    onResetToSetup(displayName);
                  } else {
                    handleRestartGame();
                  }
                }}
                className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md shadow-rose-600/20"
              >
                Sí, salir
              </button>
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Seguir jugando
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
