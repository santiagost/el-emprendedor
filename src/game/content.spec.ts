import { describe, it, expect } from 'vitest';
import { GAME_EVENTS, MAIN_EVENTS } from '../data/events';
import { phasesFor } from './phases';
import { _templateBaseEvent, _templateGatedEvent, _templateRubroVariantEvent, _templateMilestoneEvent, _templateRescueEvent, _templateEndingEvent } from '../data/events/_template';
import { ARCHETYPES, FINANCINGS } from '../data/archetypes';
import { RUBROS } from '../data/rubros';
import { startGame } from './engine';
import { intuitionMissMessage } from './intuition';
import { KNOWN_TOKENS, NAME_TOKEN, personalize } from '../lib/personalize';

import {
  validateEventIds,
  validateOptionsAndPills,
  validateTagsIntegrity,
  validatePhasePacing,
  validateMilestones,
  validateEndingOptions,
  validateScheduledEvents,
  validateConditionIds,
  detectOrphanTags,
  detectDuplicateImpacts,
} from './validation';

const TEMPLATES = [_templateBaseEvent, _templateGatedEvent, _templateRubroVariantEvent, _templateMilestoneEvent, _templateRescueEvent, _templateEndingEvent];

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

  it('los ids de condiciones ricas (archetype, financing, rubro, playedBefore) existen', () => {
    const errors = validateConditionIds(GAME_EVENTS, ARCHETYPES, FINANCINGS, RUBROS);
    expect(errors).toEqual([]);
  });

  it.each([10, 15])('cada fase tiene suficientes eventos base para sus turnos (partida de %i turnos)', (maxTurns) => {
    const errors = validatePhasePacing(GAME_EVENTS, phasesFor(maxTurns), RUBROS);
    expect(errors).toEqual([]);
  });

  it('cada fase tiene un solo hito, sin condiciones de entrada salvo el rubro', () => {
    expect(validateMilestones(GAME_EVENTS, phasesFor(15), RUBROS)).toEqual([]);
  });

  it('validateMilestones detecta fases sin hito, con dos, o con hitos condicionados', () => {
    const base = GAME_EVENTS.filter((ev) => !ev.milestone);
    const phases = phasesFor(15);
    expect(validateMilestones(base, phases, RUBROS).length).toBe(phases.length * RUBROS.length);
    const dup = [...GAME_EVENTS, { ...GAME_EVENTS.find((ev) => ev.id === 'f2_primera_contratacion')!, id: 'f2_otro_hito' }];
    expect(validateMilestones(dup, phases, RUBROS).some((e) => e.includes('tiene 2 hitos'))).toBe(true);
    const gated = GAME_EVENTS.map((ev) => (ev.id === 'f3_ronda_inversion' ? { ...ev, when: { tags: ['cultura_lean' as const] } } : ev));
    expect(validateMilestones(gated, phases, RUBROS).some((e) => e.includes('condiciones de entrada'))).toBe(true);
  });

  it('las opciones que cierran la partida son de eventos principales y suman una etiqueta de salida', () => {
    expect(validateEndingOptions(GAME_EVENTS)).toEqual([]);
    expect(GAME_EVENTS.some((ev) => ev.options.some((op) => op.endsGame))).toBe(true);
  });

  it('validateEndingOptions detecta cierres sin etiqueta de salida, en imprevistos o con minijuego', () => {
    const sale = GAME_EVENTS.find((ev) => ev.id === 'f4_intento_compra_hostil')!;
    const withOption = (patch: object) => ({ ...sale, options: [{ ...sale.options[0], ...patch }, sale.options[1]] as typeof sale.options });
    expect(validateEndingOptions([withOption({ addTags: ['calidad_producto'] })]).some((e) => e.includes('etiqueta de salida'))).toBe(true);
    expect(validateEndingOptions([{ ...withOption({}), kind: 'unforeseen' as const }]).some((e) => e.includes('solo los principales'))).toBe(true);
    expect(validateEndingOptions([withOption({ minigame: { kind: 'roulette' } })]).some((e) => e.includes('minijuego'))).toBe(true);
    expect(validateEndingOptions([withOption({ scheduledEvent: { eventId: 'f4_x', delayTurns: 1 } })]).some((e) => e.includes('programar'))).toBe(true);
  });

  it('las sorpresas solo están en eventos principales de fase 3 y 4, sin minijuego, y contradicen su tendencia', () => {
    const errors: string[] = [];
    // Cada rubro ve 24 sorpresas: las versiones por rubro de un mismo evento no se suman
    const totalByRubro = Object.fromEntries(RUBROS.map((r) => [r.id, 0]));
    for (const ev of GAME_EVENTS) {
      ev.options.forEach((op, i) => {
        if (!op.surprise) return;
        for (const r of RUBROS) {
          if (!ev.when?.rubro?.length || ev.when.rubro.includes(r.id)) totalByRubro[r.id]++;
        }
        const where = `${ev.id} opción ${i + 1}`;
        if (ev.kind !== 'main' || ev.phaseId < 3) errors.push(`${where}: solo eventos principales de fase 3 o 4`);
        if (op.minigame) errors.push(`${where}: tiene minijuego`);
        if (!op.surprise.outcomeText) errors.push(`${where}: sin texto`);
        if (!intuitionMissMessage(op.impactPreview, op.surprise.effects)) errors.push(`${where}: no contradice la tendencia`);
      });
    }
    expect(errors).toEqual([]);
    expect(Object.values(totalByRubro)).toEqual(RUBROS.map(() => 24));
  });

  it('el template de autoría produce eventos válidos', () => {
    const errors = [
      ...validateEventIds(TEMPLATES),
      ...validateOptionsAndPills(TEMPLATES),
      ...validateTagsIntegrity(TEMPLATES),
      ...validateScheduledEvents(TEMPLATES),
      ...validateEndingOptions(TEMPLATES),
    ];
    expect(errors).toEqual([]);
  });

  it('un evento con un rubro inexistente se detecta y uno con rubro válido no', () => {
    const withRubro = (rubro: string) => ({ ..._templateBaseEvent, when: { rubro: [rubro] } });
    expect(validateConditionIds([withRubro('r9_inexistente')], ARCHETYPES, FINANCINGS, RUBROS)).toHaveLength(1);
    expect(validateConditionIds([withRubro('r2_comercio')], ARCHETYPES, FINANCINGS, RUBROS)).toEqual([]);
  });

  it('un evento de un solo rubro cuenta como base solo para ese rubro', () => {
    const phase = phasesFor(15)[0];
    const base = { ..._templateBaseEvent, id: 'f1_base', phaseId: 1 as const };
    const gated = { ..._templateBaseEvent, id: 'f1_solo_comercio', phaseId: 1 as const, when: { rubro: ['r2_comercio'] } };
    const rubros = RUBROS.slice(0, 2); // tecnología y comercio
    expect(validatePhasePacing([base, base, base], [phase], rubros)).toEqual([]);
    // Con dos eventos para todos y uno solo de comercio, tecnología se queda sin el tercero
    const errors = validatePhasePacing([base, base, gated], [phase], rubros);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('r1_tecnologia');
  });

  it('cada rubro ve una versión de los eventos de software y las mismas cifras en todas', () => {
    const family = (prefix: string) => GAME_EVENTS.filter((ev) => ev.id === prefix || ev.id.startsWith(`${prefix}_`));
    const effectsOf = (ev: (typeof GAME_EVENTS)[number]) => ev.options.map((o) => JSON.stringify(o.effects));
    for (const prefix of ['f1_mvp_calidad', 'f3_caida_servicio']) {
      const versions = family(prefix);
      expect(versions.map((ev) => ev.when?.rubro).sort()).toEqual(RUBROS.map((r) => [r.id]).sort());
      versions.forEach((ev) => expect(effectsOf(ev), ev.id).toEqual(effectsOf(versions[0])));
    }
    const imprevistos = GAME_EVENTS.filter((ev) => ev.id === 'imp_caida_servidores' || ['imp_corte_cobros', 'imp_caida_agenda', 'imp_corte_energia'].includes(ev.id));
    expect(imprevistos.map((ev) => ev.when?.rubro?.[0]).sort()).toEqual(RUBROS.map((r) => r.id).sort());
    imprevistos.forEach((ev) => expect(effectsOf(ev), ev.id).toEqual(effectsOf(imprevistos[0])));
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

  it('cada rubro ve entre 8 y 10 eventos de ejemplo con el token', () => {
    const eventsWithToken = new Set(withToken.map((t) => t.where.split('.')[0]));
    for (const rubro of RUBROS) {
      const seen = GAME_EVENTS.filter(
        (ev) => eventsWithToken.has(ev.id) && (!ev.when?.rubro?.length || ev.when.rubro.includes(rubro.id))
      );
      expect(seen.length, rubro.id).toBeGreaterThanOrEqual(8);
      expect(seen.length, rubro.id).toBeLessThanOrEqual(10);
    }
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

describe('Eventos de rescate', () => {
  const rescue = GAME_EVENTS.filter((ev) => ev.kind === 'rescue');

  it('hay uno por métrica, con id rescate_<métrica>, y las opciones suben esa métrica', () => {
    expect(rescue.map((ev) => ev.id).sort()).toEqual(['rescate_bienestar', 'rescate_capital', 'rescate_reputacion']);
    for (const ev of rescue) {
      const metric = ev.id.replace('rescate_', '') as 'capital' | 'bienestar' | 'reputacion';
      for (const option of ev.options) expect(option.effects[metric] ?? 0, `${ev.id}: ${option.text}`).toBeGreaterThanOrEqual(25);
    }
  });

  it('los costos inmediatos son chicos: el rescate no mata a la empresa por otro lado', () => {
    for (const ev of rescue) {
      for (const option of ev.options) {
        const costs = Object.values(option.effects).filter((v) => v < 0);
        for (const cost of costs) expect(cost, `${ev.id}: ${option.text}`).toBeGreaterThanOrEqual(-5);
      }
    }
  });

  it('no entran al sorteo de eventos principales ni de fase', () => {
    expect(MAIN_EVENTS.some((ev) => ev.kind === 'rescue')).toBe(false);
  });
});

describe('Balance de ritmo (parte 8)', () => {
  it('la crisis de caja tiene una salida que no toca el bienestar', () => {
    const crisis = GAME_EVENTS.find((ev) => ev.id === 'crisis_quiebra_inminente')!;
    expect(crisis.options.some((o) => (o.effects.bienestar ?? 0) >= 0)).toBe(true);
    expect(crisis.options.some((o) => (o.effects.bienestar ?? 0) < 0)).toBe(true);
  });

  it('ninguna combinación de perfil y financiamiento arranca con el capital a 10 puntos de la crisis', () => {
    for (const a of ARCHETYPES) {
      for (const f of FINANCINGS) {
        const { metrics } = startGame(a, f);
        expect(metrics.capital, `${a.id} + ${f.id}`).toBeGreaterThanOrEqual(35);
      }
    }
  });
});
