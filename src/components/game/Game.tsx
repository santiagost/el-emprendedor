import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useTheme } from '../../hooks/useTheme';
import { useSequence } from '../../hooks/useSequence';
import { useStoredFlag } from '../../hooks/useStoredFlag';
import { useOutcomeReveal } from '../../hooks/useOutcomeReveal';
import type { Archetype, Financing, Performance } from '../../types/game';
import EndGameReport from './EndGameReport';
import PhaseRecap from './PhaseRecap';
import CompanyStatusCard from './CompanyStatusCard';
import CompanyDrawer from './CompanyDrawer';
import GameMenu from './GameMenu';
import ExitConfirmModal from './ExitConfirmModal';
import GameHeader from './GameHeader';
import EventCard from './EventCard';
import OptionList from './OptionList';
import { buildOptionHint, buildOutcomeForecast } from '../../game/optionHint';
import OutcomeActions from './OutcomeActions';
import InterruptionStage from './InterruptionStage';
import MinigameStage from './minigames/MinigameStage';
import { useEffectsToggle } from '../../lib/motion';
import { PHASES, type PhaseId } from '../../game/phases';
import { buildPhaseRecap } from '../../game/recap';
import { INTUITION_FIRST_PHASE } from '../../game/intuition';
import { stageFor } from '../../game/stage';
import { hasPlayableMinigame, seedFromText } from '../../game/minigames/performance';
import { stressLevel } from '../../game/ui';
import { confetti, vibrate } from '../../lib/fx';
import { playSound, useSoundToggle } from '../../lib/sound';
import { localizeEvent } from '../../lib/personalize';
import type { SequenceStep } from '../../hooks/useSequence';

// Fuera del componente: una referencia estable evita reiniciar los timers de useSequence
const OUTCOME_STEPS: SequenceStep[] = [
  { at: 0 },    // Paso ①: Selección y deltas
  { at: 700 },  // Paso ②: Consecuencia narrativa
  { at: 1500 }, // Paso ③: Concepto clave
];

interface GameProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  /** Nombre elegido en Setup; en una partida retomada se usa el guardado en la sesión. */
  playerName?: string;
  onResetToSetup?: (currentName?: string) => void;
}

export default function Game({ arquetipo, financiamiento, playerName, onResetToSetup }: GameProps) {
  const { theme, toggleTheme } = useTheme();
  const { fxEnabled, toggleFx } = useEffectsToggle();
  const { soundEnabled, toggleSound } = useSoundToggle();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // A7: panel lateral "Mi empresa" (colapsable en escritorio, drawer en pantallas chicas)
  const [companyCollapsed, setCompanyCollapsed] = useStoredFlag('el_emprendedor_company_panel_collapsed', false);
  const [showCompanyDrawer, setShowCompanyDrawer] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);

  const {
    gameState,
    currentEvent,
    step,
    decide,
    advance,
    continueFromRecap,
    restartGame,
  } = useGameEngine(arquetipo, financiamiento, playerName);

  // Coreografía de interrupciones (Sprint 2 · A1). Recargar en medio de ella no la repite: la carta queda revelada.
  const [seenAlertForEventId, setSeenAlertForEventId] = useState<string | null>(() =>
    step === 'decision' && currentEvent && stageFor(currentEvent) ? currentEvent.id : null
  );
  // Carta que acaba de revelarse tras la coreografía: anima su entrada una sola vez
  const [revealedEventId, setRevealedEventId] = useState<string | null>(null);

  const {
    metrics,
    status,
    currentTurn,
    maxTurns,
    lastPill,
    lastDecision,
    phaseId,
  } = gameState;

  // Sprint 3: opción elegida que está esperando el resultado de su minijuego
  const [pendingMinigame, setPendingMinigame] = useState<{ optionIndex: number; turn: number } | null>(null);

  // Suspenso, deltas del HUD y confeti de métricas al revelar el impacto de la decisión (A3, A4, A6)
  const reveal = useOutcomeReveal({ step, metrics, lastDecision, eventKind: currentEvent?.kind });
  const { isRevealing, displayMetrics, beginReveal } = reveal;

  const commitDecision = useCallback(
    (optionIndex: number, turn: number, performance?: Performance) => {
      if (isRevealing || step !== 'decision') return;
      playSound('select');
      beginReveal();
      // Ejecutar de inmediato en el engine para persistir en localStorage
      decide(optionIndex, turn, performance);
    },
    [isRevealing, step, beginReveal, decide]
  );

  const handleDecide = useCallback(
    (optionIndex: number, turn: number) => {
      if (isRevealing || step !== 'decision' || pendingMinigame) return;
      // Una opción con minijuego lo juega primero; su resultado llega a commitDecision
      if (hasPlayableMinigame(currentEvent?.options[optionIndex]?.minigame)) {
        playSound('select');
        setPendingMinigame({ optionIndex, turn });
        return;
      }
      commitDecision(optionIndex, turn);
    },
    [isRevealing, step, pendingMinigame, currentEvent, commitDecision]
  );

  const resolveMinigame = useCallback(
    (performance: Performance) => {
      if (!pendingMinigame) return;
      const { optionIndex, turn } = pendingMinigame;
      setPendingMinigame(null);
      if (performance === 'perfect') confetti('gold');
      else if (performance === 'poor') {
        playSound('thud');
        vibrate(60);
      }
      commitDecision(optionIndex, turn, performance);
    },
    [pendingMinigame, commitDecision]
  );

  const handleRestartGame = () => {
    reveal.reset();
    setSeenAlertForEventId(null);
    setRevealedEventId(null);
    setPendingMinigame(null);
    restartGame();
  };

  // B1: los textos con {nombre} se resuelven en el render; el motor guarda los textos crudos
  const displayName = gameState.playerName;
  const displayEvent = useMemo(
    () => (currentEvent ? localizeEvent(currentEvent, displayName) : null),
    [currentEvent, displayName]
  );

  // "Qué podría venir" del resultado: solo mientras se muestra la decisión que acaba de tomarse
  const forecast = useMemo(
    () =>
      step === 'outcome' && displayEvent && lastDecision?.eventId === displayEvent.id
        ? buildOutcomeForecast(displayEvent, lastDecision.optionIndex, lastDecision.performance)
        : null,
    [step, displayEvent, lastDecision]
  );

  // B2: resumen de la fase que acaba de cerrarse (el estado ya avanzó a la siguiente)
  const [initialRecapPhaseId] = useState<number | null>(() =>
    step === 'phase_recap' ? ((phaseId - 1) as PhaseId) : null
  );
  const phaseRecap = useMemo(
    () => (step === 'phase_recap' ? buildPhaseRecap(gameState, (phaseId - 1) as PhaseId, displayName) : null),
    [step, gameState, phaseId, displayName]
  );

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
  const interruptionStage = stageFor(currentEvent);
  const showIncomingAlert = Boolean(
    interruptionStage &&
    currentEvent &&
    step === 'decision' &&
    seenAlertForEventId !== currentEvent.id
  );
  const justRevealed = step === 'decision' && Boolean(currentEvent) && revealedEventId === currentEvent?.id;

  // Atajos de teclado en Desktop (1, 2, 3 para elegir opción; Espacio/Enter para avanzar o saltar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitConfirm || showCompanyDrawer || showGameMenu || showIncomingAlert || isRevealing || pendingMinigame) return;

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
  }, [step, currentEvent, status, currentTurn, showExitConfirm, showCompanyDrawer, showGameMenu, showIncomingAlert, advance, outcomeSequence, isRevealing, pendingMinigame, handleDecide]);

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
  // B1: el resumen de fase es un hito dentro de la pantalla de juego (el encabezado queda fijo)
  const recapOnScreen = step === 'phase_recap' ? phaseRecap : null;

  return (
    <main
      className="w-full max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col min-h-screen justify-between relative"
      style={{ '--stress': stress } as React.CSSProperties}
    >
      {/* Atmósfera tonal por estrés (A5): tinte + viñeta, o resplandor cálido si todo está sano */}
      <div aria-hidden="true" className="stress-layer stress-tint" />
      <div aria-hidden="true" className="stress-layer stress-vignette" />
      <div aria-hidden="true" className={`stress-layer calm-glow ${isCalm ? 'is-on' : ''}`} />

      {/* Coreografía de la interrupción (crisis, imprevisto u oportunidad) antes de mostrar la carta */}
      {showIncomingAlert && currentEvent && displayEvent && interruptionStage && (
        <InterruptionStage
          key={currentEvent.id}
          event={displayEvent}
          stage={interruptionStage}
          turnLabel={`Turno ${currentTurn} de ${maxTurns} · ${PHASES.find((p) => p.id === phaseId)?.label ?? ''}`}
          metrics={displayMetrics}
          onDone={() => {
            setSeenAlertForEventId(currentEvent.id);
            setRevealedEventId(currentEvent.id);
          }}
        />
      )}

      <GameHeader
        arquetipo={arquetipo}
        financiamiento={financiamiento}
        currentTurn={currentTurn}
        maxTurns={maxTurns}
        phaseId={phaseId}
        recapPhaseId={recapOnScreen?.phaseId}
        stageTone={showIncomingAlert ? interruptionStage?.tone : undefined}
        metrics={displayMetrics}
        deltas={reveal.metricDeltas}
        isCalculating={isRevealing}
        theme={theme}
        onToggleTheme={toggleTheme}
        fxEnabled={fxEnabled}
        onToggleFx={toggleFx}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenCompany={() => setShowCompanyDrawer(true)}
        onOpenMenu={() => setShowGameMenu(true)}
        onExit={() => setShowExitConfirm(true)}
      />

      {/* Hito de fase (B1): el resumen ocupa el lugar del dilema y de "Mi empresa" */}
      {recapOnScreen ? (
        <div className="w-full my-auto py-6 stress-content">
          <PhaseRecap
            recap={recapOnScreen}
            initialCompleted={initialRecapPhaseId === recapOnScreen.phaseId}
            onContinue={continueFromRecap}
            disabled={showExitConfirm || showCompanyDrawer || showGameMenu}
          />
        </div>
      ) : (
      <div
        className={`w-full my-auto py-6 lg:grid ${companyCollapsed ? 'lg:grid-cols-[56px_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(240px,1fr)_minmax(0,2fr)]'} lg:gap-8 items-start lg:transition-[grid-template-columns] lg:duration-300 stress-content ${isLowWellbeing ? 'is-desaturated' : ''}`}
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
        <div className="min-w-0 w-full max-w-[760px] mx-auto space-y-5">
          {displayEvent && (
            <EventCard
              event={displayEvent}
              hidden={showIncomingAlert}
              justRevealed={justRevealed}
              isRevealing={isRevealing}
              outcomeStep={step === 'outcome' ? outcomeSequence.currentStep : null}
              lastDecision={lastDecision}
              decisionDeltas={reveal.decisionDeltas}
              lastPill={lastPill}
              forecast={forecast}
              playerName={displayName}
            />
          )}

          {/* Alternativas de Decisión o Botón Siguiente, debajo de la carta */}
          <div className="space-y-4">
          {/* Minijuego de la opción elegida (Sprint 3) */}
          {status === 'playing' && displayEvent && step === 'decision' && pendingMinigame && (
            <div className="space-y-2">
              <p className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Elegiste: <span className="normal-case font-medium text-slate-800 dark:text-slate-200">"{displayEvent.options[pendingMinigame.optionIndex].text}"</span>
              </p>
              <MinigameStage
                spec={displayEvent.options[pendingMinigame.optionIndex].minigame!}
                seed={seedFromText(`${displayEvent.id}:${pendingMinigame.turn}`)}
                reputation={metrics.reputacion}
                activeTags={gameState.activeTags}
                onResolve={resolveMinigame}
                onSkip={() => resolveMinigame('good')}
              />
            </div>
          )}
          {/* Opciones de Decisión (Paso: decision) */}
          {status === 'playing' && displayEvent && step === 'decision' && !pendingMinigame && (
            <OptionList
              options={displayEvent.options}
              hints={displayEvent.options.map((_, i) => buildOptionHint(displayEvent, i))}
              hidden={showIncomingAlert}
              justRevealed={justRevealed}
              disabled={isRevealing}
              showIntuition={phaseId >= INTUITION_FIRST_PHASE && displayEvent.kind !== 'crisis' && displayEvent.kind !== 'unforeseen'}
              onPick={(idx) => handleDecide(idx, currentTurn)}
            />
          )}

          {/* Panel de Outcome / Botón Siguiente (Paso: outcome) */}
          {step === 'outcome' && (
            <OutcomeActions
              isRevealing={isRevealing}
              isCompleted={outcomeSequence.isCompleted}
              nextLabel={
                isGameOverOrVictory
                  ? 'Ver Desenlace Final'
                  : isInterruption
                  ? 'Continuar al Siguiente Turno'
                  : 'Siguiente Turno'
              }
              onNext={advance}
              onSkip={outcomeSequence.skipToEnd}
            />
          )}
          </div>
        </div>

      </div>
      )}

      {/* Drawer "Mi empresa" para pantallas menores a lg */}
      {showCompanyDrawer && (
        <CompanyDrawer
          arquetipo={arquetipo}
          financiamiento={financiamiento}
          activeTags={gameState.activeTags}
          onClose={() => setShowCompanyDrawer(false)}
        />
      )}

      {/* Menú de partida en móvil (A5) */}
      {showGameMenu && (
        <GameMenu
          theme={theme}
          onToggleTheme={toggleTheme}
          fxEnabled={fxEnabled}
          onToggleFx={toggleFx}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onExit={() => setShowExitConfirm(true)}
          onClose={() => setShowGameMenu(false)}
        />
      )}

      {/* Modal de confirmación para salir o reiniciar (Punto 6) */}
      {showExitConfirm && (
        <ExitConfirmModal
          onCancel={() => setShowExitConfirm(false)}
          onConfirm={() => {
            setShowExitConfirm(false);
            if (onResetToSetup) {
              onResetToSetup(displayName);
            } else {
              handleRestartGame();
            }
          }}
        />
      )}
    </main>
  );
}
