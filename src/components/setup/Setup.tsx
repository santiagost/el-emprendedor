import type { Archetype, Financing } from '../../types/game';
import { ARCHETYPES, FINANCINGS } from '../../data/archetypes';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, DollarSign, Award, Heart } from 'lucide-react';
import ImpactBadges from '../game/ImpactBadges';
import ThemeToggle from '../common/ThemeToggle';
import EffectsToggle from '../common/EffectsToggle';
import SoundToggle from '../common/SoundToggle';
import Button from '../common/Button';
import Card from '../common/Card';
import { useSoundToggle } from '../../lib/sound';
import { useTheme } from '../../hooks/useTheme';
import { useEffectsToggle } from '../../lib/motion';
import { MAX_PLAYER_NAME_LENGTH, sanitizePlayerName } from '../../lib/personalize';
import { forgetName, loadRememberedName, rememberName } from '../../lib/playerName';

interface SetupProps {
    onComplete: (arquetipo: Archetype, financiamiento: Financing, nombre?: string) => void;
    /** Nombre de la sesión actual (al volver a Setup desde una partida), si no hay uno recordado. */
    initialName?: string;
}

export default function Setup({ onComplete, initialName }: SetupProps) {
    const { theme, toggleTheme } = useTheme();
    const { fxEnabled, toggleFx } = useEffectsToggle();
    const { soundEnabled, toggleSound } = useSoundToggle();
    const [arquetipo, setArquetipo] = useState<Archetype | null>(null);
    const [financiamiento, setFinanciamiento] = useState<Financing | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    // Nombre opcional: se precarga el recordado (casilla tildada) o el de la sesión actual
    const [remembered] = useState(() => loadRememberedName());
    const [nombre, setNombre] = useState(() => remembered ?? initialName ?? '');
    const [recordar, setRecordar] = useState(() => remembered !== undefined);

    const handleArquetipoContinue = () => {
        if (!arquetipo) return;
        setStep(2);
    };

    const handleStart = () => {
        if (!arquetipo || !financiamiento) return;
        const cleanName = sanitizePlayerName(nombre);
        if (cleanName && recordar) {
            rememberName(cleanName);
        } else if (cleanName) {
            // Casilla apagada: este nombre es solo para esta partida y no queda uno recordado anterior
            forgetName();
        }
        // Sin nombre: no se toca lo recordado (jugar anónimo una vez no lo borra)
        onComplete(arquetipo, financiamiento, cleanName);
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 sm:px-6 py-8">
            <header className="mb-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-cobalt dark:text-blue-400">
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
                        <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
                        <EffectsToggle fxEnabled={fxEnabled} onToggle={toggleFx} />
                        <ThemeToggle theme={theme} onToggle={toggleTheme} />
                    </div>
                </div>

                {/* Explicación de Métricas Vitales (Stitch: Capital Esmeralda, Reputación Cobalto, Bienestar Ámbar) */}
                <Card className="p-3.5 sm:p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        <span>Métricas Vitales de Supervivencia</span>
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-extrabold uppercase">Tocar 0% = Derrota Inmediata</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-left">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-black text-metric-capital">
                                <DollarSign className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Capital
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                Caja y liquidez. Si llega a 0%, quiebra inmediata.
                            </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-black text-metric-reputacion">
                                <Award className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Reputación
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                Confianza del mercado. Si llega a 0%, rescisión total.
                            </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                            <span className="flex items-center text-xs font-black text-metric-bienestar">
                                <Heart className="w-3.5 h-3.5 mr-0.5 shrink-0" /> Bienestar
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                Moral y salud del equipo. Si llega a 0%, colapso por burnout.
                            </p>
                        </div>
                    </div>
                </Card>

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
                                            ? 'border-brand-cobalt bg-brand-cobalt text-white'
                                            : isCurrent
                                                ? 'border-brand-cobalt bg-blue-50 text-brand-cobalt dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300'
                                                : 'border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                                    }`}
                                >
                                    {isComplete ? <Check className="h-3.5 w-3.5" /> : item}
                                </span>
                                <div className="min-w-0">
                                    <p className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-brand-cobalt dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                        Paso {item}
                                    </p>
                                    <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {item === 1 ? 'Perfil de Fundador' : 'Estructura de Financiamiento'}
                                    </p>
                                </div>
                                {item === 1 && (
                                    <div className={`ml-auto h-px flex-1 ${step === 2 ? 'bg-brand-cobalt' : 'bg-slate-200 dark:bg-slate-800'}`} />
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {ARCHETYPES.map((item) => {
                            const isSelected = arquetipo?.id === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setArquetipo(item)}
                                    className={`flex w-full flex-col rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                                        isSelected
                                            ? 'border-brand-cobalt bg-blue-50/70 dark:bg-night-selected ring-2 ring-brand-cobalt/50 shadow-md'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-night-surface hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                                            {item.titulo}
                                        </h3>
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                            isSelected
                                                ? 'border-brand-cobalt bg-brand-cobalt text-white'
                                                : 'border-slate-300 dark:border-slate-700 text-transparent'
                                        }`}>
                                            <Check className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        {item.descripcion}
                                    </p>
                                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                                        <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold">Impacto inicial</span>
                                        <ImpactBadges impactPreview={item.impactPreview} withWords />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <Button
                        size="md"
                        onClick={handleArquetipoContinue}
                        disabled={!arquetipo}
                        className="mt-6 w-full shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
                    >
                        Continuar a Financiamiento <ArrowRight className="h-4 w-4" />
                    </Button>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {FINANCINGS.map((item) => {
                            const isSelected = financiamiento?.id === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setFinanciamiento(item)}
                                    className={`flex w-full flex-col rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                                        isSelected
                                            ? 'border-brand-cobalt bg-blue-50/70 dark:bg-night-selected ring-2 ring-brand-cobalt/50 shadow-md'
                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-night-surface hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                                            {item.titulo}
                                        </h3>
                                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                            isSelected
                                                ? 'border-brand-cobalt bg-brand-cobalt text-white'
                                                : 'border-slate-300 dark:border-slate-700 text-transparent'
                                        }`}>
                                            <Check className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        {item.descripcion}
                                    </p>
                                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                                        <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold">Impacto inicial</span>
                                        <ImpactBadges impactPreview={item.impactPreview} withWords />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <Card className="mt-6 p-4 sm:p-5">
                        <label htmlFor="player-name" className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                            ¿Cómo te llamás? <span className="font-normal text-slate-500 dark:text-slate-400">(opcional)</span>
                        </label>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            Algunas situaciones del juego se dirigirán a vos por tu nombre.
                        </p>
                        <input
                            id="player-name"
                            type="text"
                            value={nombre}
                            maxLength={MAX_PLAYER_NAME_LENGTH}
                            autoComplete="given-name"
                            onChange={(e) => setNombre(e.target.value.replace(/[{}]/g, ''))}
                            placeholder="Tu nombre"
                            className="mt-3 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 focus:border-brand-cobalt"
                        />
                        {sanitizePlayerName(nombre) && (
                            <label className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none animate-in fade-in duration-200">
                                <input
                                    type="checkbox"
                                    checked={recordar}
                                    onChange={(e) => setRecordar(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-brand-cobalt"
                                />
                                Recordar nombre para futuras partidas
                            </label>
                        )}
                    </Card>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                        >
                            <ArrowLeft className="h-4 w-4" /> Volver
                        </button>
                        <Button
                            size="md"
                            onClick={handleStart}
                            disabled={!financiamiento}
                            className="flex-1 shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
                        >
                            Comenzar Simulación <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </section>
            )}
        </main>
    );
}
