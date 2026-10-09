import type { Archetype, Financing } from '../../types/game';
import { ARCHETYPES, FINANCINGS } from '../../data/archetypes';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

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
        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-8">
            <header className="mb-8 space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                        El Emprendedor
                    </p>
                    <h1 className="text-2xl font-bold text-slate-100">Configuración</h1>
                    <p className="text-sm leading-relaxed text-slate-400">
                        Definí tu estrategia inicial y preparate para tomar decisiones.
                    </p>
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

                    <div className="space-y-3">
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

                    <div className="space-y-3">
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