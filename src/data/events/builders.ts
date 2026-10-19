import type {
    Metrics,
    GameOption,
    GameEvent,
    EventConditions,
    ImpactDirection,
    ImpactPreview
} from "../../types/game";
import type { PhaseId } from "../../game/phases";

const trendOf = (value?: number): ImpactDirection => {
    if (value == null || value == 0) return 'neutral';
    return value > 0 ? 'up' : 'down';
};

export const trendsOf = (effects: Partial<Metrics>): ImpactPreview => ({
    capital: trendOf(effects.capital),
    bienestar: trendOf(effects.bienestar),
    reputacion: trendOf(effects.reputacion)
})

export const defineOption = (
    text: string,
    effects: Partial<Metrics>,
    extra?: Omit<GameOption, 'effects' | 'impactPreview' | 'text'>
): GameOption => ({
    text,
    effects,
    impactPreview: trendsOf(effects),
    ...extra,
})

export const defineEvent = (e: {
    id: `${'f1' | 'f2' | 'f3' | 'f4'}_${string}`;
    phaseId?: PhaseId;
    phase?: PhaseId;
    title: string;
    description: string;
    weight?: number;
    when?: EventConditions;
    options: [GameOption, GameOption] | [GameOption, GameOption, GameOption];
}): GameEvent => {
    const phaseId = e.phaseId ?? e.phase;

    if (!phaseId) {
        throw new Error(`Evento "${e.id}": debe especificar phaseId (o phase).`);
    }

    if (import.meta.env?.DEV) {
        if (!e.id.startsWith(`f${phaseId}_`)) {
            throw new Error(`Evento "${e.id}" no coincide con su phaseId (${phaseId}). Debe empezar con "f${phaseId}_".`);
        }
        if (e.options.length < 2 || e.options.length > 3) {
            throw new Error(`Evento "${e.id}": debe tener 2 o 3 opciones (tiene ${e.options.length}).`);
        }
        if (e.options.some((opt) => !opt.learningPill || opt.learningPill.trim() === '')) {
            throw new Error(`Evento "${e.id}": todas las opciones deben incluir learningPill.`);
        }
    }
    return {
        id: e.id,
        phaseId,
        title: e.title,
        description: e.description,
        weight: e.weight ?? 10,
        when: e.when,
        requiredTags: e.when?.tags,
        forbiddenTags: e.when?.forbiddenTags,
        options: e.options,
    };
}
