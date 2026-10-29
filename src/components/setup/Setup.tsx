import type { Archetype, Financing, Objetivo, Rubro } from '../../types/game';
import { ARCHETYPES, FINANCINGS } from '../../data/archetypes';
import { RUBROS } from '../../data/rubros';
import { OBJETIVOS } from '../../data/objetivos';
import { useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Award, Check, DollarSign, Heart, UserRound } from 'lucide-react';
import { GAME_DURATIONS, MAX_TURNS } from '../../game/phases';
import { CHOICE_ICONS } from './choiceIcons';
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

const VITALS = [
    { key: 'capital', label: 'Capital', icon: DollarSign, hint: 'la caja', color: 'text-metric-capital' },
    { key: 'reputacion', label: 'Reputación', icon: Award, hint: 'la confianza del mercado', color: 'text-metric-reputacion' },
    { key: 'bienestar', label: 'Bienestar', icon: Heart, hint: 'la energía del equipo', color: 'text-metric-bienestar' },
] as const;

/** Pasos del setup: Tu empresa, perfil, financiamiento y objetivo. */
const TOTAL_STEPS = 4;
type SetupStep = 1 | 2 | 3 | 4;

/** Objetivo marcado como el más difícil: lleva una etiqueta en su tarjeta. */
const HARDEST_OBJETIVO_ID = 'o5_modelo';

interface SetupProps {
    onComplete: (arquetipo: Archetype, financiamiento: Financing, nombre?: string, maxTurns?: number, rubroId?: string, objetivoId?: string) => void;
    /** Nombre de la sesión actual (al volver a Setup desde una partida), si no hay uno recordado. */
    initialName?: string;
}

export default function Setup({ onComplete, initialName }: SetupProps) {
    const { theme, toggleTheme } = useTheme();
    const { fxEnabled, toggleFx } = useEffectsToggle();
    const { soundEnabled, toggleSound } = useSoundToggle();
    const [arquetipo, setArquetipo] = useState<Archetype | null>(null);
    const [financiamiento, setFinanciamiento] = useState<Financing | null>(null);
    const [step, setStep] = useState<SetupStep>(1);
    const [maxTurns, setMaxTurns] = useState<number>(MAX_TURNS);
    const [rubro, setRubro] = useState<Rubro | null>(null);
    const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
    // Nombre opcional: se precarga el recordado (casilla tildada) o el de la sesión actual
    const [remembered] = useState(() => loadRememberedName());
    const [nombre, setNombre] = useState(() => remembered ?? initialName ?? '');
    const [recordar, setRecordar] = useState(() => remembered !== undefined);

    const handleArquetipoContinue = () => {
        if (!arquetipo) return;
        setStep(3);
    };

    const handleStart = () => {
        if (!arquetipo || !financiamiento || !objetivo) return;
        const cleanName = sanitizePlayerName(nombre);
        if (cleanName && recordar) {
            rememberName(cleanName);
        } else if (cleanName) {
            // Casilla apagada: este nombre es solo para esta partida y no queda uno recordado anterior
            forgetName();
        }
        // Sin nombre: no se toca lo recordado (jugar anónimo una vez no lo borra)
        onComplete(arquetipo, financiamiento, cleanName, maxTurns, rubro?.id, objetivo.id);
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
            {/* Encabezado: marca, progreso y herramientas */}
            <header className="mb-6 flex items-center justify-between gap-3">
                <span className="font-display text-base sm:text-lg font-extrabold whitespace-nowrap text-slate-900 dark:text-slate-100">El Emprendedor</span>
                <div className="flex items-center gap-2 sm:gap-3">
                    <span
                        aria-label={`Paso ${step} de ${TOTAL_STEPS}`}
                        className="inline-flex items-center gap-1.5 h-8 px-2.5 whitespace-nowrap rounded-full bg-white dark:bg-night-surface border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                    >
                        {Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1).map((item) => (
                            <span
                                key={item}
                                aria-hidden="true"
                                className={`hidden sm:block h-1 w-4 rounded-full ${step >= item ? 'bg-brand-cobalt dark:bg-blue-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                            />
                        ))}
                        {step} de {TOTAL_STEPS}
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
                            Vas a fundar una empresa
                        </h1>
                        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400">
                            En cada turno aparece una situación real de un emprendimiento y elegís qué hacer. Al final ves cómo quedó tu empresa y qué aprendiste del camino.
                        </p>
                    </div>

                    {/* Lo que hay que cuidar: las tres métricas y la regla del 0% (un solo rescate) */}
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
                            Si una llega a 0% tenés un solo rescate; si vuelve a pasar, perdés.
                        </p>
                    </Card>

                    {/* Rubro: de qué trata la empresa; hay que elegirlo, no viene marcado */}
                    <fieldset className="space-y-2">
                        <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">¿A qué rubro pertenece tu empresa?</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {RUBROS.map((item) => {
                                const isSelected = rubro?.id === item.id;
                                const Icon = CHOICE_ICONS[item.id] ?? UserRound;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => setRubro(item)}
                                        className={`relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all ${
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
                                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                isSelected ? 'bg-brand-cobalt text-white' : 'bg-slate-100 text-slate-600 dark:bg-night-canvas dark:text-slate-300'
                                            }`}>
                                                <Icon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                            <span className="text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100">{item.titulo}</span>
                                        </span>
                                        <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.descripcion}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>

                    {/* Duración: dos opciones, con la completa elegida de entrada */}
                    <fieldset className="space-y-2">
                        <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300">¿Cuánto querés que dure?</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                            {GAME_DURATIONS.map((option) => {
                                const isSelected = maxTurns === option.turns;
                                return (
                                    <button
                                        key={option.turns}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => setMaxTurns(option.turns)}
                                        className={`relative flex flex-col gap-1 rounded-2xl border p-4 pr-12 text-left transition-all ${
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
                                        <span className="text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-100">
                                            {option.label} <span className="font-semibold text-slate-500 dark:text-slate-400">· {option.turns} turnos</span>
                                        </span>
                                        <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{option.hint}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>

                    {/* Nombre opcional: personaliza los textos del juego */}
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
                </section>
            )}

            {step === 2 && (
                <section className="flex flex-1 flex-col gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100">
                            ¿Quién va a fundar esta empresa?
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-400">
                            Tu perfil define con qué arrancás y qué te va a costar más.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {ARCHETYPES.map((item) => renderChoice(item, arquetipo?.id === item.id, () => setArquetipo(item)))}
                    </div>
                </section>
            )}

            {step === 3 && (
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

            {step === 4 && (
                <section className="flex flex-1 flex-col gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-slate-100">
                            ¿Qué querés lograr?
                        </h1>
                        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400">
                            Elegí tu objetivo. No cambia las situaciones que te tocan, pero al final te decimos si lo cumpliste. Si perdés la empresa, el objetivo queda sin cumplir.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {OBJETIVOS.map((item) => {
                            const isSelected = objetivo?.id === item.id;
                            const Icon = CHOICE_ICONS[item.id] ?? UserRound;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setObjetivo(item)}
                                    className={`relative flex flex-col gap-3 rounded-2xl border p-4 sm:p-5 text-left transition-all ${
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
                                        <span className="text-lg sm:text-xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">{item.titulo}</span>
                                    </span>
                                    <span className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.descripcion}</span>
                                    {item.id === HARDEST_OBJETIVO_ID && (
                                        <span className="self-start rounded-md border border-amber-200 dark:border-amber-800/70 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                                            Muy difícil
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Acciones: fijas abajo en móvil, en la zona del pulgar; debajo de las tarjetas desde sm */}
            <div className="fixed inset-x-0 bottom-0 z-20 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-brand-canvas/95 dark:bg-night-canvas/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 sm:static sm:z-auto sm:mt-6 sm:p-0 sm:bg-transparent sm:dark:bg-transparent sm:backdrop-blur-none sm:border-0">
                {step === 1 && (
                    <Button
                        size="md"
                        onClick={() => setStep(2)}
                        disabled={!rubro}
                        className="w-full disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                    >
                        {rubro ? (
                            <>
                                Seguir: tu perfil <ArrowRight className="h-4 w-4" />
                            </>
                        ) : (
                            'Elegí un rubro para seguir'
                        )}
                    </Button>
                )}
                {step === 2 && (
                    <div className="flex gap-3">
                        <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                            <ArrowLeft className="h-4 w-4" /> Volver
                        </Button>
                        <Button
                            size="md"
                            onClick={handleArquetipoContinue}
                            disabled={!arquetipo}
                            className="flex-1 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                        >
                            {arquetipo ? (
                                <>
                                    Seguir: cómo te financiás <ArrowRight className="h-4 w-4" />
                                </>
                            ) : (
                                'Elegí un perfil para seguir'
                            )}
                        </Button>
                    </div>
                )}
                {step === 3 && (
                    <div className="flex gap-3">
                        <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                            <ArrowLeft className="h-4 w-4" /> Volver
                        </Button>
                        <Button
                            size="md"
                            onClick={() => setStep(4)}
                            disabled={!financiamiento}
                            className="flex-1 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                        >
                            {financiamiento ? (
                                <>
                                    Seguir: tu objetivo <ArrowRight className="h-4 w-4" />
                                </>
                            ) : (
                                'Elegí cómo financiarte para seguir'
                            )}
                        </Button>
                    </div>
                )}
                {step === 4 && (
                    <div className="flex gap-3">
                        <Button variant="secondary" size="md" onClick={() => setStep(3)}>
                            <ArrowLeft className="h-4 w-4" /> Volver
                        </Button>
                        <Button
                            size="md"
                            onClick={handleStart}
                            disabled={!objetivo}
                            className="flex-1 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                        >
                            {objetivo ? (
                                <>
                                    Comenzar simulación <ArrowRight className="h-4 w-4" />
                                </>
                            ) : (
                                'Elegí un objetivo para empezar'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
