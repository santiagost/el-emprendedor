import { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import type { Archetype, Financing } from '../../types/game';
import { DollarSign, Award, Heart, ArrowRight, RotateCcw, AlertTriangle, Zap } from 'lucide-react';
import ImpactBadges from './ImpactBadges';
import EndGameReport from './EndGameReport';

interface GameProps {
  arquetipo: Archetype;
  financiamiento: Financing;
  onResetToSetup?: () => void;
}

const renderDeltaBadge = (value: number | undefined, label: string, color: string) => {
  if (value === undefined || value === 0) return null;
  const isPositive = value > 0;
  const sign = isPositive ? '+' : '';
  const textColor = isPositive ? color : 'text-rose-400';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800/80 ${textColor} border border-slate-700/60`}>
      {sign}{value} {label}
    </span>
  );
};

export default function Game({ arquetipo, financiamiento, onResetToSetup }: GameProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
  } = gameState;

  // Si la partida terminó y estamos en el paso final
  if (step === 'ended') {
    return (
      <main className="max-w-md mx-auto p-4 flex flex-col min-h-screen justify-start">
        <EndGameReport
          gameState={gameState}
          arquetipo={arquetipo}
          financiamiento={financiamiento}
          onRestart={restartGame}
          onResetToSetup={onResetToSetup ?? restartGame}
        />
      </main>
    );
  }

  const isGameOverOrVictory = status !== 'playing';

  return (
    <main className="max-w-md mx-auto p-4 flex flex-col min-h-screen justify-between relative">
      {/* Header & Métricas */}
      <header className="space-y-4">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span>TURNO {currentTurn} / {maxTurns}</span>
            <span className="text-slate-600">•</span>
            <span className="uppercase tracking-widest text-indigo-400">Fase {gameState.phaseId}</span>
          </div>

          {/* Botón para volver al setup (Punto 6) */}
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            title="Cambiar estrategia / Volver al inicio"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors text-[11px]"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reiniciar</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="flex items-center text-xs text-emerald-400 font-bold mb-1">
              <DollarSign className="w-3.5 h-3.5 mr-0.5" /> {metrics.capital}%
            </span>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${metrics.capital}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1">Capital</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center text-xs text-blue-400 font-bold mb-1">
              <Award className="w-3.5 h-3.5 mr-0.5" /> {metrics.reputacion}%
            </span>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${metrics.reputacion}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1">Reputación</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="flex items-center text-xs text-rose-400 font-bold mb-1">
              <Heart className="w-3.5 h-3.5 mr-0.5" /> {metrics.bienestar}%
            </span>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${metrics.bienestar}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1">Bienestar</span>
          </div>
        </div>
      </header>

      {/* Área Central / Evento */}
      <section className="my-auto py-4">
        {currentEvent && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                {currentEvent.kind === 'crisis' ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Crisis Operativa • Turno {currentTurn}
                  </span>
                ) : currentEvent.kind === 'unforeseen' ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Suceso Imprevisto • Turno {currentTurn}
                  </span>
                ) : (
                  <span className="text-indigo-400">Dilema {currentTurn}</span>
                )}
                {step === 'outcome' && (
                  <span className="text-amber-400 font-bold">Resultado</span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-2">{currentEvent.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{currentEvent.description}</p>
            </div>

            {/* Panel de Resultado (D2) */}
            {step === 'outcome' && (
              <div className="mt-4 space-y-3 pt-3 border-t border-slate-800/80">
                {/* Opción seleccionada */}
                {lastDecision && (
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-2">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Elegiste: <span className="text-slate-200 normal-case font-normal">"{lastDecision.optionText}"</span>
                    </p>

                    {/* Deltas de la decisión */}
                    <div className="flex flex-wrap gap-1.5">
                      {renderDeltaBadge(lastDecision.effects.capital, 'Capital', 'text-emerald-400')}
                      {renderDeltaBadge(lastDecision.effects.reputacion, 'Reputación', 'text-blue-400')}
                      {renderDeltaBadge(lastDecision.effects.bienestar, 'Bienestar', 'text-rose-400')}
                    </div>
                  </div>
                )}

                {/* Texto de consecuencia narrativa personalizada */}
                {lastDecision?.outcomeText && (
                  <div className="p-3 bg-slate-950/50 border border-slate-800/70 rounded-lg text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-200">Consecuencia: </span>
                    {lastDecision.outcomeText}
                  </div>
                )}

                {/* Micro-píldora didáctica */}
                {lastPill && (
                  <div className="p-3 bg-indigo-950/50 border border-indigo-800/70 rounded-lg">
                    <p className="text-[11px] text-indigo-200 leading-normal">
                      💡 <span className="font-semibold text-indigo-300">Concepto clave:</span> {lastPill}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Opciones de Decisión (Paso: decision) */}
      {status === 'playing' && currentEvent && step === 'decision' && (
        <footer className="space-y-2.5 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
            Elegí una alternativa:
          </p>
          {currentEvent.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => decide(idx, currentTurn)}
              className="w-full text-left p-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-xs text-slate-200 space-y-2 group"
            >
              <div className="leading-snug text-slate-200 group-hover:text-white">
                {option.text}
              </div>
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Tendencia esperada:
                </span>
                <ImpactBadges impactPreview={option.impactPreview} />
              </div>
            </button>
          ))}
        </footer>
      )}

      {/* Panel de Outcome / Botón Siguiente (Paso: outcome) */}
      {step === 'outcome' && (
        <footer className="pb-4 pt-2">
          <button
            onClick={advance}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            <span>
              {isGameOverOrVictory
                ? 'Ver Desenlace Final'
                : (currentEvent?.kind === 'crisis' || currentEvent?.kind === 'unforeseen')
                  ? 'Continuar al Siguiente Turno'
                  : 'Siguiente Turno'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      )}

      {/* Modal de confirmación para salir o reiniciar (Punto 6) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-950/60 border border-rose-800/60 rounded-full flex items-center justify-center mx-auto text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-100">
                ¿Abandonar partida actual?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Se perderá el progreso de esta trayectoria y volverás a la pantalla de configuración para elegir perfil y financiamiento.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Seguir jugando
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
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