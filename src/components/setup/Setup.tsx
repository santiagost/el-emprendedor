import type { Archetype, Financing } from '../../types/game';
import { ARCHETYPES, FINANCINGS } from '../../data/archetypes';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, DollarSign, Award, Heart } from 'lucide-react';
import ImpactBadges from '../game/ImpactBadges';
import ThemeToggle from '../common/ThemeToggle';
import EffectsToggle from '../common/EffectsToggle';
import { useTheme } from '../../hooks/useTheme';
import { useEffectsToggle } from '../../lib/motion';

interface SetupProps {
    onComplete: (arquetipo: Archetype, financiamiento: Financing) => void;
}

export default function Setup({ onComplete }: SetupProps) {
    const { theme, toggleTheme } = useTheme();
    const { fxEnabled, toggleFx } = useEffectsToggle();
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
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0052CC] dark:text-blue-400">
                            El Emprendedor • Simulador de Decisiones
                        </p>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                            Configuración Inicial
                        </h1>
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Definí tu estrategia y preparate para tomar decisiones en el mercado.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <EffectsToggle fxEnabled={fxEnabled} onToggle={toggleFx} />
                        <ThemeToggle theme={theme} onToggle={toggleTheme} />
                    </div>
                </div>

                {/* Explicación de Métricas Vitales (Stitch: Capital Esmeralda, Reputación Cobalto, Bienestar Ámbar) */}
                <div className="bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        <span>Métricas Vitales de Supervivencia</span>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold uppercase">Tocar 0% = Derrota Inmediata</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-left">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-black text-[#0F9D58] dark:text-emerald-400">
                                <DollarSign className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Capital
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                Caja y liquidez. Si llega a 0%, quiebra inmediata.
                            </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-black text-[#1B68D2] dark:text-blue-400">
                                <Award className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Reputación
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                Confianza del mercado. Si llega a 0%, rescisión total.
                            </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-black text-[#FF9800] dark:text-amber-400">
                                <Heart className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Bienestar
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                Moral y salud del equipo. Si llega a 0%, colapso por burnout.
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
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                                        isComplete
                                            ? 'border-[#0052CC] bg-[#0052CC] text-white'
                                            : isCurrent
                                                ? 'border-[#0052CC] bg-blue-50 text-[#0052CC] dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300'
                                                : 'border-slate-300 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500'
                                    }`}
                                >
                                    {isComplete ? <Check className="h-3.5 w-3.5" /> : item}
                                </span>
                                <div className="min-w-0">
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-[#0052CC] dark:text-blue-300' : 'text-slate-400 dark:text-slate-500'}`}>
                                        Paso {item}
                                    </p>
                                    <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {item === 1 ? 'Perfil de Fundador' : 'Estructura de Financiamiento'}
                                    </p>
                                </div>
                                {item === 1 && (
                                    <div className={`ml-auto h-px flex-1 ${step === 2 ? 'bg-[#0052CC]' : 'bg-slate-200 dark:bg-slate-800'}`} />
                                )}
                            </div>
                        );
                    })}
                </nav>
            </header>

            {step === 1 && (
                <section className="flex flex-1 flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                            ¿Cómo querés comenzar?
                        </h2>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Elegí el perfil de fundador que definirá tus fortalezas y sesgos iniciales.
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
                                    className={`w-full rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                                        isSelected
                                            ? 'border-[#0052CC] bg-blue-50/70 dark:bg-[#0E2C52] ring-2 ring-[#0052CC]/50 shadow-md'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                                            {item.titulo}
                                        </h3>
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                            isSelected
                                                ? 'border-[#0052CC] bg-[#0052CC] text-white'
                                                : 'border-slate-300 dark:border-slate-700 text-transparent'
                                        }`}>
                                            <Check className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        {item.descripcion}
                                    </p>
                                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Impacto inicial:</span>
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
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] hover:bg-[#0052CC] dark:bg-[#0052CC] dark:hover:bg-[#0453cd] px-4 py-3.5 text-sm font-bold text-white transition-all shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
                    >
                        Continuar a Financiamiento <ArrowRight className="h-4 w-4" />
                    </button>
                </section>
            )}

            {step === 2 && (
                <section className="flex flex-1 flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                            ¿Cómo querés financiar tu empresa?
                        </h2>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Elegí el esquema financiero inicial: velocidad de capital vs autonomía de control.
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
                                    className={`w-full rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                                        isSelected
                                            ? 'border-[#0052CC] bg-blue-50/70 dark:bg-[#0E2C52] ring-2 ring-[#0052CC]/50 shadow-md'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E33] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                                            {item.titulo}
                                        </h3>
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                            isSelected
                                                ? 'border-[#0052CC] bg-[#0052CC] text-white'
                                                : 'border-slate-300 dark:border-slate-700 text-transparent'
                                        }`}>
                                            <Check className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        {item.descripcion}
                                    </p>
                                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Impacto inicial:</span>
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
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                        >
                            <ArrowLeft className="h-4 w-4" /> Volver
                        </button>
                        <button
                            type="button"
                            onClick={handleStart}
                            disabled={!financiamiento}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A2540] hover:bg-[#0052CC] dark:bg-[#0052CC] dark:hover:bg-[#0453cd] px-4 py-3.5 text-sm font-bold text-white transition-all shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
                        >
                            Comenzar Simulación <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
}
