import { describe, it, expect } from 'vitest';
import { GAME_EVENTS } from '../data/events';
import { PHASES } from './phases';
import { _templateBaseEvent, _templateGatedEvent } from '../data/events/_template';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import { intuitionMissMessage } from './intuition';
import { KNOWN_TOKENS, NAME_TOKEN, personalize } from '../lib/personalize';

import {
  validateEventIds,
  validateOptionsAndPills,
  validateTagsIntegrity,
  validatePhasePacing,
  validateScheduledEvents,
  validateConditionIds,
  detectOrphanTags,
  detectDuplicateImpacts,
} from './validation';

describe('Integridad de Contenido (Content Spec)', () => {
  it('todos los eventos tienen IDs únicos y prefijo correcto de fase', () => {
    const errors = validateEventIds(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('todas las opciones tienen 2-3 opciones y learningPill obligatoria', () => {
    const errors = validateOptionsAndPills(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('todos los tags referenciados existen en el registry TAGS', () => {
    const errors = validateTagsIntegrity(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('los eventos programados (schedule) apuntan a IDs existentes', () => {
    const errors = validateScheduledEvents(GAME_EVENTS);
    expect(errors).toEqual([]);
  });

  it('los ids de condiciones ricas (archetype, financing, playedBefore) existen', () => {
    const errors = validateConditionIds(GAME_EVENTS, ARCHETYPES, FINANCINGS);
    expect(errors).toEqual([]);
  });

  it('cada fase tiene suficientes eventos base para sus turnos', () => {
    const errors = validatePhasePacing(GAME_EVENTS, PHASES);
    expect(errors).toEqual([]);
  });

  it('las sorpresas solo están en eventos principales de fase 3 y 4, sin minijuego, y contradicen su tendencia', () => {
    const errors: string[] = [];
    let total = 0;
    for (const ev of GAME_EVENTS) {
      ev.options.forEach((op, i) => {
        if (!op.surprise) return;
        total++;
        const where = `${ev.id} opción ${i + 1}`;
        if (ev.kind !== 'main' || ev.phaseId < 3) errors.push(`${where}: solo eventos principales de fase 3 o 4`);
        if (op.minigame) errors.push(`${where}: tiene minijuego`);
        if (!op.surprise.outcomeText) errors.push(`${where}: sin texto`);
        if (!intuitionMissMessage(op.impactPreview, op.surprise.effects)) errors.push(`${where}: no contradice la tendencia`);
      });
    }
    expect(errors).toEqual([]);
    expect(total).toBe(17);
  });

  it('el template de autoría produce eventos válidos', () => {
    const errors = [
      ...validateEventIds([_templateBaseEvent, _templateGatedEvent]),
      ...validateOptionsAndPills([_templateBaseEvent, _templateGatedEvent]),
      ...validateTagsIntegrity([_templateBaseEvent, _templateGatedEvent]),
      ...validateScheduledEvents([_templateBaseEvent, _templateGatedEvent]),
    ];
    expect(errors).toEqual([]);
  });
});

/** Todos los textos de contenido que el jugador puede ver (donde se resuelven los tokens). */
const contentTexts = (events: typeof GAME_EVENTS): { where: string; text: string }[] =>
  events.flatMap((ev) => [
    { where: `${ev.id}.title`, text: ev.title },
    { where: `${ev.id}.description`, text: ev.description },
    ...ev.options.flatMap((o, i) => [
      { where: `${ev.id}.options[${i}].text`, text: o.text },
      ...(o.outcomeText ? [{ where: `${ev.id}.options[${i}].outcomeText`, text: o.outcomeText }] : []),
      ...(o.learningPill ? [{ where: `${ev.id}.options[${i}].learningPill`, text: o.learningPill }] : []),
    ]),
  ]);

describe('Personalización con {nombre}', () => {
  const texts = contentTexts(GAME_EVENTS);
  const withToken = texts.filter((t) => t.text.includes(NAME_TOKEN));

  it('toda llave en los textos es un token conocido', () => {
    const unknown = texts.flatMap(({ where, text }) =>
      (text.match(/\{[^}]*\}|[{}]/g) ?? [])
        .filter((tok) => !KNOWN_TOKENS.includes(tok))
        .map((tok) => `${where}: "${tok}"`)
    );
    expect(unknown).toEqual([]);
  });

  it('hay entre 8 y 10 eventos de ejemplo con el token', () => {
    const eventsWithToken = new Set(withToken.map((t) => t.where.split('.')[0]));
    expect(eventsWithToken.size).toBeGreaterThanOrEqual(8);
    expect(eventsWithToken.size).toBeLessThanOrEqual(10);
  });

  it('sin nombre, ningún texto queda con llaves, dobles espacios, espacios antes de puntuación ni minúscula inicial', () => {
    const problems = withToken.flatMap(({ where, text }) => {
      const out = personalize(text);
      const issues: string[] = [];
      if (/[{}]/.test(out)) issues.push('llaves');
      if (/\s{2,}/.test(out)) issues.push('doble espacio');
      if (/\s[,.;:!?]/.test(out)) issues.push('espacio antes de puntuación');
      if (/(^|[.!?]\s+)\p{Ll}/u.test(out)) issues.push('minúscula inicial de oración');
      return issues.map((i) => `${where}: ${i} → "${out}"`);
    });
    expect(problems).toEqual([]);
  });

  it('con nombre, el texto lo incluye y no deja llaves', () => {
    const problems = withToken.flatMap(({ where, text }) => {
      const out = personalize(text, 'Santi');
      return out.includes('Santi') && !/[{}]/.test(out) ? [] : [`${where} → "${out}"`];
    });
    expect(problems).toEqual([]);
  });
});

describe('Balance de Contenido (warnings informativos)', () => {
  it('reporta tags huérfanos (no bloquea)', () => {
    const warnings = detectOrphanTags(GAME_EVENTS);
    if (warnings.length > 0) {
      console.log('\nTags huérfanos:');
      warnings.forEach((w) => console.log(`  - ${w}`));
    }
    expect(warnings).toBeDefined();
  });

  it('reporta impactos numéricos repetidos entre opciones (no bloquea)', () => {
    const warnings = detectDuplicateImpacts(GAME_EVENTS);
    if (warnings.length > 0) {
      console.log('\nImpactos repetidos:');
      warnings.forEach((w) => console.log(`  - ${w}`));
    }
    expect(warnings).toBeDefined();
  });
});
