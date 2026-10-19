import type { Archetype, Financing } from '../../types/game';
import { ARCHETYPES, FINANCINGS } from '../../data/archetypes';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, DollarSign, Award, Heart } from 'lucide-react';
import ImpactBadges from '../game/ImpactBadges';

interface SetupProps {
    onComplete: (arquetipo: Archetype, financiamiento: Financing) => void;
}

export default function Setup({ onComplete }: SetupProps) {
    const [arquetipo, setArquetipo] = useState<Archetype | null>(null);
    const [financiamiento, setFinanciamiento] = useState<Financing | null>(null);
    const [step, setStep] = useState<1 | 2>(1);

    const handleArquetipoContinue = () => {
        if (!arquetipo) return;
        setStep(2);
    };

    const handleStart = () => {
        if (!arquetipo || !financiamiento) return;

        onComplete(arquetipo, financiamiento);
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 sm:px-6 py-8">
            <header className="mb-6 space-y-5">
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                        El Emprendedor
                    </p>
                    <h1 className="text-2xl font-bold text-slate-100">Configuración</h1>
                    <p className="text-sm leading-relaxed text-slate-400">
                        Definí tu estrategia inicial y preparate para tomar decisiones.
                    </p>
                </div>

                {/* Explicación de Métricas Vitales (Punto 5) */}
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        <span>Métricas de Supervivencia</span>
                        <span className="text-[10px] text-indigo-400 font-semibold">Tocar 0% = Fin</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-left">
                        <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-bold text-emerald-400">
                                <DollarSign className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Capital
                            </span>
                            <p className="text-[10px] text-slate-400 leading-tight">
                                Caja y liquidez. Si llega a 0%, quiebra inmediata.
                            </p>
                        </div>
                        <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-bold text-blue-400">
                                <Award className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Reputación
                            </span>
                            <p className="text-[10px] text-slate-400 leading-tight">
                                Confianza del mercado. Si llega a 0%, crisis terminal.
                            </p>
                        </div>
                        <div className="p-2 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-bold text-rose-400">
                                <Heart className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Bienestar
                            </span>
                            <p className="text-[10px] text-slate-400 leading-tight">
                                Moral y salud mental. Si llega a 0%, colapso por burnout.
                            </p>
                        </div>
                    </div>
                </div>

                <nav aria-label="Progreso de configuración" className="flex items-center gap-3">
                    {[1, 2].map((item) => {
                        const isComplete = step > item;
                        const isCurrent = step === item;

                        return (
                            <div key={item} className="flex flex-1 items-center gap-2">
                                <span
                                    aria-current={isCurrent ? 'step' : undefined}
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${isComplete
                                            ? 'border-indigo-500 bg-indigo-600 text-white'
                                            : isCurrent
                                                ? 'border-indigo-400 bg-indigo-950 text-indigo-300'
                                                : 'border-slate-700 bg-slate-900 text-slate-500'
                                        }`}
                                >
                                    {isComplete ? <Check className="h-3.5 w-3.5" /> : item}
                                </span>
                                <div className="min-w-0">
                                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${isCurrent ? 'text-indigo-300' : 'text-slate-500'}`}>
                                        Paso {item}
                                    </p>
                                    <p className="truncate text-xs text-slate-400">
                                        {item === 1 ? 'Perfil' : 'Financiamiento'}
                                    </p>
                                </div>
                                {item === 1 && (
                                    <div className={`ml-auto h-px flex-1 ${step === 2 ? 'bg-indigo-700' : 'bg-slate-800'}`} />
                                )}
                            </div>
                        );
                    })}
                </nav>
            </header>

            {step === 1 && (
                <section className="flex flex-1 flex-col">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-slate-100">
                            ¿Cómo querés comenzar?
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Elegí el tipo de emprendedor que vas a ser.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {ARCHETYPES.map((item) => {
                            const isSelected = arquetipo?.id === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setArquetipo(item)}
                                    className={`w-full rounded-xl border p-4 text-left transition-all ${isSelected
                                            ? 'border-indigo-500 bg-indigo-950/50 ring-1 ring-indigo-500/40'
                                            : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm font-bold text-slate-100">
                                            {item.titulo}
                                        </h3>
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${isSelected
                                                ? 'border-indigo-400 bg-indigo-500 text-white'
                                                : 'border-slate-700 text-transparent'
                                            }`}>
                                            <Check className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                        {item.descripcion}
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Impacto inicial:</span>
                                        <ImpactBadges impactPreview={item.impactPreview} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleArquetipoContinue}
                        disabled={!arquetipo}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                    >
                        Continuar <ArrowRight className="h-4 w-4" />
                    </button>
                </section>
            )}

            {step === 2 && (
                <section className="flex flex-1 flex-col">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-slate-100">
                            ¿Cómo querés financiar tu empresa?
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Elegí la forma de financiamiento que más se ajuste a tu estrategia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {FINANCINGS.map((item) => {
                            const isSelected = financiamiento?.id === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setFinanciamiento(item)}
                                    className={`w-full rounded-xl border p-4 text-left transition-all ${isSelected
                                            ? 'border-indigo-500 bg-indigo-950/50 ring-1 ring-indigo-500/40'
                                            : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm font-bold text-slate-100">
                                            {item.titulo}
                                        </h3>
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${isSelected
                                                ? 'border-indigo-400 bg-indigo-500 text-white'
                                                : 'border-slate-700 text-transparent'
                                            }`}>
                                            <Check className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                                        {item.descripcion}
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Impacto inicial:</span>
                                        <ImpactBadges impactPreview={item.impactPreview} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4" /> Volver
                        </button>
                        <button
                            type="button"
                            onClick={handleStart}
                            disabled={!financiamiento}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                        >
                            Comenzar <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
}