import { useGameEngine } from '../../hooks/useGameEngine';
import type { Archetype, Financing } from '../../types/game';
import { DollarSign, Award, Heart, RefreshCw } from 'lucide-react';

interface GameProps {
    arquetipo: Archetype;
    financiamiento: Financing;
}

export default function Game({ arquetipo, financiamiento }: GameProps) {
    const {
        gameState,
        currentEvent,
        step,
        makeDecision,
        advance,
        restartGame
    } = useGameEngine(arquetipo, financiamiento);

    const {
        metrics,
        status,
        currentTurn,
        maxTurns,
        lastPill
    } = gameState;

    return (
        <main className="max-w-md mx-auto p-4 flex flex-col min-h-screen justify-between">
            {/* Header & Métricas */}
            <header className="space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>TURNO {currentTurn} / {maxTurns}</span>
                    <span className="uppercase tracking-widest text-indigo-400">Fase {gameState.phaseId}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="flex flex-col items-center">
                        <span className="flex items-center text-xs text-emerald-400 font-bold mb-1">
                            <DollarSign className="w-3.5 h-3.5 mr-0.5" /> {metrics.capital}%
                        </span>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${metrics.capital}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">Capital</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="flex items-center text-xs text-blue-400 font-bold mb-1">
                            <Award className="w-3.5 h-3.5 mr-0.5" /> {metrics.reputacion}%
                        </span>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${metrics.reputacion}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">Reputación</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="flex items-center text-xs text-rose-400 font-bold mb-1">
                            <Heart className="w-3.5 h-3.5 mr-0.5" /> {metrics.bienestar}%
                        </span>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${metrics.bienestar}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">Bienestar</span>
                    </div>
                </div>
            </header>

            {/* Área Central / Evento */}
            <section className="my-auto py-6">
                {status === 'playing' && currentEvent && (
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[280px]">
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 mb-2">{currentEvent.title}</h2>
                            <p className="text-sm text-slate-300 leading-relaxed">{currentEvent.description}</p>
                        </div>

                        {lastPill && (
                            <div className="mt-4 p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-lg">
                                <p className="text-[11px] text-indigo-300 leading-normal">
                                    💡 <span className="font-semibold">Concepto clave:</span> {lastPill}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {status !== 'playing' && (
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
                        <h2 className="text-xl font-bold">
                            {status === 'victory' ? '🎉 ¡Empresa Consolidada!' : '💥 Fin de la Trayectoria'}
                        </h2>
                        <p className="text-sm text-slate-300">
                            {status === 'game_over_capital' && 'Te quedaste sin liquidez y la empresa cayó en quiebra.'}
                            {status === 'game_over_reputacion' && 'Perdiste toda credibilidad ante clientes e inversores.'}
                            {status === 'game_over_bienestar' && 'Colapsaste por burnout. La salud y el equipo no dieron más.'}
                            {status === 'victory' && 'Superaste todas las fases de maduración con éxito.'}
                        </p>
                        <button
                            onClick={restartGame}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
                        </button>
                    </div>
                )}
            </section>

            {/* Opciones de Decisión */}
            {status === 'playing' && currentEvent && (
                <footer className="space-y-2 pb-4">
                    {currentEvent.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => makeDecision(option)}
                            className="w-full text-left p-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-xs text-slate-200"
                        >
                            {option.text}
                        </button>
                    ))}
                </footer>
            )}
        </main>
    );
}