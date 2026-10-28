import type { Archetype, Financing } from '../../types/game';
import { ARCHETYPES, FINANCINGS } from '../../data/archetypes';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, ArrowLeft, ArrowRight, Award, Check, Cpu, DollarSign, Handshake, Heart, Landmark, Megaphone, PiggyBank, UserRound, Wallet } from 'lucide-react';
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

/** Ícono de cada perfil y esquema de financiamiento (C4). */
const CHOICE_ICONS: Record<string, LucideIcon> = {
    a1_tecnico: Cpu,
    a2_comercial: Megaphone,
    a3_inversionista: PiggyBank,
    f1_bootstrap: Wallet,
    f2_prestamo_bancario: Landmark,
    f3_socio_angel: Handshake,
};

const VITALS = [
    { key: 'capital', label: 'Capital', icon: DollarSign, hint: 'la caja', color: 'text-metric-capital' },
    { key: 'reputacion', label: 'Reputación', icon: Award, hint: 'la confianza del mercado', color: 'text-metric-reputacion' },
    { key: 'bienestar', label: 'Bienestar', icon: Heart, hint: 'la energía del equipo', color: 'text-metric-bienestar' },
] as const;

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

    // Tarjeta de perfil o financiamiento: una ficha que se toca, con ícono, descripción e impacto inicial (C4)
    const renderChoice = (item: Archetype | Financing, isSelected: boolean, onSelect: () => void) => {
        const Icon = CHOICE_ICONS[item.id] ?? UserRound;
        return (
            <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={onSelect}
                className={`relative flex w-full flex-col gap-3 rounded-2xl border p-4 sm:p-5 text-left transition-all ${
                    isSelected
                        ? 'border-brand-cobalt bg-blue-50/70 dark:bg-night-selected ring-2 ring-brand-cobalt/50'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-night-surface hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
                <span className={`absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                        ? 'border-brand-cobalt bg-brand-cobalt text-white'
                        : 'border-slate-300 dark:border-slate-700 text-transparent'
                }`}>
                    <Check className="h-3.5 w-3.5" />
                </span>
                <span className="flex items-center gap-3 pr-8">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isSelected ? 'bg-brand-cobalt text-white' : 'bg-slate-100 text-slate-600 dark:bg-night-canvas dark:text-slate-300'
                    }`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">
                        {item.titulo}
                    </h3>
                </span>
                <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.descripcion}
                </p>
                <div className="space-y-1.5">
                    <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold">Impacto inicial</span>
                    <ImpactBadges impactPreview={item.impactPreview} withWords />
                </div>
            </button>
        );
    };

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 sm:px-6 pt-4 pb-28 sm:py-8">
            {/* Encabezado: marca, progreso 1 de 2 y herramientas */}
            <header className="mb-6 flex items-center justify-between gap-3">
                <span className="font-display text-base sm:text-lg font-extrabold whitespace-nowrap text-slate-900 dark:text-slate-100">El Emprendedor</span>
                <div className="flex items-center gap-2 sm:gap-3">
                    <span
                        aria-label={`Paso ${step} de 2`}
                        className="inline-flex items-center gap-1.5 h-8 px-2.5 whitespace-nowrap rounded-full bg-white dark:bg-night-surface border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                    >
                        {[1, 2].map((item) => (
                            <span
                                key={item}
                                aria-hidden="true"
                                className={`hidden sm:block h-1 w-4 rounded-full ${step >= item ? 'bg-brand-cobalt dark:bg-blue-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                            />
                        ))}
                        {step} de 2
                    </span>
                    <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
                    <EffectsToggle fxEnabled={fxEnabled} onToggle={toggleFx} />
                    <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>
            </header>

            {step === 1 && (
                <section className="flex flex-1 flex-col gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100">
                            ¿Quién va a fundar esta empresa?
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-400">
                            Tu perfil define con qué arrancás y qué te va a costar más.
                        </p>
                    </div>

                    {/* Nombre opcional, arriba: personaliza los textos del juego */}
                    <div className="space-y-1.5 max-w-md">
                        <label htmlFor="player-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Tu nombre <span className="font-normal text-slate-500 dark:text-slate-400">(opcional)</span>
                        </label>
                        <input
                            id="player-name"
                            type="text"
                            value={nombre}
                            maxLength={MAX_PLAYER_NAME_LENGTH}
                            autoComplete="given-name"
                            onChange={(e) => setNombre(e.target.value.replace(/[{}]/g, ''))}
                            placeholder="Tu nombre"
                            className="w-full h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-night-surface px-3.5 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cobalt/50 focus:border-brand-cobalt"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Algunas situaciones del juego se dirigirán a vos por tu nombre.
                        </p>
                        {sanitizePlayerName(nombre) && (
                            <label className="flex items-center gap-2 pt-1 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none animate-in fade-in duration-200">
                                <input
                                    type="checkbox"
                                    checked={recordar}
                                    onChange={(e) => setRecordar(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-brand-cobalt"
                                />
                                Recordar nombre para futuras partidas
                            </label>
                        )}
                    </div>

                    {/* Lo que hay que cuidar: las tres métricas y la regla del 0% */}
                    <Card className="p-4 space-y-2.5">
                        <span className="block text-sm font-semibold text-slate-600 dark:text-slate-300">Lo que tenés que cuidar</span>
                        <ul className="space-y-2 text-sm">
                            {VITALS.map(({ key, label, icon: Icon, hint, color }) => (
                                <li key={key} className="grid grid-cols-[auto_6.5rem_minmax(0,1fr)] items-center gap-2.5">
                                    <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                                    <strong className="font-bold text-slate-900 dark:text-slate-100">{label}</strong>
                                    <span className="text-slate-600 dark:text-slate-400">{hint}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="flex items-center gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-sm font-semibold text-metric-peligro">
                            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Si cualquiera llega a 0%, perdés al instante.
                        </p>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {ARCHETYPES.map((item) => renderChoice(item, arquetipo?.id === item.id, () => setArquetipo(item)))}
                    </div>
                </section>
            )}

            {step === 2 && (
                <section className="flex flex-1 flex-col gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100">
                            ¿Cómo te financiás?
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-400">
                            Elegí el esquema financiero inicial: velocidad de capital vs autonomía de control.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {FINANCINGS.map((item) => renderChoice(item, financiamiento?.id === item.id, () => setFinanciamiento(item)))}
                    </div>
                </section>
            )}

            {/* Acciones: fijas abajo en móvil, en la zona del pulgar; debajo de las tarjetas desde sm */}
            <div className="fixed inset-x-0 bottom-0 z-20 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-brand-canvas/95 dark:bg-night-canvas/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 sm:static sm:z-auto sm:mt-6 sm:p-0 sm:bg-transparent sm:dark:bg-transparent sm:backdrop-blur-none sm:border-0">
                {step === 1 ? (
                    <Button
                        size="md"
                        onClick={handleArquetipoContinue}
                        disabled={!arquetipo}
                        className="w-full disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                    >
                        {arquetipo ? (
                            <>
                                Seguir: cómo te financiás <ArrowRight className="h-4 w-4" />
                            </>
                        ) : (
                            'Elegí un perfil para seguir'
                        )}
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                            <ArrowLeft className="h-4 w-4" /> Volver
                        </Button>
                        <Button
                            size="md"
                            onClick={handleStart}
                            disabled={!financiamiento}
                            className="flex-1 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                        >
                            {financiamiento ? (
                                <>
                                    Comenzar simulación <ArrowRight className="h-4 w-4" />
                                </>
                            ) : (
                                'Elegí cómo financiarte para empezar'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
